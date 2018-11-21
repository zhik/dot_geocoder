import React, { Component } from 'react';
import Navbar from './Navbar';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { Message } from 'semantic-ui-react'

import envelope from '@turf/envelope';
import checkCoordinatesError from '../helpers/checkCoordinatesError';

import L from 'leaflet';
import BlockTableResult from './App/BlockTableResult';
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

const DEFAULT_VIEWPORT = {
    center: [40.730610, -73.935242],
    zoom: 10,
}

class MapPreview extends Component {

    state = {
        viewport: DEFAULT_VIEWPORT,
        results: []
    }

    componentWillMount(){
      //load up backup data, only if it is the same version
      if(localStorage.getItem("version") === 'v1.1'){
        const res = loadFromLocalStorage('block-app');
        if(res){
          const {header, body, results, exportColumns, fileName} = res;
          this.setState({
            header, body, results, exportColumns, fileName
          });
        }
      }else{
        localStorage.setItem('version','v1.1');
      }
    }

    _updateExportColumn = (column) => {
        const exportColumns = this.state.exportColumns;
        exportColumns[column] = !exportColumns[column];
        this.setState({exportColumns});
    }

    zoomToLocation = (location) => {
        //close popup
        const popup = document.querySelector(".leaflet-popup-close-button");
        if(popup) popup.click();

        if(!location){ 
            this.setState({viewport: DEFAULT_VIEWPORT});
        }else{
            const viewport = {
                center: location,
                zoom: 17
            };
            this.setState({viewport});
        }
    }

    render() {
            //pull out geojson using general function and exclude dummy 
            const geojson = this.state.results.reduce((items, item) => {
                if (item.geojson && item.geojson[4326] && !item.geojson[4326].properties.dummy && !checkCoordinatesError(item.geojson[4326].geometry.coordinates)) {
                    items.features.push(item.geojson[4326]);
                }
                return items;
            }, {
                "type": "FeatureCollection",
                "features": []
            })

            const bounds = envelope(geojson).geometry.coordinates[0].slice(0, 4).map(coor => coor.reverse());

            const onEachFeature = (feature, layer) => {
                if (feature.properties && feature.properties.segmentID) {
                    layer.bindPopup(`<p>${feature.properties.oft}</p><p>${feature.properties.segmentID.join(', ')}</p>`);
                }else if(feature.properties && feature.properties.LionNodeNumber){
                    layer.bindPopup(`<p>${feature.properties.LionNodeNumber}</p>`)
                }
            }

            const getStyle = () => {
                // const r = 255;
                // const g = Math.floor(Math.random() * 255);
                // const b = 255;
                // const color= `rgb(${r},${g},${b})`; 
                return {
                    color: 'red',
                    weight: 10,
                    opacity: .9

                }
            }

        const GeoJSONLayer = () => (
            <GeoJSON
            data={geojson}
            style={getStyle}
            onEachFeature={onEachFeature}
            />
        )

        return(
            <React.Fragment>
                <Navbar 
                    location={this.props.location.pathname}
                />
            
                <div className="panel">
                    <div className="left-panel">
                    <Map 
                        bounds={bounds}
                        className="map leaflet-full-container"
                        viewport={this.state.viewport}>
                    >
                        <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSONLayer/>
                    </Map>
                
                </div>

                <div className="right-panel">
                    <div className='message'>
                        {geojson.features.length ? null : <Message negative><Message.Header>No features</Message.Header><p>Please go back to "Block" and geocode something</p></Message>}
                    </div>

                            
                    <ColumnsPicker 
                        header={this.state.header}
                        results={this.state.results}
                        exportColumns={this.state.exportColumns}
                        _updateExportColumn={this._updateExportColumn}
                    />

                    <BlockTableResult 
                        header={this.state.header} 
                        body={this.state.body}
                        results={this.state.results}
                        exportColumns={this.state.exportColumns}
                        zoomToLocation={this.zoomToLocation}
                        history={this.props.history}
                        type={'blockmap'}
                    />
                </div>

            </div>
        </React.Fragment>
        )
    }
}

export default MapPreview;