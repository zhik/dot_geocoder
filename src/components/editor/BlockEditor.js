import React, { Component } from 'react';
import BlockDefaultFix from './BlockDefaultFix.js';
import { Modal,Icon } from 'semantic-ui-react';
import L from 'leaflet';

import '../../css/Editor.css';

//fix for markers not showing up
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const fixes = {
    "STREET COMBINATION NOT UNIQUE": (query,type,rowIndex,_editRow) => {
        return (<p>ignore this error, it is normal</p>)
    }
}


class BlockEditor extends Component {
    
    render(){
        if(! Object.keys(this.props.currentEdit).length ) return null;
        const { query, type, error, rowIndex } = this.props.currentEdit;

        //find error with corresponding fix
        const fix = Object.keys(fixes).find(fix => error.indexOf(fix) > -1) || null;

        //temp hold for this fix
        //const fix = null;

        return(
            <Modal 
                className="modal" 
                open={this.props.open} 
                closeOnDimmerClick={false} 
                onClose={this.props._handleEditorClose}
                closeOnDocumentClick={false}
            >
                <Icon onClick={this.props._handleEditorClose} name="window close" size="massive" color="red"/>
                <Modal.Header>{error}</Modal.Header>
                <Modal.Content>
                    {fix ? fixes[fix](query,type,rowIndex,this.props._editRow) 
                    : <BlockDefaultFix 
                        currentEdit={this.props.currentEdit}
                        header={this.props.header}
                        body={this.props.body}
                        query={query}
                        type={type}
                        rowIndex={rowIndex}
                        _editRow = {this.props._editRow} /> 
                    }
                </Modal.Content>
            </Modal>
        )
    }


}

export default BlockEditor;