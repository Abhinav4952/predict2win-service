import { Grid, Container, Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../api/Api';
import LeagueAdminApi from '../../../api/LeagueAdminApi';
import ErrorContainer from '../../../components/lib/ErrorContainer/ErrorContainer';
import ProgressContainer from '../../../components/lib/ProgressContainer/ProgressContainer';
import LeagueStatus from '../../../helpers/enums/LeagueStatus';
import AnsweredQuestionsList from './AnsweredQuestionsList/AnsweredQuestionsList';
import LeagueInfo from './LeagueInfo/LeagueInfo';
import LeagueTiles from './LeagueTiles/LeagueTiles';
import LeagueUserDashboard from './LeagueUserDashboard/LeagueUserDashboard';
import QuestionsList from './QuestionsList/QuestionsList';
import QuestionsPanel from './QuestionsPanel/QuestionsPanel';
import UserDiscussionForum from './UserDiscussionForum/UserDiscussionForum';

export default function ViewLeague() {
  const params = useParams();
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState(false);
  const [leagueDetails, setleagueDetails] = useState();

  const getLeagueById = async () => {
    try {
      setProgress(true);
      const leagueDetails = await Api.performRequest(LeagueAdminApi.getLeagueById(params.leagueId));
      console.log(leagueDetails?.data);
      setleagueDetails(leagueDetails?.data);
      setProgress(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setProgress(false);
    }
  };

  useEffect(() => {
    getLeagueById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.leagueId]);

  const getHandlerContainer = (errText, errorVal) => {
    if (errorVal) {
      return <ErrorContainer text={errText} />;
    }
    return <ProgressContainer />;
  };

  return (
    <Paper style={{ background: '#FFFFF' }}>
      <Container maxWidth="xl" className="p-3">
        {progress && !leagueDetails ? (
          getHandlerContainer('Unable to fetch league Details', error)
        ) : (
          <Grid container spacing={3}>
            <LeagueTiles />
            <Grid item xs={12} md={12} lg={6}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12} sm={12} md={12}>
                  <Paper elevation={'3'} className="p-3">
                    <LeagueInfo {...leagueDetails} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Paper elevation={'3'} className="p-3">
                    <LeagueUserDashboard leagueStatus={leagueDetails?.leagueStatus} />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Paper elevation={'3'} className="p-3">
                    <UserDiscussionForum />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <Paper elevation={'3'} className="p-3">
                {leagueDetails?.leagueStatus === LeagueStatus.Created ? (
                  <QuestionsPanel onStartLeague={data => setleagueDetails(data)} />
                ) : null}
                {leagueDetails?.leagueStatus === LeagueStatus.RegistrationOpen ? (
                  <QuestionsList onSave={data => setleagueDetails(data)} />
                ) : null}
                {leagueDetails?.leagueStatus === LeagueStatus.RegistrationClosed ? <AnsweredQuestionsList /> : null}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Paper>
  );
}
