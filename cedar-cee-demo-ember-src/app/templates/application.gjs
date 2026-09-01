import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "CEDAR Embeddable Editor - Ember Demo"}}

  <cedar-embeddable-editor
    config={{@model.conf}}
    templateObject={{@model.template}}
  ></cedar-embeddable-editor>

  {{outlet}}
</template>
