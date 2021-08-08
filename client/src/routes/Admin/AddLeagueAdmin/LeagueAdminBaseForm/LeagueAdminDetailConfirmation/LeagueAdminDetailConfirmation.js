import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { LinearProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useState } from 'react';
import AdminApi from '../../../../../api/AdminApi';
import Api from '../../../../../api/Api';

export default function LeagueAdminDetailConfirmation({
  handleNext,
  handleBack,
  values: { firstName, lastName, username, email },
}) {
  const [error, setError] = useState();
  const [progress, setProgress] = useState(false);
  const vertical = 'bottom';
  const horizontal = 'center';

  const handleSubmit = async () => {
    try {
      setProgress(true);
      const addLeagueAdminRequest = AdminApi.addLeagueAdmin({ firstName, lastName, username, email });
      const addLeagueAdminResponse = await Api.performRequest(addLeagueAdminRequest);
      console.log(addLeagueAdminResponse);
      setProgress(false);
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

  return (
    <>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="First Name" secondary={firstName || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Last Name" secondary={lastName || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="User Name" secondary={username || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="Email" secondary={email || '-'} />
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
