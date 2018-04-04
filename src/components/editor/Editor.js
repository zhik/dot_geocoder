import React, { Component } from 'react';
import { Modal, Table } from 'semantic-ui-react'
import '../../css/Editor.css';

class Editor extends Component {


    render(){
        const error = this.props.row[this.props.row.length - 1];
        const row = this.props.row.slice(0,this.props.row.length - 1);

        return(
            <Modal className="modal" open={this.props.open} closeOnDimmerClick={true} onClose={this.props._handleEditorClose}>
                <Modal.Header>Editor</Modal.Header>
                <Modal.Content>
                    <p>{error}</p>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                {this.props.header.map((cell,i2) => <Table.HeaderCell key={`editorh-${i2}`}>{cell}</Table.HeaderCell>)}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                {row.map((cell,i2) => <Table.Cell key={`editor-${i2}`}>{cell}</Table.Cell>)}
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal>
        )
    }


}

export default Editor;