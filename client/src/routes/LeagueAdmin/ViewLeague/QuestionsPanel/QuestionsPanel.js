import { Button, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import AddQuestion from './AddQuestion/AddQuestion';
import SaveIcon from '@material-ui/icons/Save';
import CurrentQuestions from './CurrentQuestions/CurrentQuestions';
import Api from '../../../../api/Api';
import { useParams } from 'react-router-dom';
import SlotInput from './SlotInput/SlotInput';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';
import ErrorContainer from '../../../../components/lib/ErrorContainer/ErrorContainer';
import ProgressContainer from '../../../../components/lib/ProgressContainer/ProgressContainer';

export default function QuestionsPanel({ onStartLeague }) {
  const [addQuestion, setAddQuestion] = useState(false);
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState();
  const [leagueQuestions, setCurrentQuestions] = useState([]);
  const [disableStartLeague, setdisableStartLeague] = useState(false);
  const [slots, setSlotsInput] = useState(false);

  const params = useParams();

  const getHandlerContainer = (errText, errorVal) => {
    if (errorVal) {
      return <ErrorContainer text={errText} />;
    }
    return <ProgressContainer />;
  };

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

      const request = LeagueAdminApi.startLeague({ leagueId: params.leagueId, slots: Number(slotsVal) });
      await Api.performRequest(request);

      const league = await Api.performRequest(LeagueAdminApi.getLeagueById(params.leagueId));
      onStartLeague(league?.data);
    } catch (err) {
      setdisableStartLeague(false);
      console.log(err);
    }
  };

  const getQuestionsByLeagueId = async () => {
    try {
      setProgress(true);
      const questions = await Api.performRequest(LeagueAdminApi.getQuestionByLeagueId(params.leagueId));
      console.log(questions?.data);
      setCurrentQuestions(questions?.data);
      setProgress(false);
      if(questions?.data?.length === 0){
        setError("No Questions to display");
      }
    } catch (err) {
      setError(err);
      setProgress(false);
      console.log(err);
    }
  };

  const saveQuestion = async res => {
    try {
      const optionsList = Object.values(res.options).map(ele => {
        return { optionValue: ele };
      });
      const addQuestionsRequest = LeagueAdminApi.addQuestion({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return progress && !leagueQuestions
    ? getHandlerContainer('Unable to fecthQuestions', error)
    : questionsPanelContainer;
}
