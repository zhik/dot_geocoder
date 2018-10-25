//deals with (points - lines) array/list returns like block face and stretch
import React, { Component } from 'react';
import Navbar from './Navbar';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';

import readFile from '../helpers/readFile';
import queryGeocoder from '../helpers/queryGeocoder';
import {saveToLocalStorage, loadFromLocalStorage} from '../helpers/localStorage';
import fieldHelper from '../helpers/fieldHelper';
import {blockReduce} from '../helpers/blockReduce';

import FileUpload from './App/FileUpload';
import TablePreview from './App/TablePreview';
import FORMBLOCKOPTIONS from './form/blockOptions';
import Form from './form/Form';
import ColumnsPicker from './App/ColumnsPicker';
import BlockTableResult from './App/BlockTableResult';

import BlockEditor from './editor/BlockEditor';

class BlockApp extends Component{
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

    componentWillMount(){
        //load up backup data, only if it is the same version
        if(localStorage.getItem("version") === 'alpha v0.3 working editor!'){
          const res = loadFromLocalStorage('block-app');
          if(res){
            const {header, body, results, exportColumns, fileName} = res;
            this.setState({
              header, body, results, exportColumns, fileName
            });
          }
        }else{
          localStorage.setItem('version','alpha v0.3 working editor!');
        }
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

    queryApi = (fields, type) => {
        //reset status and start
        const status = this.state.status;
        status.start = true;
        status.finshed = false;
        status.resultsCount = 0;
        status.errorsCount = 0;
        this.setState({
            status
        });


        //get the index for each field, if it isn't null
        const fieldIndexes = Object.keys(fields).reduce((fieldIndexes, field) => {
            if (fields[field]) {
                fieldIndexes[field] = this.state.header.indexOf(fields[field]);
            }
            return fieldIndexes;
        }, {})

        //setup query all rows in body, using the index
        const queries = this.state.body.map(row => {
            const queryObject = Object.keys(fieldIndexes).reduce((query, field) => {
                const index = fieldIndexes[field];
                //helpers for certain fields like borough
                query[field] = fieldHelper(row[index], field);


                return query;
            }, {});

            //add hidden field, for certain functions ExtendedStretchType
            switch (type) {
                case 'extendedStretch_blockface':
                    queryObject['BlockType'] = 'ExtendedStretch';
                    queryObject['ExtendedStretchType'] = 'Blockface';

                    break;
                case 'extendedStretch_intersection':
                    queryObject['BlockType'] = 'ExtendedStretch';
                    queryObject['ExtendedStretchType'] = 'Intersection';
                    break;
                default:
            }
            return queryObject;
        });

        let mod_type = type;
        //fix the type so the url works for Block functions
        switch (type) {
            case ('extendedStretch_blockface'):
            case ('extendedStretch_intersection'):
                mod_type = 'Block';
                break;
            default:
        }

        //start query
        Promise.all(queries.map((query, i) => {
                return queryGeocoder(mod_type, query)
                    .then(data => {
                        const status = this.state.status;
                        status.resultsCount++
                            this.setState({
                                status
                            })

                        return { ...data,
                            error: false,
                            rowIndex: i,
                            debug: {
                                query,
                                type,
                                string: JSON.stringify(query)
                            }
                        }
                    })
                    .catch(error => {
                        const status = this.state.status;
                        status.resultsCount++
                            status.errorsCount++
                            this.setState({
                                status
                            })

                        return {
                            error,
                            rowIndex: i,
                            debug: {
                                query,
                                type,
                                string: JSON.stringify(query)
                            }
                        }
                    })
            }))
            .then((results) => {
                //To-do add await instead of chaining promises

                //get block results and sort by rowIndex and listIndex 
                blockReduce(results).then(res => {
                    const mod_results = res.sort((a, b) => {
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
                        console.log(mod_results)

                        const status = this.state.status;
                        status.start = false;
                        status.finshed = true;
            
                        //default enable header columns and error
                        const exportColumns = {};
                        this.state.header.map(i => exportColumns[i] = true);
                        exportColumns.error = true;
                        // exportColumns.XCoordinate = true;
                        // exportColumns.YCoordinate = true;
                        // exportColumns.Longitude = true;
                        // exportColumns.Latitude = true;
                        
                        this.setState({
                            status,
                            results: mod_results,
                            exportColumns
                        });
            
                        //backup results
                        const {header, body, fileName} = this.state;
                        saveToLocalStorage('block-app', {
                        header, body, results: mod_results, exportColumns, fileName
                        });

                    });

                });
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

            console.log(rowIndex, data);
      
            // results[rowIndex] = data;
            // this.setState({
            //   results,
            //   isEditorOpen: false
            // }, ()=> {
            //   //backup results
            //   const {header, body, fileName, exportColumns} = this.state;
            //   saveToLocalStorage('res', {
            //     header, body, results, exportColumns, fileName
            //   });
            // });
          }


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

                <ColumnsPicker 
                    header={this.state.header}
                    results={this.state.results}
                    exportColumns={this.state.exportColumns}
                    _updateExportColumn={this._updateExportColumn}
                />

                <BlockTableResult 
                    header={this.state.header} 
                    body={this.state.body}
                    results={this.state.results}
                    exportColumns={this.state.exportColumns}
                    _handleEditorOpen={this._handleEditorOpen}
                    fileName={this.state.fileName}
                />
                

                <BlockEditor 
                    open={this.state.isEditorOpen} 
                    _handleEditorClose={this._handleEditorClose} 
                    currentEdit={this.state.currentEdit} 
                    header={this.state.header}
                    body={this.state.body}
                    _editRow={this._editRow}
                />
            </React.Fragment>
        )
    }
}

export default BlockApp;
