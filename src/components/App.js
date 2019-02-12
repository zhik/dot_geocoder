import React, { Component } from 'react';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';

import readFile, {readSheetNames} from '../helpers/readFile';
import queryGeocoder from '../helpers/queryGeocoder';
import {saveToLocalStorage, loadFromLocalStorage} from '../helpers/localStorage';
import fieldHelper from '../helpers/fieldHelper';

import Navbar from './Navbar';
import FORMOPTIONS from './form/options';
import Form from './form/Form';
import FileUpload from './App/FileUpload';
import TablePreview from './App/TablePreview';
import TableResult from './App/TableResult';
import ColumnsPicker from './App/ColumnsPicker';
import AppInfo from './App/AppInfo';

import Editor from './editor/Editor';

class App extends Component {
    state = {
        file: null,
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
        tabOptions: [],
        tabValue: 0,
        fileName : '',
        fileError: false,
        exportColumns: {},
        isEditorOpen: false,
        currentEdit: {}
    }

    componentWillMount(){
      //load up backup data, only if it is the same version
      if(localStorage.getItem("version") === 'v1.1b'){
        const res = loadFromLocalStorage('app');
        if(res){
          const {header, body, results, exportColumns, fileName} = res;
          this.setState({
            header, body, results, exportColumns, fileName
          });
        }
      }else{
        localStorage.setItem('version','v1.1b');
      }
    }

    _onFileChange = e => {
        const file = e.target.files[0];
        const fileName = file.name.split('.')[0];

        readSheetNames(file).then(sheetNames => {
          //update sheetnames
          this.setState({
            file: null,
            tabValue: 0,
            tabOptions: sheetNames.map((sheetName, i) => {
              return {
                key: i,
                text: sheetName,
                value: i
              };
            })
          })
        }).then( i => {
          readFile(file)
          .then(sheet => {
            const header = sheet[0];
            const body = sheet.slice(1);
            const status = this.state.status;
            status.count = body.length;
  
            //reset
            this.setState({ 
              file,
              fileError: false,
              fileName,
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
        })
    }

    _onTabChange= (e, { value }) => {
      this.setState({
        tabValue: value
      });


      const file = this.state.file;
      if(file){
        const fileName = file.name.split('.')[0];
        readSheetNames(file).then(sheetNames => {
          this.setState({
            tabOptions: sheetNames.map((sheetName, i) => {
              return {
                key: i,
                text: sheetName,
                value: i
              };
            })
          })
        });

        readFile(file, value)
        .then(sheet => {
          const header = sheet[0];
          const body = sheet.slice(1);
          const status = this.state.status;
          status.count = body.length;

          //reset
          this.setState({ 
            file,
            fileError: false,
            fileName,
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
          //helpers for certain fields like borough
          query[field] = fieldHelper(row[index], field);
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

            return {...data, error: false, rowIndex: i, debug: {query, type, string: JSON.stringify(query)}}
          })
          .catch(error => {
            const status = this.state.status;
            status.resultsCount++
            status.errorsCount++
            this.setState({ status })

            return {error , rowIndex: i,  debug: {query, type, string: JSON.stringify(query)}}
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
        // exportColumns.Longitude = true;
        // exportColumns.Latitude = true;
        
        this.setState({
          status,
          results,
          exportColumns
        });

        //backup results
        const {header, body, fileName} = this.state;
        saveToLocalStorage('app', {
          header, body, results, exportColumns, fileName
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

    _handleEditorOpen = (debug, error, rowIndex) => {
      this.setState({
        isEditorOpen: true,
        currentEdit: {...debug, error, rowIndex}
      })
    }

    _editRow = (rowIndex, data) => {
      const results = this.state.results;

      results[rowIndex] = data;
      this.setState({
        results,
        isEditorOpen: false
      }, ()=> {
        //backup results
        const {header, body, fileName, exportColumns} = this.state;
        saveToLocalStorage('app', {
          header, body, results, exportColumns, fileName
        });
      });
    }

  render() {
    return (
      <div>
        <Navbar 
          location={this.props.location.pathname}
        />

        <AppInfo />

          <FileUpload 
            _onFileChange={this._onFileChange} 
            fileError={this.state.fileError}
            tabOptions={this.state.tabOptions}
            tabValue={this.state.tabValue}
            _onTabChange={this._onTabChange}
          />

        <TablePreview 
          header={this.state.header} 
          body={this.state.body}
        />

        <Form 
          header={this.state.header} 
          fields={this.state.fields}
          status={this.state.status}
          queryApi={this.queryApi}
          fileError={this.state.fileError}
          options={FORMOPTIONS}
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
          fileName={this.state.fileName}
          history={this.props.history}
        />

        <Editor 
          open={this.state.isEditorOpen} 
          _handleEditorClose={this._handleEditorClose} 
          currentEdit={this.state.currentEdit} 
          header={this.state.header}
          body={this.state.body}
          _editRow={this._editRow}
        />
        
      </div>
    );
  }
}

export default App;
