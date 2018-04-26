import React, {Component} from 'react';
import { Form, Divider, Button, Message } from 'semantic-ui-react'

import queryGeocoder from '../../helpers/queryGeocoder';
import { Map, TileLayer, Marker } from 'react-leaflet';

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
        const { type, rowIndex } = this.props;
        return queryGeocoder(this.props.type, query)
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
                                    <Marker position={position}></Marker>
                            </Map>
                            <Button positive onClick={() => this.props._editRow(this.props.rowIndex, this.state.tempEdit)}>Confirm</Button>
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
                <Form>
                    {Object.keys(this.props.query).map((field,i) => (
                        <Form.Input 
                            key={`editorh-${i}`} 
                            label={field} 
                            value={this.state.query[field]}
                            onChange={(e)=> this._updateField(e,field)}
                            />
                    ))}     
                    <Button onClick={this._geocode}>Geocode</Button>
                    <Divider section />

                    {results()}
                    
                </Form>
            </div>
    
        )
    }
}


export default DefaultFix;