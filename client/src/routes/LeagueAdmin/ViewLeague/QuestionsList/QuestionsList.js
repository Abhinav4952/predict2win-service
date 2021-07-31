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
  Box,
  CircularProgress,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../../api/Api';

export default function QuestionsList({ onSave }) {
  const params = useParams();
  const [progress, setProgress] = useState(false);
  const [leagueQuestions, setCurrentQuestions] = useState([]);
  const [submitDisable, setsubmitDisable] = useState(false);

  const getAPIConfiguration = leagueId => {
    return {
      url: `/api/v1/leagueAdmin/getQuestionsByLeague/${leagueId}`,
    };
  };

  const getLeagueById = leagueId => {
    return {
      url: `/api/v1/leagueAdmin/getLeagueById/${leagueId}`,
    };
  };

  const submitAnswers = ({ leagueId, questionAnswers }) => {
    return {
      url: '/api/v1/leagueAdmin/updateAnswer',
      options: { method: 'POST' },
      payload: { leagueId, questionAnswers },
    };
  };

  const createGroups = (arr, numGroups = 2) => {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups).fill('').map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  };

  const [formValues, setFormValues] = useState();

  const getQuestionsByLeagueId = async () => {
    try {
      setProgress(true);
      const questions = await Api.performRequest(getAPIConfiguration(params.leagueId));
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

  const onSubmit = async () => {
    try {
      setsubmitDisable(true);
      const updatedAnswers = Object.keys(formValues).map(ele => {
        return {
          questionId: ele,
          optionValue: formValues[ele],
        };
      });
      const submitRequest = submitAnswers({
        leagueId: params.leagueId,
        questionAnswers: updatedAnswers,
      });
      console.log('submitRequest', submitRequest);
      await Api.performRequest(submitRequest);
      const leagueData = await Api.performRequest(getLeagueById(params.leagueId));
      onSave(leagueData?.data);
    } catch (err) {
      setsubmitDisable(false);
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
  }, []);

  const questionsContainer = leagueQuestions.map(ele => (
    <Grid item xs={12} md={12} lg={12}>
      <FormControl component="fieldset">
        <Paper elevation={2} className="p-3">
          <Grid container spacing={2} direction="column">
            <Grid item xs={12} md={12} lg={12}>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  {ele.question} {ele.id}
                </Typography>
              </FormLabel>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <RadioGroup aria-label="quiz" name={ele.id} onChange={handleChange}>
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
      {progress && !leagueQuestions.length ? progressContainer : questionsContainer}
      <Grid item xs={12} md={12} lg={12} className="my-3">
        <Grid container spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled={!leagueQuestions.length || submitDisable}
            onClick={() => onSubmit()}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
