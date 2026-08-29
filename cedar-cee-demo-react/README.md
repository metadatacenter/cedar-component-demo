# CEDAR Embeddable Editor (CEE) React Demo

This demo provides a sample integration of CEE into a React application.

# Installation

All the required dependencies, such as javascript libraries, images, and the latest version of the CEE Webcomponent are already packaged with this demo. You can use this demo as a shell for your own React application or as a reference on how to embed and configure the CEE Webcomponent in your own React environment.

## Clone the repository

Clone this repository onto a local directory of your choice:

```shell
git clone https://github.com/metadatacenter/cedar-component-demo.git
```

## The Template Being Edited

The demo edits one template, `src/template.json`, bundled with the application and handed to the component as its `templateObject` property. Nothing is fetched from a template server. To edit a different template, replace that file with another CEDAR template.

Both `config` and `templateObject` are assigned as properties in `CeeComponent`, not written as JSX attributes: React renders an attribute value as a string, and the component rejects a configuration that arrives as one.

# Start server and navigate to the demo app in browser

Start the React server by running this following command:

```shell
cedar-cee-demo-react$ npm start
```

Navigate to `http://localhost:3000`.

If the installation completed successfully, the CEDAR Embeddable Editor should load without errors.

# Further reading

For more information on the CEE configuration and available features, please refer to the CEE documentation:

https://github.com/metadatacenter/cedar-embeddable-editor/blob/master/README.md
