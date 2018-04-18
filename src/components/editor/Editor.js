import React, { Component } from 'react';
import { Modal, Header, Form } from 'semantic-ui-react'
import '../../css/Editor.css';

class Editor extends Component {
    state = {
        row: {}
    }

    render(){
        //remove empty cells
        const values = this.props.row.filter(cell => cell.length) || [];

        const error = values.length ? values[values.length - 1] : null;
        const row = values.slice(0,values.length - 1);

        return(
            <Modal className="modal" open={this.props.open} closeOnDimmerClick={true} onClose={this.props._handleEditorClose}>
                <Modal.Header>Editor</Modal.Header>
                <Modal.Content>
                <Header as='h3'>{error}</Header>
                    <Form>
                        {this.props.header.map((cell,i2) => (
                            <Form.Input key={`editorh-${i2}`} label={cell} placeholder={row[i2]}/>
                        ))}     
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }


}

export default Editor;