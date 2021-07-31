import { Grid, Paper, Typography } from '@material-ui/core';

export default function CurrentQuestions({ leagueQuestions }) {
  const createGroups = (arr, numGroups) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  const updatedQuestions = leagueQuestions.map(ele => {
    const { name, options } = ele;
    const updatedEle = { name, options: createGroups(options, 2) };
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
  return updatedQuestions.length ? currentQuestionsContainer : null;
}
