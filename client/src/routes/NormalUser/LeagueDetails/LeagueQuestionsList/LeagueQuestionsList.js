import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../../api/Api';
import UserApi from '../../../../api/UserApi';
import Questions from '../../../../components/lib/Questions/Questions';
import SaveIcon from '@material-ui/icons/Save';

export default function LeagueQuestionsList() {
  const params = useParams();
  const [progress, setProgress] = useState(false);
  const [leagueQuestions, setCurrentQuestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [submitDisable, setsubmitDisable] = useState(false);

  const createGroups = (arr, numGroups = 2) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  // eslint-disable-next-line no-unused-vars
  const [formValues, setFormValues] = useState();

  const getQuestionsByLeagueId = async () => {
    try {
      setProgress(true);
      const questions = await Api.performRequest(UserApi.getQuestionsLeagueById(params.leagueId));
      console.log(questions?.data);
      if (!questions?.data.length) {
        setCurrentQuestions(questions?.data);
        return;
      }
      const updatedQuestions = questions?.data.map(ele => {
        console.log(ele);
        const { name, options, _id } = ele;
        const updatedOptions = Object.values(options).map(e => e.optionValue);
        return {
          question: name,
          id: _id,
          options: createGroups(updatedOptions, 2),
        };
      });
      console.log(updatedQuestions);
      setCurrentQuestions(updatedQuestions);
      setProgress(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = e => {
    console.log(e.target);
    const { name, value } = e.target;

    // Set values
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const progressContainer = (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );

  useEffect(() => {
    getQuestionsByLeagueId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const questionsContainer = <Questions questions={leagueQuestions} handleChange={val => handleChange(val)} />;

  return (
    <Grid container spacing={2} direction="column">
      {progress && !leagueQuestions.length ? progressContainer : questionsContainer}
      <Grid item xs={12} md={12} lg={12} className="my-3">
        <Grid container spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled={!leagueQuestions.length || submitDisable}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
