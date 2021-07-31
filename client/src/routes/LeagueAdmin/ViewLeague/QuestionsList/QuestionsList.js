import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  Button,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { useState } from 'react';

export default function QuestionsList({onSave}) {
  const createGroups = (arr, numGroups) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  const [formValues, setFormValues] = useState();


  const handleChange = e => {
    console.log(e.target);
    const { name, value } = e.target;

    // Set values
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const questions = [
    {
      question:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerc',
      options: ['Test', 'Test1', 'Test2', 'Test3'],
    },
    {
      question:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerc',
      options: ['Test', 'Test1', 'Test2', 'Test3'],
    },
    {
      question:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerc',
      options: ['Test', 'Test1', 'Test2', 'Test3'],
    },
  ];

  const modifiedQuestions = questions.map(ele => {
    const { question, options } = ele;
    const updatedEle = { question: question, options: createGroups(options, 2) };
    return updatedEle;
  });

  const questionsContainer = modifiedQuestions.map((ele, index) => (
    <Grid item xs={12} md={12} lg={12}>
      <FormControl component="fieldset">
        <Paper elevation={2} className="p-3">
          <Grid container spacing={2} direction="column">
            <Grid item xs={12} md={12} lg={12}>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  {ele.question}
                </Typography>
              </FormLabel>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <RadioGroup aria-label="quiz" name={index} onChange={handleChange}>
                {ele.options.map(option => (
                  <Grid container spacing={2} justifyContent="space-between">
                    {option.map(o => (
                      <Grid item xs={6} md={6} lg={6}>
                        <FormControlLabel value={o} control={<Radio />} label={o} />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>
      </FormControl>
    </Grid>
  ));

  return (
    <Grid container spacing={2} direction="column">
      {questionsContainer}
      <Grid item xs={12} md={12} lg={12} className="my-3">
        <Grid container spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" size="large" startIcon={<SaveIcon />} onClick={() => onSave(formValues)}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
