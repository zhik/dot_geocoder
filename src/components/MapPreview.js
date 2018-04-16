import React, { Component } from 'react';
import Navbar from './Navbar';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Message } from 'semantic-ui-react'

import L from 'leaflet';
import TableResult from './App/TableResult';
import ColumnsPicker from './App/ColumnsPicker';

import {loadFromLocalStorage} from '../helpers/localStorage';

import 'leaflet/dist/leaflet.css';
import '../css/Map.css';

//fix for markers not showing up
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class MapPreview extends Component {
    state = {
        lat: 40.730610,
        lng: -73.935242,
        zoom: 10,
        results: []
    }

    componentWillMount(){
        //load up backup data
        const res = loadFromLocalStorage('res');
        if(res){
            const {header, body, results, exportColumns} = res;
            this.setState({
              header, body, results, exportColumns
            });
        }
    }

    _updateExportColumn = (column) => {
        const exportColumns = this.state.exportColumns;
        exportColumns[column] = !exportColumns[column];
        this.setState({exportColumns})
    }

    render(){
        const position = [this.state.lat, this.state.lng];
        const points = this.state.results.reduce((points,res)=>{
            if(res.Latitude && res.Longitude){
                points.push({
                    position: [parseFloat(res.Latitude), parseFloat(res.Longitude)],
                    rowIndex: res.rowIndex
                })
            }   
            return points;
        },[])
        return(
            <div>
                <Navbar 
                    location={this.props.location.pathname}
                />

                <Map center={position} zoom={this.state.zoom} className="map">
                    <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {points.map((point,i) => 
                        <Marker key={`marker-${i}`} position={point.position}>
                        <Popup>
                            <span>
                            {point.rowIndex + 1}
                            </span>
                        </Popup>
                        </Marker>
                    )}
                </Map>

            <div className='message'>
                {points.length ? null : <Message negative><Message.Header>No points</Message.Header><p>Please go back to home and geocode something</p></Message>}
            </div>

            <ColumnsPicker 
                header={this.state.header}
                results={this.state.results}
                exportColumns={this.state.exportColumns}
                _updateExportColumn={this._updateExportColumn}
            />

            <TableResult 
            header={this.state.header} 
            body={this.state.body}
            results={this.state.results}
            exportColumns={this.state.exportColumns}
            />

            </div>
        )
    }
}

export default MapPreview;