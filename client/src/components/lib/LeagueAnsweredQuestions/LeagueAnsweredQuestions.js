import { Grid, Paper, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default function LeagueAnsweredQuestions({ leagueQuestions }) {
  const createGroups = (arr, numGroups) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };
  const updatedQuestions = leagueQuestions.map(ele => {
    const { name, options, correctAnswer } = ele;
    const updatedEle = { name, options: createGroups(options, 2), correctAnswer };
    return updatedEle;
  });

  const updatedQuestinsCotainer = updatedQuestions.map(question => (
    <Grid item xs={12} md={12} lg={12}>
      <Paper elevation={1} className="p-3">
        <Grid container spacing={2} direction="column">
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body1" gutterBottom>
              {question.name}
            </Typography>
          </Grid>
          {question.options.map(opt => (
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={2} justifyContent="space-between">
                {opt.map(e => (
                  <Grid item xs={6} md={6} lg={6}>
                    <Typography variant="body2" gutterBottom>
                      {e.optionValue}
                      {question.correctAnswer === e.optionValue ? (
                        <CheckCircleIcon style={{ color: green[500] }} className="mx-1" />
                      ) : null}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Grid>
  ));

  const currentQuestionsContainer = (
    <Grid container spacing={2} direction="column">
      {updatedQuestinsCotainer}
    </Grid>
  );

  return currentQuestionsContainer;
}
