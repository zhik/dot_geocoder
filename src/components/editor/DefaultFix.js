import React, {Component} from 'react';
import { Form, Divider, Button, Message, Table, Header } from 'semantic-ui-react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import GoogleMapsLink from './GoogleMapsLink';

import queryGeocoder from '../../helpers/queryGeocoder';
import fieldHelper from '../../helpers/fieldHelper';


class DefaultFix extends Component {
    
    state = {
        query: null,
        tempEdit: null
    }

    componentWillMount(){
        const query = this.props.query;
        if(this.props.type === 'intersection'){
            query.CompassDirection = '';
        }
        this.setState({query: this.props.query});
    }

    _updateField = (e,field) => {
        const query = this.state.query;
        query[field] = e.target.value;
        this.setState({query});
    }

    _geocode = () => {
        const query = this.state.query;
        //run fieldHelper on query
        const modQuery = Object.keys(query).reduce((modQuery,field)=> {
            const value = query[field];
            modQuery[field] = fieldHelper(value,field);
            return modQuery;
        }, {})
        const { type, rowIndex } = this.props;
        return queryGeocoder(this.props.type, modQuery)
            .then(data=> {
                const tempEdit = {...data, error: false, rowIndex, debug: {query: query, type}};
                this.setState({tempEdit});
            })
            .catch(error => {
                const tempEdit = {error , rowIndex, debug: {query: query, type}};
                this.setState({tempEdit});
            })
        }

    render(){
        if(! this.state.query) return null;

        const results = () => {
            if(this.state.tempEdit){
                if(!this.state.tempEdit.error){
                    const { Latitude,Longitude } = this.state.tempEdit;
                    const position = [parseFloat(Latitude), parseFloat(Longitude)];
                    return (
                        <React.Fragment>
                            <Map center={position} zoom={18} className="map leaflet-small-container">
                                    <TileLayer 
                                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            <span>
                                                <GoogleMapsLink position={position}/>
                                            </span>
                                        </Popup>
                                    </Marker>
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
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            {this.props.header.map(head => (
                                <Table.HeaderCell key={`editor-table-head-${head}`}>{head}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            {this.props.body[this.props.rowIndex].map(body=> (
                                <Table.Cell key={`editor-table-body-${body}`}>{body}</Table.Cell>
                            ))}
                        </Table.Row>
                    </Table.Body>
                </Table>
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
                        <Button onClick={this._geocode}>Geocode</Button>
                    </Button.Group>
                    <Divider section />

                    {results()}
                    
                </Form>
            </div>
    
        )
    }
}


export default DefaultFix;