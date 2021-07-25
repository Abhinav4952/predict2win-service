import jwt from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Grid, LinearProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Api from '../../../api/Api';
import LeagueDetails from './LeagueDetails/LeagueDetails';

const useStyles = makeStyles({
  gridContainer: {
    padding: '40px',
  },
});

export default function LeagueAdminHome({}) {
  const [progress, setProgress] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const classes = useStyles();

  const getAPIConfiguration = () => {
    return {
      url: '/api/v1/leagueAdmin/getLeagues',
    };
  };

  const getCurrentUserLeague = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLeagues([]);
        return;
      }
      const user = jwt(token);
      console.log('fecthed user', user);
      const leagueDetails = await Api.performRequest(getAPIConfiguration());
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
        <LeagueDetails {...ele} />
      </Grid>
    ));
  };

  const getCurrentLeagueData = () => {
    if (!leagues?.length) {
      return emptyLeagues;
    }
    return (
      <Grid container direction="row" spacing={5} className={classes.gridContainer}>
        {getLeagueContainer(leagues)}
      </Grid>
    );
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
    getCurrentUserLeague();
  }, []);
  return progress ? progressContainer : getCurrentLeagueData();
}
