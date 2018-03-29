import React, { Component } from 'react';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';
import logo from '../css/dot_logo_web.png';
import { Header } from 'semantic-ui-react'

import readFile from '../helpers/readFile';
import queryGeocoder from '../helpers/queryGeocoder';

import Form from './form/Form';
import FileUpload from './FileUpload';
import TablePreview from './TablePreview';
import TableResult from './TableResult'

class App extends Component {
    state = {
        header: [],
        body: [],
        results: [],
        status: {
          start: false,
          count: 0,
          resultsCount: 0,
          errorsCount: 0,
          finshed: false,
        },
        fileError: false
    }

  

    _onFileChange = e => {
        const file = e.target.files[0];
        readFile(file)
        .then(sheet => {
          const header = sheet[0];
          const body = sheet.slice(1);
          const status = this.state.status;
          status.count = body.length;

          this.setState({ 
            fileError: false,
            body,
            header,
            results: [],
            errors: [],
            status 
          });

        })
        .catch(err => {
          console.error(err);
          this.setState({ 
            fileError: true,
            body: [],
            header: [] 
          });
        })
    }

    queryApi = (fields,type) => {
      //reset status and start
      const status = this.state.status;
      status.start = true;
      status.finshed = false;
      status.resultsCount = 0;
      status.errorsCount = 0;
      this.setState({ status });

      //get the index for each field, if it isn't null
      const fieldIndexes = Object.keys(fields).reduce((fieldIndexes, field) => {
        if(fields[field]){
          fieldIndexes[field] = this.state.header.indexOf(fields[field]);
        }
        return fieldIndexes;
      },{})

      //setup query all rows in body, using the index
      const queries = this.state.body.map(row => {
        return Object.keys(fieldIndexes).reduce((query, field) => {
          const index = fieldIndexes[field];
          query[field] = row[index];
          return query;
        },{});
      })


      //start query
      Promise.all(queries.map( (query,i) => {
        return queryGeocoder(type, query)
          .then(data=> {
            const status = this.state.status;
            status.resultsCount++
            this.setState({ status })

            return {...data, err: false, index: i}
          })
          .catch(err => {
            const status = this.state.status;
            status.resultsCount++
            status.errorsCount++
            this.setState({ status })

            return {err, index: i}
          })
      }))
        .then(results => {
          const status = this.state.status;
          status.start = false;
          status.finshed = true;
          this.setState({
            status,
            results
          });
        })

    }


  render() {
    return (
      <div>
        <Header as='h2' attached='top'>
            <img className='logo'src={logo}/> 
            web batch geocoder
        </Header>
        <FileUpload 
          _onFileChange={this._onFileChange} 
          fileError={this.state.fileError}
        />
        <Form 
          header={this.state.header} 
          fields={this.state.fields}
          status={this.state.status}
          queryApi={this.queryApi}
          fileError={this.fileError}
        />
        <TablePreview 
          header={this.state.header} 
          body={this.state.body}
        />
        <TableResult 
          header={this.state.header} 
          body={this.state.body}
          results={this.state.results}
        />
        {/* <TableError />
        <Export /> */}
      </div>
    );
  }
}

export default App;
