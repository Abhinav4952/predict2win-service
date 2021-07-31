import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import AddQuestion from './AddQuestion/AddQuestion';
import SaveIcon from '@material-ui/icons/Save';
import CurrentQuestions from './CurrentQuestions/CurrentQuestions';
import Api from '../../../../api/Api';
import { useParams } from 'react-router-dom';
import SlotInput from './SlotInput/SlotInput';

export default function QuestionsPanel({ onStartLeague }) {
  const [addQuestion, setAddQuestion] = useState(false);
  const [progress, setProgress] = useState(false);
  const [leagueQuestions, setCurrentQuestions] = useState([]);
  const [disableStartLeague, setdisableStartLeague] = useState(false);
  const [slots, setSlotsInput] = useState(false);

  const params = useParams();

  const getAPIConfiguration = leagueId => {
    return {
      url: `/api/v1/leagueAdmin/getQuestionsByLeague/${leagueId}`,
    };
  };

  const addQuestionConfiguration = ({ leagueId, name, options, questionType, correctAnswerValue }) => {
    return {
      url: '/api/v1/leagueAdmin/addQuestion',
      options: { method: 'POST' },
      payload: { leagueId, name, options, questionType, correctAnswerValue },
    };
  };

  const startLeagueConfiguration = ({ leagueId, slots }) => {
    return {
      url: '/api/v1/leagueAdmin/startLeague',
      options: { method: 'POST' },
      payload: { leagueId, slots },
    };
  };

  const getLeagueById = leagueId => {
    return {
      url: `/api/v1/leagueAdmin/getLeagueById/${leagueId}`,
    };
  };

  const progressContainer = (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );

  const onStart = async () => {
    try {
      setdisableStartLeague(true);
      setSlotsInput(true);
    } catch (err) {
      setdisableStartLeague(false);
      console.log(err);
    }
  };

  const startleague = async slotsVal => {
    try {
      setSlotsInput(false);

      const request = startLeagueConfiguration({ leagueId: params.leagueId, slots: Number(slotsVal) });
      await Api.performRequest(request);

      const league = await Api.performRequest(getLeagueById(params.leagueId));
      onStartLeague(league?.data);
    } catch (err) {
      setdisableStartLeague(false);
      console.log(err);
    }
  };

  const getQuestionsByLeagueId = async () => {
    try {
      setProgress(true);
      const questions = await Api.performRequest(getAPIConfiguration(params.leagueId));
      console.log(questions?.data);
      setCurrentQuestions(questions?.data);
      setProgress(false);
    } catch (err) {
      console.log(err);
    }
  };

  const saveQuestion = async res => {
    try {
      const optionsList = Object.values(res.options).map(ele => {
        return { optionValue: ele };
      });
      const addQuestionsRequest = addQuestionConfiguration({
        name: res.question,
        leagueId: params.leagueId,
        options: optionsList,
        questionType: 'RADIO_BUTTON',
        correctAnswerValue: Number(res?.correctValue) || 0,
      });
      const questionData = await Api.performRequest(addQuestionsRequest);
      console.log(questionData);
      leagueQuestions?.push(questionData?.data);
      setAddQuestion(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQuestionsByLeagueId();
  }, []);

  const questionsPanelContainer = (
    <>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} md={12} lg={12}>
          {leagueQuestions.length ? <CurrentQuestions leagueQuestions={leagueQuestions} /> : null}
        </Grid>
        {addQuestion ? (
          <Grid item xs={12} md={12} lg={12}>
            <AddQuestion onCancel={() => setAddQuestion(false)} onSubmit={saveQuestion} />
          </Grid>
        ) : null}
        {!addQuestion ? (
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={2} justifyContent="flex-end">
              {leagueQuestions.length >= 3 ? (
                <Button
                  variant="contained"
                  color="primary"
                  className="mx-3"
                  disabled={disableStartLeague}
                  onClick={() => onStart()}
                >
                  Start league
                </Button>
              ) : null}
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => setAddQuestion(true)}>
                Add Question
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
      <SlotInput
        open={slots}
        handleClose={() => {
          setdisableStartLeague(false);
          setSlotsInput(false);
        }}
        handleSubmit={e => startleague(e)}
      />
    </>
  );

  return progress && !leagueQuestions ? progressContainer : questionsPanelContainer;
}
