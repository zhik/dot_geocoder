import React, { Component } from 'react';
import Navbar from './Navbar';
import ChangeLog from './About/ChangeLog';
import { Icon, Message } from 'semantic-ui-react';

class About extends Component {
    render(){
        return(
            <div>
                <Navbar 
                    location={this.props.location.pathname}
                />

                <div className="section"> 
                    <h1>Web Batch Geocoder using Location Service Rest API</h1>
                    <p>A web interface for the Location Service Rest API, that allows for easy uploading, viewing and downloading of location data</p>
                    <p>This project was bootstrapped with <a href="https://github.com/facebookincubator/create-react-app">Create React App</a></p>
                    
                    <h2>Features</h2>

                    <ol>
                        <li>Upload a spreadsheet (csv, excel)<Icon color='green' name='checkmark'/></li>
                        <li>Geocode Using different functions (Address, Intersection, Block)</li>
                        <li>Select the columns, I want to use for the query.<Icon color='green' name='checkmark'/></li>
                        <li>Preview the spreadsheet<Icon color='green' name='checkmark'/></li>
                        <li>Preview errors and correct for field or location errors</li>
                        <li>Download data in excel, geojson or shapefile<Icon color='green' name='checkmark'/></li>
                    </ol>

                    <Message info>
                    Contact <a href="mailto:zhe@dot.nyc.gov?subject=Web Batch Geocoder">zhe@dot.nyc.gov</a> , if there are any issues, questions or suggestions. 
                    </Message>

                    <h3>test files (ignore)</h3>

                    <ul>
                        {['geocode_test.csv','geocode_test2.csv','LPI.xlsx'].map((file,i) => <li key={`filelink-${i}`}><a target='_blank' href={`${window.location.pathname}${file}`}>{file}</a></li>)}
                    </ul>

                </div>

                <ChangeLog />


            </div>
        )
    }
}

export default About;