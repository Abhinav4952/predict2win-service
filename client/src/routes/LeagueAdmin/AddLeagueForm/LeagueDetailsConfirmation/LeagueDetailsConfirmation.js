import jwt from 'jwt-decode';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { LinearProgress, ListItemIcon, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import './LeagueDetailsConfirmation.css';
import { useEffect, useState } from 'react';
import Api from '../../../../api/Api';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';

export default function LeagueDetailsConfirmation({
  handleNext,
  handleBack,
  values: { leagueName, leagueCategory, endTime, leagueDescription, leagueIcon },
}) {
  const [user, setUser] = useState('');
  const [error, setError] = useState();
  const [progress, setProgress] = useState(false);
  const vertical = 'bottom';
  const horizontal = 'center';

  const getLoggedInUserRoute = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    const user = jwt(token);
    setUser(user);
  };

  const handleSubmit = async () => {
    try {
      setProgress(true);
      const formData = new FormData();
      formData.append('image', leagueIcon);
      formData.append('name', leagueName);
      formData.append('userId', user?.id);
      formData.append('description', leagueDescription);
      formData.append('leagueCategory', leagueCategory);
      formData.append('expiryDate', new Date(endTime).toISOString());
      const privateRequest = await Api.performRequest(LeagueAdminApi.addLeague(formData));
      console.log(privateRequest);
      handleNext();
    } catch (err) {
      setProgress(false);
      console.log(JSON.stringify(err));
      setError(err?.data?.error || 'unable to create a league');
      setTimeout(() => setError(''), 3000);
    }
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    getLoggedInUserRoute();
  }, []);

  return (
    <>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="League Name" secondary={leagueName || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="League Category" secondary={leagueCategory || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="End Time" secondary={endTime || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="League Description" secondary={leagueDescription || '-'} />
        </ListItem>

        <Divider />

        <ListItem className="d-flex flex-column justify-content-start align-items-start">
          <ListItemText primary="League Icon" />
          <ListItemIcon>
            <div>
              <img src={URL.createObjectURL(leagueIcon)} alt={leagueName} className="league-icon-upload"></img>
            </div>
          </ListItemIcon>
        </ListItem>

        <Divider />

        {progress ? <LinearProgress /> : null}
      </List>

      <div style={{ display: 'flex', marginTop: 50, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="default" onClick={handleBack}>
          Back
        </Button>
        <Button
          style={{ marginLeft: 20 }}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={progress}
        >
          Confirm & Continue
        </Button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={!!error}
        key={vertical + horizontal}
        autoHideDuration={3000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
}
