import { Grid } from '@material-ui/core';
import CurrentQuestions from './CurrentQuestions/CurrentQuestions';

export default function QuestionsPanel({}) {
  return (
    <Grid container spacing={2} justifyContent="center" alignContent="center" alignItems="center" direction="column">
      <Grid item xs={12} md={12} lg={12}>
        <CurrentQuestions />
      </Grid>
    </Grid>
  );
}
