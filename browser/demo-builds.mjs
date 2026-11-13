import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(process.env.CEDAR_DEMO_BUILD_ROOT ?? fileURLToPath(new URL('..', import.meta.url)));
export const builds = {
  angular: { directory: 'cedar-cee-demo-angular-src/dist/cedar-cee-demo-angular-src/browser', port: 47941 },
  react: { directory: 'cedar-cee-demo-react/build', port: 47942 },
  ember: { directory: 'cedar-cee-demo-ember-src/dist', port: 47943 },
};
export const selected = process.env.CEDAR_DEMO_FRAMEWORKS?.split(',') ?? Object.keys(builds);
if (!selected.length || selected.some(name => !builds[name]) || new Set(selected).size !== selected.length)
  throw new Error('CEDAR_DEMO_FRAMEWORKS must select angular, react and/or ember without duplicates');
