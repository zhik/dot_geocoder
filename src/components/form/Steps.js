import React from 'react';
import { Step } from 'semantic-ui-react';

const Steps = ({currentStep, _changeStep, header, selectedType, confirm}) => {
    const steps = [
        { 
            key: 'types', 
            icon: 'options', 
            active: currentStep === 'types',
            title: 'Function', 
            description: 'Choose geocoder function', 
            link: true, 
            onClick: () => _changeStep('types'),
        },
        { 
            key: 'fields', 
            icon: 'write', 
            active: currentStep === 'fields', 
            title: 'Fields', 
            description: 'Select required/optional fields', 
            link: true,
            onClick: () => _changeStep('fields'),
            disabled: !(header.length && selectedType) 
        },
        { 
            key: 'confirm', 
            icon: 'send outline', 
            active: currentStep === 'confirm',
            title: 'Confirm & Query', 
            link: true,
            onClick: () => _changeStep('confirm'),
            disabled: !(confirm && header.length)
        },
    ]

    return(
        <Step.Group vertical items={steps} />
    )
}

export default Steps;