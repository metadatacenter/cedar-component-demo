import React, { Component } from 'react';
import 'cedar-embeddable-editor';

let template = require('./template.json');
let instance = require('./instance.json')

class CeeComponent extends Component {

    conf = {"showInstanceDataCore": false, "showInstanceDataFull": false, "showTemplateSourceData": false};

    componentDidMount() {
        let cee = document.querySelector('cedar-embeddable-editor');
        cee.templateObject = template;
        cee.instanceObject = instance;
    }

    render() {
        return <cedar-embeddable-editor config={this.conf} />
    }
}
export default CeeComponent; 