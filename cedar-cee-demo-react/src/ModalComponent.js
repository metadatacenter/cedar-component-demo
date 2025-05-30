import React from "react";
import "./ModalComponent.css";
import CeeComponent from "./CeeComponent";

export default class ModalComponent extends React.Component {

  onClose = e => {
    this.props.onClose();
  }  

  render() {
    if(!this.props.show){
        return null;
    }
    return (
        <div class="modal" id="modal">
            <h2 style={{'background-color':'black', 'color': 'white'}}>Visualize Metadata</h2>
            <CeeComponent/>
            <div class="actions">
                <div>
                    <button class="toggle-button" onClick={e => {this.onClose(e);}}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
  }
}