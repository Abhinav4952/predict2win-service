import { Grid, Paper, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { useEffect, useState } from 'react';
import UserApi from '../../../../api/UserApi';
import Api from '../../../../api/Api';
import ProgressContainer from '../../../../components/lib/ProgressContainer/ProgressContainer';

export default function LeagueAnswers({ participationId }) {
  const [questionDetails, setQuestionDetails] = useState([]);
  const [progress, setProgress] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();

  const createGroups = (arr, numGroups = 2) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  const correctAnswerContainer = <CheckCircleIcon style={{ color: green[500] }} className="mx-1" />;

  const wrongAnswer = <CancelIcon style={{ color: red[500] }} className="mx-1" />;

  const getAnswerValue = (option, correctAnswer) => {
    return option === correctAnswer ? correctAnswerContainer : wrongAnswer;
  };

  const getAnswers = async () => {
    try {
      setProgress(true);
      const questionRequest = UserApi.getAnswersByParticipationId(participationId);
      const questionResponse = await Api.performRequest(questionRequest);
      console.log(questionResponse?.data[0]?.questionDetails);
      const updatedQuestions = questionResponse?.data[0]?.questionDetails.map(ele => {
        const { name, options, selectedOption, correctAnswer } = ele;
        return {
          questionName: name,
          options: createGroups(options),
          selectedOption,
          correctAnswer,
        };
      });
      console.log(updatedQuestions);
      setQuestionDetails(updatedQuestions);
      setProgress(false);
    } catch (err) {
      setProgress(false);
      setError(err);
      console.log(err);
    }
  };

  useEffect(() => {
    getAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedQuestinsCotainer = questionDetails.map(question => (
    <Grid item xs={12} md={12} lg={12} key={question?.questionName}>
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
                  <Grid item xs={6} md={6} lg={6} key={e?._id}>
                    <Typography variant="body2" gutterBottom>
                      {e.optionValue}
                      {e.optionValue === question.selectedOption
                        ? getAnswerValue(e.optionValue, question.correctAnswer)
                        : null}
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
  return !progress && questionDetails.length ? currentQuestionsContainer : <ProgressContainer />;
}
