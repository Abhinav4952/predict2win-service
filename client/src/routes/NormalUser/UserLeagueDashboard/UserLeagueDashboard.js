import { useEffect, useState } from 'react';
import { Grid, LinearProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Api from '../../../api/Api';
import UserApi from '../../../api/UserApi';
import IndividualLeagueDetails from './IndividualLeagueDetails/IndividualLeagueDetails';

const useStyles = makeStyles({
  gridContainer: {
    padding: '40px',
    width: '100%',
  },
});

export default function UserLeagueDashboard() {
  const [progress, setProgress] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const classes = useStyles();

  const getLeagues = async () => {
    try {
      const leagueDetails = await Api.performRequest(UserApi.getAllLeagues());
      setLeagues(leagueDetails?.data || []);
      setTimeout(() => setProgress(false), 500);
    } catch (err) {
      console.log(err);
      setLeagues([]);
      setTimeout(() => setProgress(false), 500);
    }
  };

  const getLeagueContainer = leagueDetails => {
    return leagueDetails.map(ele => (
      <Grid item xs={12} sm={6} md={4} style={{ maxWidth: '420px' }} key={ele?._id}>
        <IndividualLeagueDetails {...ele} updateLeagues={data => setLeagues(data)} />
      </Grid>
    ));
  };

  const emptyLeagues = (
    <div>
      <Grid container spacing={0} align="center" justify="center" direction="column">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            No Leagues Created by User
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  const getCurrentLeaguesData = () => {
    if (!leagues?.length) {
      return emptyLeagues;
    }
    return (
      <Grid container direction="row" spacing={5} className={classes.gridContainer}>
        {getLeagueContainer(leagues)}
      </Grid>
    );
  };

  const progressContainer = (
    <div>
      <Grid container spacing={0} align="center" justifyContent="center" direction="column">
        <Grid item>
          <LinearProgress />
        </Grid>
      </Grid>
    </div>
  );

  useEffect(() => {
    getLeagues();
  }, []);

  return progress ? progressContainer : getCurrentLeaguesData();
}
