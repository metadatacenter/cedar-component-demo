import { render } from '@testing-library/react';
import App from './App';

// CEE's own rendering is CEE's to test. What this demo is responsible for is placing
// the element and handing it the template and configuration as properties: React
// renders an object written as a JSX attribute into a string, which the component
// rejects, so an attribute of either name appearing here is the bug to catch.
test('places the editor and passes nothing to it as an attribute', () => {
  const { container } = render(<App />);
  const editor = container.querySelector('cedar-embeddable-editor');

  expect(editor).not.toBeNull();
  expect(customElements.get('cedar-embeddable-editor')).toBeDefined();
  expect(editor.getAttribute('config')).toBeNull();
  expect(editor.getAttribute('templateObject')).toBeNull();
});
