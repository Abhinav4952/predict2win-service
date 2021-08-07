import { Box, Grid, Container, Paper, CircularProgress } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../api/Api';
import LeagueAdminApi from '../../../api/LeagueAdminApi';
import LeagueStatus from '../../../helpers/enums/LeagueStatus';
import AnsweredQuestionsList from './AnsweredQuestionsList/AnsweredQuestionsList';
import LeagueInfo from './LeagueInfo/LeagueInfo';
import LeagueTiles from './LeagueTiles/LeagueTiles';
import LeagueUserDashboard from './LeagueUserDashboard/LeagueUserDashboard';
import QuestionsList from './QuestionsList/QuestionsList';
import QuestionsPanel from './QuestionsPanel/QuestionsPanel';

export default function ViewLeague() {
  const params = useParams();
  const [progress, setProgress] = useState(false);
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
    }
  };

  useEffect(() => {
    getLeagueById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.leagueId]);

  const progressContainer = (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
  return (
    <Paper style={{ background: '#FFFFF' }}>
      <Container maxWidth="xl" className="p-3">
        {progress && !leagueDetails ? (
          progressContainer
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
                    <LeagueUserDashboard />
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
