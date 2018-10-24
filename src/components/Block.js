import React, { Component } from 'react';
import Navbar from './Navbar';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';


import FileUpload from './App/FileUpload';
import TablePreview from './App/TablePreview';
import FORMBLOCKOPTIONS from './form/blockOptions';
import Form from './form/Form';

import readFile from '../helpers/readFile';


class Block extends Component{
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
        fileName : '',
        fileError: false,
        exportColumns: {},
        isEditorOpen: false,
        currentEdit: {}
    }

    _onFileChange = e => {
        const file = e.target.files[0];
        const fileName = file.name.split('.')[0];
        readFile(file)
        .then(sheet => {
          const header = sheet[0];
          const body = sheet.slice(1);
          const status = this.state.status;
          status.count = body.length;

          //reset
          this.setState({ 
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

//     queryApi = (fields,type) => {
//         //reset status and start
//         const status = this.state.status;
//         status.start = true;
//         status.finshed = false;
//         status.resultsCount = 0;
//         status.errorsCount = 0;
//         this.setState({ status });
  
//         //get the index for each field, if it isn't null
//         const fieldIndexes = Object.keys(fields).reduce((fieldIndexes, field) => {
//           if(fields[field]){
//             fieldIndexes[field] = this.state.header.indexOf(fields[field]);
//           }
//           return fieldIndexes;
//         },{})
  
//         //setup query all rows in body, using the index
//         const queries = this.state.body.map(row => {
//           return Object.keys(fieldIndexes).reduce((query, field) => {
//             const index = fieldIndexes[field];
//             //helpers for certain fields like borough
//             query[field] = fieldHelper(row[index], field);
//             return query;
//           },{});
//         })
//  //start query
//  Promise.all(queries.map( (query,i) => {
//     return queryGeocoder(type, query)
//       .then(data=> {
//         const status = this.state.status;
//         status.resultsCount++
//         this.setState({ status })

//         return {...data, error: false, rowIndex: i, debug: {query, type, string: JSON.stringify(query)}}
//       })
//       .catch(error => {
//         const status = this.state.status;
//         status.resultsCount++
//         status.errorsCount++
//         this.setState({ status })

//         return {error , rowIndex: i,  debug: {query, type, string: JSON.stringify(query)}}
//       })
//   }))
//     .then(results => {
//       const status = this.state.status;
//       status.start = false;
//       status.finshed = true;

//     //default enable header columns and error
//     const exportColumns = {};
//     this.state.header.map(i => exportColumns[i] = true);
//     exportColumns.error = true;
//     exportColumns.XCoordinate = true;
//     exportColumns.YCoordinate = true;
//     // exportColumns.Longitude = true;
//     // exportColumns.Latitude = true;
    
//     this.setState({
//       status,
//       results,
//       exportColumns
//     });

//     //backup results
//     const {header, body, fileName} = this.state;
//     saveToLocalStorage('res', {
//       header, body, results, exportColumns, fileName
//     });

//     })

// }


    render(){
        return(
            <React.Fragment>
                <Navbar/>

                <FileUpload 
                    _onFileChange={this._onFileChange} 
                    fileError={this.state.fileError}
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
                    options={FORMBLOCKOPTIONS}
                />
                
            </React.Fragment>
        )
    }
}

export default Block;
