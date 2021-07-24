import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import formValidation from '../../../../helpers/formValidation/formValidation';
import LeagueBasicDetails from '../LeagueBasicDetails/LeagueBasicDetails';
import LeagueImageUpload from '../LeagueImageUpload/LeagueImageUpload';
import LeagueDetailsConfirmation from '../LeagueDetailsConfirmation/LeagueDetailsConfirmation';
import LeagueAddSucess from '../../LeagueAddSucess/LeagueAddSucess';

// Step titles
const labels = ['League Details', 'League Image', 'Confirmation'];

const initialValues = {
  leagueName: '',
  leagueCategory: '',
  endTime: '',
  leagueDescription: '',
};

const fieldsValidation = {
  leagueName: {
    error: '',
    validate: 'text',
    minLength: 2,
    maxLength: 15,
  },
  leagueCategory: {
    error: '',
    validate: 'text',
  },
  endTime: {
    error: '',
    validate: 'date',
  },
  leagueDescription: {
    error: '',
    validate: 'text',
    minLength: 2,
    maxLength: 30,
  },
  leagueIcon: {
    validate: 'image',
  },
};

export default function LeagueBaseForm({}) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  // Proceed to next step
  const handleNext = () => setActiveStep(prev => prev + 1);
  // Go back to prev step
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleChange = e => {
    console.log(e.target);
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
          <LeagueBasicDetails
            handleNext={handleNext}
            handleChange={handleChange}
            values={formValues}
            formErrors={formErrors}
          />
        );
      case 1:
        return (
          <LeagueImageUpload
            handleNext={handleNext}
            handleBack={handleBack}
            handleChange={handleChange}
            values={formValues}
            formErrors={formErrors}
          />
        );
      case 2:
        return <LeagueDetailsConfirmation handleNext={handleNext} handleBack={handleBack} values={formValues} />;
      default:
        break;
    }
  };

  return (
    <>
      {activeStep === labels.length ? (
        // Last Component
        <LeagueAddSucess values={formValues} />
      ) : (
        <>
          <Box style={{ margin: '30px 0 50px' }}>
            <Typography variant="h4" align="center">
              Add League
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ margin: '10px 0' }}>
              Register your League and invite participants to join here
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
