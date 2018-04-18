import React, { Component } from 'react';
import Navbar from './Navbar';
import ChangeLog from './About/ChangeLog';
import { Icon, Message } from 'semantic-ui-react';

import '../css/About.css';

class About extends Component {
    render(){
        return(
            <div>
                <Navbar 
                    location={this.props.location.pathname}
                />

                <div className="about"> 
                    <h1>Web Batch Geocoder using Location Service Rest API</h1>
                    <p>A web interface for the Location Service Rest API, that allows for easy uploading, viewing and downloading of location data</p>
                    <p>This project was bootstrapped with <a href="https://github.com/facebookincubator/create-react-app">Create React App</a></p>
                    
                    <h2>Requirements</h2>

                    <ol>
                        <li>Upload a spreadsheet (csv, excel)<Icon color='green' name='checkmark'/></li>
                        <li>Geocode Using different functions (Address, Intersection, Block)</li>
                        <li>Select the columns, I want to use for the query.<Icon color='green' name='checkmark'/></li>
                        <li>Preview the spreadsheet<Icon color='green' name='checkmark'/></li>
                        <li>Preview errors and correct for field or location errors</li>
                        <li>Download data in excel, geojson or shapefile<Icon color='green' name='checkmark'/></li>
                    </ol>

                    <Message positive>
                    Contact zhe@dot.nyc.gov , if there are any issues, questions or suggestions. 
                    </Message>

                </div>

                <ChangeLog />

            </div>
        )
    }
}

export default About;