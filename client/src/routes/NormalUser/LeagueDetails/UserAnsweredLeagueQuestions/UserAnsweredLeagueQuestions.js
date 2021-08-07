import { Grid, Paper, Typography } from '@material-ui/core';

export default function UserAnsweredLeagueQuestions() {
  const mockData = [
    {
      questionName:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      selectedOptions: 'Testes',
    },
    {
      questionName:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      selectedOptions: 'Testesset',
    },
    {
      questionName:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      selectedOptions: 'Tests',
    },
    {
      questionName:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      selectedOptions: 'waefwaef',
    },
    {
      questionName:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      selectedOptions: 'Testesset',
    },
  ];
  const updatedQuestinsCotainer = mockData.map(question => (
    <Grid item xs={12} md={12} lg={12}>
      <Paper elevation={1} className="p-3">
        <Grid container spacing={2} direction="column">
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body1" gutterBottom>
              {question.questionName}
            </Typography>
          </Grid>
          {question.options.map(opt => (
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={2} justifyContent="space-between">
                {opt.map(e => (
                  <Grid item xs={6} md={6} lg={6}>
                    <Typography variant="body2" gutterBottom>
                      {e === question.selectedOptions ? (
                        <span style={{ backgroundColor: '#F1F907' }}>{e}</span>
                      ) : (
                        <span>{e}</span>
                      )}
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
  return mockData.length ? currentQuestionsContainer : null;
}
