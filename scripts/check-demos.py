#!/usr/bin/env python3
"""Check all three consumers in disposable copies, optionally against a CEE candidate.

The CLI owns local invocation; CEE CI invokes this same runner on its staged package.
Only a successful, unchanged input set can satisfy an --if-changed invocation.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
DEMOS = ('cedar-cee-demo-angular-src', 'cedar-cee-demo-react', 'cedar-cee-demo-ember-src')
# Host-facing implementation, declarations, registration and packaging. Internal field
# rendering changes remain covered by CEE's own gates and don't invalidate this gate.
CEE_INPUTS = (
    'package.json', 'package-lock.json', '.npmrc', '.nvmrc', 'angular.json',
    'tsconfig*.json', 'scripts/**/*', 'src/main.ts', 'src/polyfills.ts',
    'src/app/app.module*.ts', 'src/app/bootstrap-once.ts', 'src/app/cee-public-api.ts',
    'src/app/modules/shared/components/cedar-embeddable-metadata-editor/**/*',
    'src/app/modules/shared/components/*wrapper*/**/*',
    'src/app/modules/shared/util/*config*', 'README.md',
)


def source_files(root):
    names = subprocess.check_output(
        ['git', '-C', str(root), 'ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    return sorted({Path(os.fsdecode(name)) for name in names.split(b'\0') if name})


def add_file(digest, label, path):
    digest.update(label.encode() + b'\0')
    digest.update(path.read_bytes() if path.is_file() else b'<missing>')
    digest.update(b'\0')


def package_contract(package):
    """Ignore implementation bytes, but track exports, declarations and file layout."""
    if package.is_dir():
        files = {p.relative_to(package).as_posix(): p.read_bytes()
                 for p in package.rglob('*') if p.is_file()}
    else:
        with tarfile.open(package) as archive:
            files = {m.name.removeprefix('package/'): archive.extractfile(m).read()
                     for m in archive.getmembers() if m.isfile()}
    metadata = json.loads(files['package.json'])
    if metadata.get('name') not in ('cedar-embeddable-editor', '@org.metadatacenter/cedar-embeddable-editor'):
        raise ValueError('The candidate must be a CEE npm package')
    # npm never includes package-lock.json in a tarball. Treat a staging directory
    # and the tarball packed from it as the same consumer contract.
    files.pop('package-lock.json', None)
    return {'files': sorted(files), 'metadata': metadata,
            'declarations': {name: data.decode() for name, data in files.items() if name.endswith('.d.ts')}}


def package_digest(package):
    if package is None:
        return None
    digest = hashlib.sha256()
    if package.is_file():
        digest.update(package.read_bytes())
    else:
        for path in sorted(p for p in package.rglob('*') if p.is_file()):
            add_file(digest, path.relative_to(package).as_posix(), path)
    return digest.hexdigest()


def fingerprint(root, package=None, cee_source=None, consumer_inputs=()):
    digest = hashlib.sha256(b'cee-demos-v1\0')
    for relative in source_files(root):
        if relative.parts[0] in (*DEMOS, 'scripts', '.github') or len(relative.parts) == 1:
            add_file(digest, relative.as_posix(), root / relative)
    if cee_source:
        selected = {p for pattern in CEE_INPUTS for p in cee_source.glob(pattern) if p.is_file()}
        for path in sorted(selected):
            add_file(digest, 'cee/' + path.relative_to(cee_source).as_posix(), path)
    for index, path in enumerate(consumer_inputs):
        add_file(digest, f'consumer/{index}/{path.name}', path)
    if package:
        digest.update(json.dumps(package_contract(package), sort_keys=True).encode())
    else:
        digest.update(b'pinned-consumers')
    return digest.hexdigest()


def run(command, cwd, environment):
    print(f'[{cwd.name}] {" ".join(command)}', flush=True)
    start = time.monotonic()
    subprocess.run(command, cwd=cwd, env=environment, check=True)
    return {'demo': cwd.name, 'command': command, 'seconds': round(time.monotonic() - start, 3)}


def check(root=ROOT, *, package=None, cee_source=None, consumer_inputs=(), state=None,
          if_changed=False, scratch=None):
    before = fingerprint(root, package, cee_source, consumer_inputs)
    if if_changed and state:
        try:
            previous = json.loads(state.read_text())
        except (OSError, ValueError):
            previous = {}
        if isinstance(previous, dict) and previous.get('passed') is True and previous.get('inputs') == before:
            print('CEE demos: embedding API, packaging, consumer pins and demo inputs unchanged; '
                  'reusing the passing demo check.', flush=True)
            return False
    candidate_before = package_digest(package)
    print('Checking Angular, React and Ember CEE integrations.', flush=True)
    environment = {**os.environ, 'CI': 'true'}
    commands = []
    with tempfile.TemporaryDirectory(prefix='cee-demos-', dir=scratch) as temporary:
        work = Path(temporary)
        candidate = None
        if package:
            if package.is_dir():
                output = subprocess.check_output(
                    ['npm', 'pack', '--ignore-scripts', '--json', '--pack-destination', str(work)],
                    cwd=package, env=environment, text=True)
                candidate = work / json.loads(output)[0]['filename']
            else:
                candidate = work / 'cee.tgz'
                shutil.copy2(package, candidate)
        files = source_files(root)
        for demo in DEMOS:
            destination = work / demo
            for relative in files:
                if relative.parts[0] != demo:
                    continue
                source = root / relative
                if not source.is_file():
                    continue
                target = work / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, target)
            if candidate:
                manifest_path = destination / 'package.json'
                manifest = json.loads(manifest_path.read_text())
                found = False
                for section in ('dependencies', 'devDependencies'):
                    if 'cedar-embeddable-editor' in manifest.get(section, {}):
                        manifest[section]['cedar-embeddable-editor'] = 'file:' + str(candidate)
                        found = True
                if not found:
                    raise ValueError(f'{demo} has no CEE dependency')
                manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
            install = ['npm', 'install' if candidate else 'ci', '--no-audit', '--no-fund']
            commands.append(run(install, destination, environment))
            for command in (['npm', 'run', 'lint'],
                            ['npm', 'run', 'test:ember'] if 'ember' in demo else ['npm', 'test', '--', '--watch=false'] if 'angular' in demo else ['npm', 'test'],
                            ['npm', 'run', 'build']):
                commands.append(run(command, destination, environment))
        if (fingerprint(root, package, cee_source, consumer_inputs) != before
                or package_digest(package) != candidate_before):
            raise ValueError('CEE demo inputs changed during verification; rerun the check')
        if state:
            state.parent.mkdir(parents=True, exist_ok=True)
            report = {'passed': True, 'inputs': before, 'commands': commands,
                      'candidate': str(package) if package else None,
                      'candidateSha256': hashlib.sha256(candidate.read_bytes()).hexdigest() if candidate else None}
            with tempfile.NamedTemporaryFile(mode='w', dir=state.parent, delete=False) as stream:
                json.dump(report, stream, indent=2)
                stream.write('\n')
            os.replace(stream.name, state)
    print('CEE demos: all three passed lint, integration tests and production builds.', flush=True)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cee-package', type=Path, help='Staged CEE package directory or npm tarball')
    parser.add_argument('--cee-source', type=Path)
    parser.add_argument('--consumer-input', type=Path, action='append', default=[])
    parser.add_argument('--state', type=Path)
    parser.add_argument('--if-changed', action='store_true')
    parser.add_argument('--scratch', type=Path)
    args = parser.parse_args()
    if args.if_changed and not args.state:
        parser.error('--if-changed requires --state')
    try:
        check(package=args.cee_package.resolve() if args.cee_package else None,
              cee_source=args.cee_source, consumer_inputs=args.consumer_input,
              state=args.state, if_changed=args.if_changed, scratch=args.scratch)
    except (OSError, ValueError, KeyError, tarfile.TarError, subprocess.CalledProcessError) as error:
        parser.exit(1, f'CEE demo check failed: {error}\n')


if __name__ == '__main__':
    main()
