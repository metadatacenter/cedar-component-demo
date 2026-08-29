# CEDAR Embeddable Editor (CEE) Angular 2 Demo

This demo provides a sample integration of CEE into an Angular 2 application.

# Installation

All the required dependencies, such as javascript libraries, images, and the latest version of the CEE Webcomponent are already packaged with this demo. You can use this demo as a shell for your own Angular application or as a reference on how to embed and configure the CEE Webcomponent in your own Angular environment.

## Clone the repository

Clone this repository onto a local directory of your choice:

```shell
git clone https://github.com/metadatacenter/cedar-component-demo.git
```

## Configure the project

Open the file `cedar-cee-demo-angular-src/src/assets/data/appConfig.json` in your favorite text editor or IDE. Its `ceeConfig` object is what the demo hands to the component as the `config` property; the keys outside that object are not read.

CEE reads a fixed set of configuration keys and answers an unrecognized one with a
console error naming it. This demo sets three:

```json
"ceeConfig": {
  "terminologyBaseUrl": "https://terminology.metadatacenter.org/",
  "bridgeBaseUrl": "https://bridge.metadatacenter.org/",
  "defaultLanguage": "en"
}
```

`terminologyBaseUrl` and `bridgeBaseUrl` name the CEDAR services CEE calls. Neither
has a default, so an editor configured without them offers no terminology lookup.

For the remaining keys, refer to the CEE documentation:

https://github.com/metadatacenter/cedar-embeddable-editor

## The Template Being Edited

The demo edits one template, `src/assets/data/template.json`, which the app serves as an asset and hands to the component as its `templateObject` property. Nothing is fetched from a template server. To edit a different template, replace that file with another CEDAR template.

# Start server and navigate to the demo app in browser

Start the Angular server by running this following command:

```shell
cedar-cee-demo-angular-src$ ng serve
```

Navigate to `http://localhost:4260/index.html`.

If the installation completed successfully, the CEDAR Embeddable Editor should load without errors.

# Further reading

For more information on the CEE configuration and available features, please refer to the CEE documentation:

https://github.com/metadatacenter/cedar-embeddable-editor/blob/master/README.md
