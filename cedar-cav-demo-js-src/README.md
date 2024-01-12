# CEDAR Artifact Viewer (CAV) plain HTML + JS Demo

This demo provides a sample integration of CAV into a simple static web application.

The application has the structure of an Angular application only for being able to serve it without a real webserver.
If you have a running webserver, you can just drop the following files under it, and you are ready to go:
* `index.html`
* `app-subfolder-1`
* `assets`
* `node_modules/cedar-artifact-viewer`

You will need to execute an `npm install` to retrieve the cedar-artifact-viewer.

If you do not have a running webserver, please follow the installation below:

# Installation

## Clone the repository

Clone this repository onto a local directory of your choice:

```shell
git clone https://github.com/metadatacenter/cedar-cee-demo.git
```

## Install the dependencies

```shell
cd cedar-cee-demo/cedar-cav-demo-js-src
npm install
```

## Start the dev webserver

```shell
ng serve
```

## Access the app

Open http://localhost:4290/
