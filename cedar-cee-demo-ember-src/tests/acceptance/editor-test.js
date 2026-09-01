import { module, test } from 'qunit';
import { visit, waitUntil } from '@ember/test-helpers';
import { setupApplicationTest } from 'cedar-cee-demo-ember-src/tests/helpers';

// CEE renders into an open shadow root, after its own startup, which Ember's settled
// state knows nothing about. Wait for the content rather than assuming it is there.
async function editorShadowText() {
  const editor = document.querySelector('cedar-embeddable-editor');
  await waitUntil(() => editor.shadowRoot?.textContent?.includes('eDNA'), {
    timeout: 30000,
  });
  return editor.shadowRoot.textContent;
}

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

  test('the editor renders the template it was given', async function (assert) {
    await visit('/');
    const text = await editorShadowText();

    assert.true(
      text.includes('eDNA ECT Demonstration'),
      'the template title is rendered',
    );
    assert.true(
      text.includes('SpatialCoverage'),
      'an element of the template is rendered',
    );
  });

  test('the editor acts on the configuration it was given', async function (assert) {
    await visit('/');
    await editorShadowText();

    const editor = document.querySelector('cedar-embeddable-editor');
    const icons = [...editor.shadowRoot.querySelectorAll('mat-icon')].map(
      (icon) => icon.textContent.trim(),
    );

    // showDownloadMenu is the one visible flag the demo sets; without it CEE draws no
    // download control, so the icon is the evidence the configuration arrived.
    assert.true(
      icons.includes('file_download'),
      'the download control the configuration asks for is drawn',
    );
  });
});
