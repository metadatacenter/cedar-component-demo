import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'cedar-cee-demo-ember-src/tests/helpers';

// CEE's own rendering is CEE's to test. What this demo is responsible for is
// placing the element and giving the application route a template to hand it.
module('Acceptance | editor', function (hooks) {
  setupApplicationTest(hooks);

  test('places the editor and loads the template it edits', async function (assert) {
    await visit('/');

    assert
      .dom('cedar-embeddable-editor')
      .exists('the editor element is placed');

    const model = this.owner
      .lookup('route:application')
      .modelFor('application');
    assert.strictEqual(
      model.template['schema:name'],
      'eDNA ECT Demonstration',
      'the route loaded the bundled template',
    );
    assert.deepEqual(
      model.conf,
      { showDownloadMenu: true },
      'the route supplies the configuration as an object',
    );
  });
});
