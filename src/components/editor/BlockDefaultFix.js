import React, {Component} from 'react';
import { Form, Divider, Button, Message, Table, Header } from 'semantic-ui-react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet';

import checkCoordinatesError from '../../helpers/checkCoordinatesError';

import queryGeocoder from '../../helpers/queryGeocoder';
import fieldHelper from '../../helpers/fieldHelper';

import {blockReduce} from '../../helpers/blockReduce';

import envelope from '@turf/envelope';

class BlockDefaultFix extends Component {
    
    state = {
        query: null,
        tempEdit: null,
        loading: false,
    }

    componentWillMount(){
        const query = this.props.query;
        //add extra fields if certain type
        switch(this.props.type){
            case 'extendedStretch_blockface':
            case 'extendedStretch_intersection':
                query.CompassDirectionOne = '';
                query.CompassDirectionTwo = '';
                break;
            default:

        }
        this.setState({query: this.props.query});
    }

    _updateField = (e,field) => {
        const query = this.state.query;
        query[field] = e.target.value;
        this.setState({query});
    }

    _geocode = () => {
        if (!this.state.loading) {
            this.setState({
                loading: true
            });
            const query = this.state.query;
            //run fieldHelper on query
            const modQuery = Object.keys(query).reduce((modQuery, field) => {
                const value = query[field];
                modQuery[field] = fieldHelper(value, field);
                return modQuery;
            }, {})
            const {
                type,
                rowIndex
            } = this.props;

            let mod_type = this.props.type;
            //fix the type so the url works for Block functions
            switch (type) {
                case ('extendedStretch_blockface'):
                case ('extendedStretch_intersection'):
                    mod_type = 'Block';
                    break;
                default:
            }
            return queryGeocoder(mod_type, modQuery)
                .then(results => {

                    results.rowIndex = rowIndex;
                    blockReduce([results], type).then(res => {

                        const data = res.sort((a, b) => {
                            if (a.rowIndex > b.rowIndex) {
                                return 1;
                            } else if (a.rowIndex < b.rowIndex) {
                                return -1;
                            } else {
                                if (a.hasOwnProperty('listIndex') && b.hasOwnProperty('listIndex')) {
                                    return a.listIndex - b.listIndex;
                                } else {
                                    return 0;
                                }
                            }
                        })


                        const tempEdit = {
                            data,
                            error: false,
                            rowIndex,
                            debug: {
                                query: modQuery,
                                type,
                                string: JSON.stringify(modQuery)
                            }
                        };
                        this.setState({
                            tempEdit,
                            loading: false
                        });
                    })
                })
                .catch(error => {
                    const tempEdit = {
                        error,
                        rowIndex,
                        debug: {
                            query: modQuery,
                            type,
                            string: JSON.stringify(modQuery)
                        }
                    };
                    this.setState({
                        tempEdit,
                        loading: false
                    });
                })

        }

    }

    render(){
        if(!this.state.query) return null;

        const results = () => {
            if(this.state.tempEdit){
                if(!this.state.tempEdit.error){
                    //pull out geojson using general function and exclude dummy 
                    const geojson = this.state.tempEdit.data.reduce((items, item) => {
                        if(item.geojson[4326] && !item.geojson[4326].properties.dummy && !checkCoordinatesError(item.geojson[4326].geometry.coordinates)){
                            items.features.push(item.geojson[4326]);
                        }
                        return items;
                    },{
                        "type": "FeatureCollection",
                        "features": []
                      })

                    if(!geojson.features.length){
                        return (
                            <React.Fragment>
                                <span>ERROR: No Features Found</span>
                                <Button.Group className="direction-buttons">
                                    <Button positive onClick={() => this.props._editRow(this.props.rowIndex, this.state.tempEdit)}>Confirm</Button>
                                </Button.Group>
                            </React.Fragment>
                        )
                    }
                    const bounds = envelope(geojson).geometry.coordinates[0].slice(0,4).map(coor => coor.reverse());


                    const onEachFeature = (feature, layer)=> {
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

                    return (
                        <React.Fragment>
                                <Map bounds={bounds} className="map leaflet-small-container">
                                    <TileLayer 
                                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                            <GeoJSONLayer/>
                            </Map>
                            <Button.Group className="direction-buttons">
                                <Button positive onClick={() => this.props._editRow(this.props.rowIndex, this.state.tempEdit)}>Confirm</Button>
                            </Button.Group>
                        </React.Fragment>
                    )
                }else{
                    return <span>ERROR: {this.state.tempEdit.error}</span>
                }
            }else{
                return null
            }
        }

        return(
            <div>
                <Message info>
                    <Message.Header>Instructions for Field Error</Message.Header>
                        <ol>
                            <li>Edit field highlighted in Red</li>
                            <li>Click on "Geocode"</li>
                            <li>Check results, if there are errors, try again</li>
                            <li>Click on "Confirm" to confirm changes</li>
                            (esc to exit)
                        </ol>
                </Message>
                <Header as='h4'>Preview Table</Header>
                <div className="editor-table">
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                {this.props.header.map((head,i) => (
                                    <Table.HeaderCell key={`editor-table-head-${i}`}>{head}</Table.HeaderCell>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                {this.props.body[this.props.rowIndex].map((body,i)=> (
                                    <Table.Cell key={`editor-table-body-${i}`}>{body}</Table.Cell>
                                ))}
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                <Divider />
                <Header as='h4'>Editor</Header>
                <Form>
                    {Object.keys(this.props.query).map((field,i) => (
                        <Form.Input 
                            key={`editorh-${i}`} 
                            label={field} 
                            value={this.state.query[field]}
                            onChange={(e)=> this._updateField(e,field)}
                            />
                    ))}     
                    <Button.Group className="direction-buttons">
                        <Button loading={this.state.loading} onClick={this._geocode}>Geocode</Button>
                    </Button.Group>
                    <Divider section />

                    {results(this.state.tempEdit)}
                    
                </Form>
            </div>
    
        )
    }
}


export default BlockDefaultFix;