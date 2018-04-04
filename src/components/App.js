import React, { Component } from 'react';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';
import logo from '../css/dot_logo_web.png';
import { Header, Label, Popup, Icon } from 'semantic-ui-react'

import readFile from '../helpers/readFile';
import queryGeocoder from '../helpers/queryGeocoder';

import Form from './form/Form';
import FileUpload from './FileUpload';
import TablePreview from './TablePreview';
import TableResult from './TableResult';
import ColumnsPicker from './ColumnsPicker';

import Editor from './editor/Editor';

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
        fileError: false,
        exportColumns: {},
        isEditorOpen: false,
        editRow: []
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

            return {...data, error: false, rowIndex: i}
          })
          .catch(error => {
            const status = this.state.status;
            status.resultsCount++
            status.errorsCount++
            this.setState({ status })

            return {error , rowIndex: i}
          })
      }))
        .then(results => {
          const status = this.state.status;
          status.start = false;
          status.finshed = true;

        //default enable header columns and error
        const exportColumns = {};
        this.state.header.map(i => exportColumns[i] = true);
        exportColumns.error = true;
        exportColumns.XCoordinate = true;
        exportColumns.YCoordinate = true;
        
        this.setState({
          status,
          results,
          exportColumns
        });

        })

    }

    _updateExportColumn = (column) => {
      const exportColumns = this.state.exportColumns;
      exportColumns[column] = !exportColumns[column];
      this.setState({exportColumns})
    }

    _handleEditorClose = () => {
      this.setState({isEditorOpen: false});
    }

    _handleEditorOpen = row => {
      this.setState({
        isEditorOpen: true,
        editRow: row
      })
    }

  render() {
    return (
      <div>
        <Header as='h2' attached='top'>
            <img className='logo' src={logo} alt='dot-logo'/> 
            web batch geocoder 
            <Label color='yellow'>
              alpha v0.1
              <Label.Detail>very buggy</Label.Detail>
            </Label>
        </Header>

        <div className="help">
          <FileUpload 
            _onFileChange={this._onFileChange} 
            fileError={this.state.fileError}
          />
          <Popup 
            trigger={<Icon name='question circle outline' />}
            content='choose a file, then select a function'
          />
        </div>
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
          _handleEditorOpen={this._handleEditorOpen}
        />

        <Editor 
          open={this.state.isEditorOpen} 
          _handleEditorClose={this._handleEditorClose} 
          row={this.state.editRow} 
          header={this.state.header}
        />
        
      </div>
    );
  }
}

export default App;
