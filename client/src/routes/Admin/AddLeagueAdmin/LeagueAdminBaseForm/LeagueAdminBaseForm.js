import { Box, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { useState } from 'react';
import formValidation from '../../../../helpers/formValidation/formValidation';
import LeagueAddSucess from '../../../LeagueAdmin/LeagueAddSucess/LeagueAddSucess';
import LeagueAdminBasicDetails from './LeagueAdminBasicDetails/LeagueAdminBasicDetails';
import LeagueAdminDetailConfirmation from './LeagueAdminDetailConfirmation/LeagueAdminDetailConfirmation';

// Step titles
const labels = ['League Admin Details', 'Confirmation'];

const initialValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
};

const fieldsValidation = {
  firstName: {
    error: '',
    validate: 'text',
    minLength: 2,
    maxLength: 10,
  },
  lastName: {
    error: '',
    validate: 'text',
    minLength: 2,
    maxLength: 10,
  },
  username: {
    error: '',
    validate: 'text',
    minLength: 2,
    maxLength: 15,
  },
  email: {
    error: '',
    validate: 'email',
    minLength: 2,
    maxLength: 30,
  },
};

export default function LeagueAdminBaseForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  // Proceed to next step
  const handleNext = () => setActiveStep(prev => prev + 1);
  // Go back to prev step
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleChange = e => {
    const { name, value } = e.target;

    // Set values
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // set errors
    const error = formValidation(name, value, fieldsValidation) || '';

    setFormErrors({
      [name]: error,
    });
  };

  const handleSteps = step => {
    switch (step) {
      case 0:
        return (
          <LeagueAdminBasicDetails
            handleNext={handleNext}
            handleChange={handleChange}
            values={formValues}
            formErrors={formErrors}
          />
        );
      case 1:
        return <LeagueAdminDetailConfirmation handleNext={handleNext} handleBack={handleBack} values={formValues} />;
      default:
        break;
    }
  };

  return (
    <>
      {activeStep === labels.length ? (
        // Last Component
        <LeagueAddSucess text="User will get an email with further instructions" />
      ) : (
        <>
          <Box style={{ margin: '30px 0 50px' }}>
            <Typography variant="h4" align="center">
              Add League Admin
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ margin: '10px 0' }}>
              Register League Admin and invite them to add Leagues
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} style={{ margin: '30px 0 15px' }} alternativeLabel>
            {labels.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {handleSteps(activeStep)}
        </>
      )}
    </>
  );
}
