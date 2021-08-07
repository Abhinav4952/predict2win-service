import { Grid, Paper, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export default function LeagueAnswers() {
  const mockData = [
    {
      questionName: 'Testest',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      correctAnswer: 'Testesset',
      selectedOption: 'Testes',
    },
    {
      questionName: 'Testest',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      correctAnswer: 'Testes',
      selectedOption: 'Testesset',
    },
    {
      questionName: 'Testest',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      correctAnswer: 'waefwaef',
      selectedOption: 'waefwaef',
    },
    {
      questionName: 'Testest',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      correctAnswer: 'Tests',
      selectedOption: 'Testes',
    },
    {
      questionName: 'Testest',
      options: [
        ['Tests', 'Testes'],
        ['Testesset', 'waefwaef'],
      ],
      correctAnswer: 'Testes',
      selectedOption: 'Testes',
    },
  ];

  const correctAnswerContainer = <CheckCircleIcon style={{ color: green[500] }} className="mx-1" />;

  const wrongAnswer = <CancelIcon style={{ color: red[500] }} className="mx-1" />;

  const getAnswerValue = (option, correctAnswer) => {
    return option === correctAnswer ? correctAnswerContainer : wrongAnswer;
  };

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
                      {e}
                      {e === question.selectedOption ? getAnswerValue(e, question.correctAnswer) : null}
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
