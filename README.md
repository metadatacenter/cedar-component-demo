# cedar-cee-demo

Three small applications that embed the CEDAR Embeddable Editor, one per framework:

| Folder | Framework |
|---|---|
| `cedar-cee-demo-angular-src` | Angular |
| `cedar-cee-demo-react` | React |
| `cedar-cee-demo-ember-src` | Ember |

All three edit the same template, `eDNA ECT Demonstration`, which each one keeps as a
file of its own. No demo reaches out to a template server.

`cedar-cee-demo-angular-dist` is the built Angular demo, published as an npm package.
The release fills it from `cedar-cee-demo-angular-src`, so edit the source and rebuild
rather than editing the built files.

Please check out the individual README files in the top level folders!
