import { Box, CircularProgress, Grid, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../../api/Api';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';

export default function AnsweredQuestionsList() {
  const [progress, setProgress] = useState(false);
  const [leagueQuestions, setCurrentQuestions] = useState([]);
  const params = useParams();

  const createGroups = (arr, numGroups) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  const getQuestionsByLeagueId = async () => {
    try {
      setProgress(true);
      const questions = await Api.performRequest(LeagueAdminApi.getQuestionByLeagueId(params.leagueId));
      console.log(questions?.data);
      const updatedQuestions = questions?.data.map(ele => {
        const { name, options, correctAnswer } = ele;
        const updatedEle = { name, options: createGroups(options, 2), correctAnswer };
        return updatedEle;
      });
      setCurrentQuestions(updatedQuestions);
      setProgress(false);
    } catch (err) {
      setProgress(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getQuestionsByLeagueId();
  }, []);

  const updatedQuestinsCotainer = leagueQuestions.map(question => (
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

  const progressContainer = (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );

  return !progress && leagueQuestions.length ? currentQuestionsContainer : progressContainer;
}
