import { Button, Grid } from '@material-ui/core';
import { useState } from 'react';
import AddQuestion from './AddQuestion/AddQuestion';
import SaveIcon from '@material-ui/icons/Save';
import CurrentQuestions from './CurrentQuestions/CurrentQuestions';

export default function QuestionsPanel({}) {
  const [addQuestion, setAddQuestion] = useState(false);
  return (
    <Grid container spacing={2} direction="column">
      <Grid item xs={12} md={12} lg={12}>
        <CurrentQuestions />
      </Grid>
      {addQuestion ? (
        <Grid item xs={12} md={12} lg={12}>
          <AddQuestion onCancel={() => setAddQuestion(false)}/>
        </Grid>
      ) : null}
      {!addQuestion ? (<Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => setAddQuestion(true)}>
            Add Question
          </Button>
        </Grid>
      </Grid>) : null }
    </Grid>
  );
}
