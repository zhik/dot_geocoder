import React, { Component } from 'react';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';
import { Popup, Icon } from 'semantic-ui-react'

import readFile from '../helpers/readFile';
import queryGeocoder from '../helpers/queryGeocoder';
import {saveToLocalStorage, loadFromLocalStorage} from '../helpers/localStorage';

import Navbar from './Navbar';
import Form from './form/Form';
import FileUpload from './App/FileUpload';
import TablePreview from './App/TablePreview';
import TableResult from './App/TableResult';
import ColumnsPicker from './App/ColumnsPicker';

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
        exportColumns.Longitude = true;
        exportColumns.Latitude = true;
        
        this.setState({
          status,
          results,
          exportColumns
        });

        //backup results
        const {header, body} = this.state;
        saveToLocalStorage('res', {
          header, body, results, exportColumns
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
        <Navbar 
          location={this.props.location.pathname}
        />

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
