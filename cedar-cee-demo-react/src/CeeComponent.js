import React, { Component } from 'react';
import 'cedar-embeddable-editor';

let template = require('./template.json');

class CeeComponent extends Component {

    conf = {"showDownloadMenu": true};

    componentDidMount() {
        // Both have to be set as properties: React would render an object attribute as a string.
        let cee = document.querySelector('cedar-embeddable-editor');
        cee.config = this.conf;
        cee.templateObject = template;
    }

    render() {
        return <cedar-embeddable-editor />
    }
}
export default CeeComponent;
