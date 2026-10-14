import importlib.util
import json
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('check_demos', Path(__file__).parents[1] / 'check-demos.py')
gate = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(gate)


class DemoGateTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        self.state = self.root / 'evidence.json'
        self.write('.gitignore', 'evidence.json\nignored/\n')
        for demo in gate.DEMOS:
            self.write(f'{demo}/package.json', json.dumps({'dependencies': {'cedar-embeddable-editor': '2.0.23'}}))
            self.write(f'{demo}/package-lock.json', '{}')
            self.write(f'{demo}/src/app.js', 'initial')
        self.calls = []

    def write(self, relative, text):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        return path

    def fake_command(self, command, cwd, environment):
        self.calls.append((command, cwd.name))
        self.assertTrue(str(cwd).startswith(tempfile.gettempdir()))
        self.assertNotEqual(self.root / cwd.name, cwd)
        self.assertEqual('true', environment['CI'])
        return {'demo': cwd.name, 'command': command, 'seconds': 0}

    def test_first_run_checks_every_demo_then_reuses_only_passing_inputs(self):
        with patch.object(gate, 'run', side_effect=self.fake_command):
            self.assertTrue(gate.check(self.root, state=self.state, if_changed=True))
            self.assertEqual(12, len(self.calls))
            self.assertFalse(gate.check(self.root, state=self.state, if_changed=True))
            self.assertEqual(12, len(self.calls))
            self.assertTrue(gate.check(self.root, state=self.state))
            self.assertEqual(24, len(self.calls))
        self.assertTrue(json.loads(self.state.read_text())['passed'])

    def test_failed_demo_does_not_record_success_or_hide_a_retry(self):
        with patch.object(gate, 'run', side_effect=subprocess.CalledProcessError(7, 'test')):
            with self.assertRaises(subprocess.CalledProcessError):
                gate.check(self.root, state=self.state, if_changed=True)
        self.assertFalse(self.state.exists())
        with patch.object(gate, 'run', side_effect=self.fake_command):
            self.assertTrue(gate.check(self.root, state=self.state, if_changed=True))

    def test_corrupt_evidence_reruns(self):
        for contents in ('{broken', '[]', 'null'):
            self.state.write_text(contents)
            with patch.object(gate, 'run', side_effect=self.fake_command):
                self.assertTrue(gate.check(self.root, state=self.state, if_changed=True))

    def test_contract_pins_packaging_and_demo_changes_invalidate_but_internal_rendering_does_not(self):
        cee = self.root / 'cee'
        paths = [self.write('cee/src/app/cee-public-api.ts', 'types'),
                 self.write('cee/src/app/app.module.prod.ts', 'registration'),
                 self.write('cee/src/app/modules/shared/components/cedar-embeddable-metadata-editor-wrapper/wrapper.ts', 'wrapper'),
                 self.write('cee/scripts/stage-npm-package.mjs', 'packaging'),
                 self.write('cee/package-lock.json', '{}'),
                 self.root / gate.DEMOS[0] / 'package.json',
                 self.root / gate.DEMOS[1] / 'src/app.js']
        pin = self.write('consumer/package-lock.json', 'pin')
        def fingerprint():
            return gate.fingerprint(self.root, cee_source=cee, consumer_inputs=[pin])
        for path in [*paths, pin]:
            before = fingerprint()
            path.write_text(path.read_text() + '\nchanged')
            self.assertNotEqual(before, fingerprint(), path)
        before = fingerprint()
        self.write('cee/src/app/internal-field.ts', 'rendering change')
        self.assertEqual(before, fingerprint())

    def test_added_and_deleted_demo_source_invalidate(self):
        before = gate.fingerprint(self.root)
        source = self.write(gate.DEMOS[0] + '/src/new.js', 'new')
        self.assertNotEqual(before, gate.fingerprint(self.root))
        source.unlink()
        self.assertEqual(before, gate.fingerprint(self.root))

    def test_candidate_contract_ignores_bundle_implementation_but_tracks_types(self):
        candidate = self.root / 'candidate'
        self.write('candidate/package.json', '{"name":"cedar-embeddable-editor","version":"2.0.23"}')
        bundle = self.write('candidate/cedar-embeddable-editor.js', 'bundle one')
        types = self.write('candidate/cedar-embeddable-editor.d.ts', 'types one')
        before = gate.fingerprint(self.root, candidate)
        digest = gate.package_digest(candidate)
        bundle.write_text('bundle two')
        self.assertEqual(before, gate.fingerprint(self.root, candidate))
        self.assertNotEqual(digest, gate.package_digest(candidate))
        types.write_text('types two')
        self.assertNotEqual(before, gate.fingerprint(self.root, candidate))

    def test_mutating_inputs_during_tests_cannot_record_success(self):
        def mutate(command, cwd, env):
            self.write(gate.DEMOS[0] + '/src/app.js', str(len(self.calls)))
            return self.fake_command(command, cwd, env)
        with patch.object(gate, 'run', side_effect=mutate):
            with self.assertRaisesRegex(ValueError, 'inputs changed'):
                gate.check(self.root, state=self.state)
        self.assertFalse(self.state.exists())

    def test_candidate_is_installed_in_copies_without_rewriting_source_pins(self):
        metadata = self.write('candidate/package.json', '{"name":"@org.metadatacenter/cedar-embeddable-editor","version":"2.0.24-dev.test"}')
        candidate = self.root / 'candidate.tgz'
        with tarfile.open(candidate, 'w:gz') as archive:
            archive.add(metadata, arcname='package/package.json')
        installs = []
        def inspect(command, cwd, environment):
            if command[:2] == ['npm', 'install']:
                dependency = json.loads((cwd / 'package.json').read_text())['dependencies']['cedar-embeddable-editor']
                self.assertTrue(dependency.startswith('file:'))
                self.assertEqual(candidate.read_bytes(), Path(dependency[5:]).read_bytes())
                installs.append(cwd.name)
            return self.fake_command(command, cwd, environment)
        with patch.object(gate, 'run', side_effect=inspect):
            gate.check(self.root, package=candidate, state=self.state)
        self.assertEqual(list(gate.DEMOS), installs)
        for demo in gate.DEMOS:
            self.assertEqual('2.0.23', json.loads((self.root / demo / 'package.json').read_text())['dependencies']['cedar-embeddable-editor'])


if __name__ == '__main__':
    unittest.main()
