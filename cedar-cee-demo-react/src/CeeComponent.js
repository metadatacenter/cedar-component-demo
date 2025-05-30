import React, { Component } from 'react';
import 'cedar-embeddable-editor';

let conf = require('./ceeConf.json');
let template = require('./template.json');
let instance = require('./instance.json');

class CeeComponent extends Component {

    componentDidMount() {
        let cee = document.querySelector('cedar-embeddable-editor');
        cee.config = conf;
        cee.templateObject = template;
        cee.instanceObject = instance;
    }

    render() {
        return <cedar-embeddable-editor/>
    }
}
export default CeeComponent;
