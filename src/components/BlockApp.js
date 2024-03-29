//deals with (points - lines) array/list returns like block face and stretch
import React, { Component } from 'react';
import Navbar from './Navbar';
import '../css/App.css';
import 'semantic-ui-css/semantic.min.css';

import readFile, {readSheetNames} from '../helpers/readFile';
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
import AppInfo from './App/AppInfo';

import BlockEditor from './editor/BlockEditor';

class BlockApp extends Component{
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
        if(localStorage.getItem("version") === 'v1.1c'){
          const res = loadFromLocalStorage('block-app');
          if(res){
            const {header, body, results, exportColumns, fileName} = res;
            this.setState({
              header, body, results, exportColumns, fileName
            });
          }
        }else{
          localStorage.setItem('version','v1.1c');
        }
      }
  

      _onFileChange = e => {
        const file = e.target.files[0];

        readSheetNames(file).then(sheetNames => {
            //update sheetnames
          this.setState({
            file,
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
            const fileName = file.name.split('.')[0];
            const header = sheet[0].map(i => String(i));
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
              file: null,
              fileError: true,
              tabOptions: [],
              tabValue: 0,
              body: [],
              header: [] 
            });
          })
        }).catch(err => {
            console.error(err);
            this.setState({ 
              file: null,
              fileError: true,
              tabOptions: [],
              tabValue: 0,
              body: [],
              header: [] 
            });
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
          const header = sheet[0].map(i => String(i));
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
                blockReduce(results,type).then(res => {
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

                        const status = this.state.status;
                        status.start = false;
                        status.finshed = true;
            
                        //default enable header columns and error
                        const exportColumns = {};
                        this.state.header.map(i => exportColumns[i] = true);
                        exportColumns.error = true;
                        
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

            
            //find and remove error item
            const errorIndex = results.findIndex(result => result.rowIndex === rowIndex);
            
            if(errorIndex > -1) results.splice(errorIndex, 1);

            //add include debug object in newRows
            const newRows = data.data.map(d => {
                d.debug = data.debug;
                return d;
            });

            //concat items and sort 
            const mod_results = results.concat(newRows).sort((a, b) => {
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
            });
  
            this.setState({
              results: mod_results,
              isEditorOpen: false
            }, ()=> {
              //backup results
              const {header, body, fileName, exportColumns} = this.state;
              saveToLocalStorage('block-app', {
                header, body, results: mod_results, exportColumns, fileName
              });
            });
          }


    render(){
        return(
            <React.Fragment>
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
                    history={this.props.history}
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
