# CEDAR Embeddable Editor (CEE) Angular 2 Demo

This demo provides a sample integration of CEE into an Angular 2 application.

# Installation

All of the required dependencies, such as javascript libraries, images, and the latest version of the CEE Webcomponent are already packaged with this demo. You can use this demo as a shell for your own Angular application or as a reference on how to embed and configure the CEE Webcomponent in your own Angular environment.

## Clone the repository

Clone this repository onto a local directory of your choice:

```shell
git clone https://github.com/metadatacenter/cedar-cee-demo-angular.git
```

## Configure the project

Open the file `cedar-cee-demo-angular/assets/data/appConfig.json` in your favorite text editor or IDE and edit configuration parameters based on the instructions below.

## Configure endpoints (optional)

### Metadata save endpoint

CEE offers the functionality to save user metadata using a custom remote endpoint. If you plan to enable this feature, you will need to change the following configuration parameters in your `cee-config.json`:

```json
"showDataSaver": true,
"dataSaverEndpointUrl": "http://localhost:8000/datasave.php",
```
Replace `dataSaverEndpointUrl` with a URL pointing to the endpoint that will handle metadata submissions.

### Template upload endpoint

CEDAR Embeddable Editor includes an optional feature that allows uploading a template source file and creating metadata for that template.

If you plan to enable that functionality, you will need to confgigure two endpoints in your `cee-config.json`:

```json
"showTemplateUpload": true,
"templateUploadBaseUrl": "http://localhost:8000",
"templateUploadEndpoint": "/upload.php",
"templateDownloadEndpoint": "/download.php",
```
Replace `templateUploadBaseUrl` with a URL pointing to the root of the server on which the endpoints reside. Configure `templateUploadEndpoint` and `templateDownloadEndpoint` to their respective paths from the `templateUploadBaseUrl`.

For a more complete description of these endpoints as well as other optional configuration parameters, please refer to the [**Configuration**](https://github.com/metadatacenter/cedar-embeddable-editor#configuration) section of CEE documentation:

https://github.com/metadatacenter/cedar-embeddable-editor#configuration

# Start server and navigate to the demo app in browser

Start the Angular server by running this following command:

```shell
cedar-cee-demo-angular$ ng serve
```

Navigate to `http://localhost:4200/index.html`.

If the installation completed successfully, the CEDAR Embeddable error should load without errors.

# Further reading

For more information on the CEE configuration and available features, please refer to the CEE documentation:

https://github.com/metadatacenter/cedar-embeddable-editor/blob/master/README.md
