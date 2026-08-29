/*
 * Testing Library's queries stop at the shadow boundary, and a custom element exposes
 * no role to query by, so this file reaches for the element and its shadow root
 * directly. That is the only way to see what CEE rendered.
 */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
import { render } from '@testing-library/react';
import App from './App';

// CEE renders into an open shadow root, after its own startup, which React's render
// knows nothing about. Poll rather than guess.
async function editorShadowText(editor) {
  for (let attempt = 0; attempt < 300; attempt++) {
    const text = editor.shadowRoot?.textContent ?? '';
    if (text.includes('eDNA')) {
      return text;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return editor.shadowRoot?.textContent ?? '';
}

function mountEditor() {
  const { container } = render(<App />);
  return container.querySelector('cedar-embeddable-editor');
}

test('places the editor and passes nothing to it as an attribute', () => {
  const editor = mountEditor();

  expect(editor).not.toBeNull();
  expect(customElements.get('cedar-embeddable-editor')).toBeDefined();
  // React renders an object written as a JSX attribute into a string, which the
  // component rejects, so an attribute of either name here is the bug to catch.
  expect(editor.getAttribute('config')).toBeNull();
  expect(editor.getAttribute('templateObject')).toBeNull();
});

test('the editor renders the template it was given', async () => {
  const text = await editorShadowText(mountEditor());

  expect(text).toContain('eDNA ECT Demonstration');
  expect(text).toContain('SpatialCoverage');
});

test('the editor acts on the configuration it was given', async () => {
  const editor = mountEditor();
  await editorShadowText(editor);
  const icons = [...editor.shadowRoot.querySelectorAll('mat-icon')].map((icon) =>
    icon.textContent.trim()
  );

  // showDownloadMenu is the one visible flag the demo sets; without it CEE draws no
  // download control, so the icon is the evidence the configuration arrived.
  expect(icons).toContain('file_download');
});
