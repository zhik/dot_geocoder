import React, { Component } from 'react';
import '../../css/Form.css';
import options from './options';

import Types from './Types';
import Fields from './Fields';
import Steps from './Steps';
import Confirm from './Confirm';

class Form extends Component {
  state = {
    selectedType: null,
    currentStep: 'types',
    fields: {},
    confirm: false,
  }

  //handle step changes
  _changeStep = step => {
    this.setState({currentStep: step});
  }

  stepView = () => {
    if(this.props.fileError) return null;
    
    switch(this.state.currentStep){
      case 'types': return <Types selectedType={this.state.selectedType} _changeType={this._changeType} _changeStep={this._changeStep} />;
      case 'fields': return <Fields header={this.props.header} selectedType={this.state.selectedType} fields={this.state.fields} _changeField={this._changeField} _changeStep={this._changeStep} />;
      case 'confirm': return <Confirm _submitForm={this._submitForm} status={this.props.status} _changeStep={this._changeStep} />;
      default: return null;
    }
  }

  //handle type changes
  _changeType = (event, data) => {
    const selectedType = data.value;
    this.setState({ selectedType });
    //reset fields
    const fields = options[selectedType].fields.reduce((fields, field) => {
      fields[field.name] = null;
      return fields;
    },{})
    this.setState({ fields });
  }

  // handle field changes
  _changeField = (event, data, field) => {
    const fields = this.state.fields
    fields[field] = data.value !== 'empty' ? data.value : null;
    this.setState({ field });

    if(this.checkForm()){
      this.setState({confirm: true});
    }else{
      this.setState({confirm: false});
    }
  }

  //form vaildation 
  checkForm(){
    return true;
  }

  _submitForm= () => {
    this.props.queryApi(this.state.fields,this.state.selectedType)
  }

  render() {
    return ( 
    <div className='panel'>
      <div className='left-panel'>
        <Steps 
          currentStep={this.state.currentStep} 
          _changeStep={this._changeStep} 
          header={this.props.header} 
          selectedType={this.state.selectedType}
          confirm={this.state.confirm}
          fileError={this.props.fileError}
          />
      </div> 
      <div className='right-panel'>
        {this.stepView()}
      </div>
    </div>
    );
  }
}

export default Form;