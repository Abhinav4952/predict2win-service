import { Box, CircularProgress, Grid, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../api/Api';
import UserApi from '../../../api/UserApi';
import LeagueAdditionalInformation from './LeagueAdditionalInformation/LeagueAdditionalInformation';
import LeagueQuestionsList from './LeagueQuestionsList/LeagueQuestionsList';
import LeagueTitle from './LeagueTitle/LeagueTitle';
import UserAnsweredLeagueQuestions from './UserAnsweredLeagueQuestions/UserAnsweredLeagueQuestions';

import './LeagueDetails.css';
import LeagueAnswers from './LeagueAnswers/LeagueAnswers';
import LeagueUserDashboard from '../../LeagueAdmin/ViewLeague/LeagueUserDashboard/LeagueUserDashboard';
import LeagueStatus from '../../../helpers/enums/LeagueStatus';
import UserParticipationStatus from '../../../helpers/enums/UserParticipationStatus';

export default function LeagueDetails() {
  const params = useParams();
  const [progress, setProgress] = useState(false);
  const [leagueDetails, setleagueDetails] = useState();

  const availableLeagueStatus = [
    LeagueStatus.RegistrationOpen,
    LeagueStatus.Created,
    LeagueStatus.RegistrationClosed,
    LeagueStatus.InProgress,
    LeagueStatus.Expired,
  ];

  const defaultUserParticipationStatus = [
    UserParticipationStatus.Registered,
    UserParticipationStatus.QuestionsAnswered,
  ];

  const progressContainer = (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );

  const getLeagueDetails = async () => {
    try {
      const laegueRequest = UserApi.getLeagueById(params.leagueId);
      const leagueDetail = await Api.performRequest(laegueRequest);
      console.log(leagueDetail);
      setleagueDetails(leagueDetail?.data);
      setProgress(false);
    } catch (err) {
      console.log(err);
      setProgress(false);
    }
  };

  const getQuestionsContainer = () => {
    if (
      defaultUserParticipationStatus.includes(leagueDetails?.participationStatus?.userParticipationStatus) &&
      leagueDetails?.leagueStatus === LeagueStatus.RegistrationClosed
    ) {
      return <LeagueAnswers participationId={leagueDetails?.participationStatus?._id} />;
    }
    switch (leagueDetails?.participationStatus?.userParticipationStatus) {
      case UserParticipationStatus.QuestionsAnswered:
        return <UserAnsweredLeagueQuestions participationId={leagueDetails?.participationStatus?._id} />;
      case UserParticipationStatus.Registered:
        return (
          <LeagueQuestionsList
            participationId={leagueDetails?.participationStatus?._id}
            updateLeagueDetails={data => setleagueDetails(data)}
          />
        );
      default:
        console.log('coming here');
        return (
          <div
            className="d-flex justify-content-center align-items-center align-content-center"
            style={{ height: '330px' }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Questions not available
              </Typography>
            </Box>
          </div>
        );
    }
  };

  useEffect(() => {
    setProgress(true);
    getLeagueDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leagueContainer = (
    <div className="d-flex align-items-center align-content-center w-100 flex-column">
      <div className="d-flex flex-column w-100">
        <div className="d-flex">
          <img
            src={`data:image/png;base64,${leagueDetails?.image?.data}`}
            alt={leagueDetails?.name}
            className="league-image-style"
          ></img>
        </div>
      </div>
      <Grid container spacing={3} className="w-100" direction="column">
        <Grid item xs={12} md={12} lg={12} className="w-100 p-0">
          <Paper className="px-3 py-3 w-100">
            <LeagueTitle {...leagueDetails} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={12} className="w-100 p-0">
          <Grid container spacing={3} className="w-100 m-0" justifyContent="space-between" direction="row">
            <Grid item xs={12} md={6} lg={6}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className="px-3 py-3 w-100">
                    <Typography variant="h6" gutterBottom>
                      League Additional Information
                    </Typography>
                    <LeagueAdditionalInformation {...leagueDetails} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Paper elevation={'3'} className="p-3">
                    <LeagueUserDashboard />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className="px-3 py-3 w-100">
                {availableLeagueStatus.includes(leagueDetails?.leagueStatus) ? getQuestionsContainer() : null}
                {/* <LeagueQuestionsList /> */}
                {/* <UserAnsweredLeagueQuestions /> */}
                {/* <LeagueAnswers /> */}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

  return progress && !leagueDetails ? progressContainer : leagueContainer;
}
