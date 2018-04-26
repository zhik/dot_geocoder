import React, { Component } from 'react';
import Async from 'react-promise'
import DefaultFix from './DefaultFix.js';
import { Modal, Button, Message } from 'semantic-ui-react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import '../../css/Editor.css';

import queryGeocoder from '../../helpers/queryGeocoder';

//fix for markers not showing up
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const fixes = {
    "COMPASS DIRECTION REQ'D": (query,type,rowIndex,_editRow) => {
        //run query on all directions
        const allDirectionsPromise = Promise.all(['N','W','S','E'].map(direction => {
            const modQuery = {...query, 'CompassDirection': direction};
            return queryGeocoder(type, modQuery)
                .then(data=> {
                    return {...data, error: false, rowIndex, debug: {query: modQuery, type}};
                })
                .catch(error => {
                    return {error , rowIndex, debug: {query: modQuery, type}};
                })
        }))

        return (
            <Async
                promise={allDirectionsPromise}
                then={allDirectionsData => {
                    const directionsData = allDirectionsData.filter(data => !data.error);

                    const points = directionsData.map(data => ({
                        data,
                        direction: data.debug.query.CompassDirection, 
                        position: [parseFloat(data.Latitude), parseFloat(data.Longitude)]
                    }));

                    return (
                        <div>
                            <Message info>
                                <Message.Header>Instructions for Directions Error</Message.Header>
                                <ol>
                                    <li>Look on the map and click on the markers to see the different directions (sometimes directions will overlap)</li>
                                    <li>To select the best or desired option, click the buttons above the map</li>
                                </ol>
                                (esc to exit)
                            </Message>
                            <Button.Group className="direction-buttons">
                                {points.map((point,i) => (
                                    <Button key={`editor-button-${i}`} onClick={()=> _editRow(rowIndex,point.data)} >{point.direction}</Button>       
                                ))}
                            </Button.Group>
                            <Map center={points[0].position} zoom={18} className="map leaflet-small-container">
                                <TileLayer 
                                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {points.map((point,i) => (
                                    <Marker key={`editor-marker-${i}`} position={point.position}>
                                        <Popup>
                                            <span>{point.direction}</span>
                                        </Popup>
                                    </Marker>
                                ))}
                            </Map>
                        </div>
                    )
                }}
            />
        )     
    }
}


class Editor extends Component {
    
    render(){
        if(! Object.keys(this.props.currentEdit).length ) return null;
        const { query, type, error, rowIndex } = this.props.currentEdit;

        //find error with corresponding fix
        const fix = Object.keys(fixes).find(fix => error.indexOf(fix) > -1) || null;

        return(
            <Modal 
                className="modal" 
                open={this.props.open} 
                closeOnDimmerClick={false} 
                onClose={this.props._handleEditorClose}
                closeOnDocumentClick={false}
            >
                <Modal.Header>{error}</Modal.Header>
                <Modal.Content>
                    {fix ? fixes[fix](query,type,rowIndex,this.props._editRow) 
                    : <DefaultFix 
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

export default Editor;