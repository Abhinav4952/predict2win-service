import { Container } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import { useState } from 'react';
import Api from '../../../api/Api';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
    color: theme.palette.text.secondary,
  },
}));

export default function AddLeague({}) {
  const classes = useStyles();
  const [leagueImage, setLeagueImage] = useState();
  const [leagueSucess, setLeagueSucess] = useState();

  const setImage = files => {
    console.log(files);
    setLeagueImage(files);
  };

  const getAPIConfiguration = formData => {
    return {
      url: '/api/v1/leagueAdmin/addLeague',
      options: { method: 'POST' },
      payload: formData,
    };
  };
  const arrayBufferToBase64 = buffer => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const addLeague = async () => {
    const formData = new FormData();
    formData.append('image', leagueImage[0]);
    formData.append('name', 'Test League');
    formData.append('userId', '60e9d68f5fd2ad332c259e1e');
    formData.append('description', 'Test League de');
    formData.append('leagueCategory', 'CRICKET');
    formData.append('expiryDate', '2021-10-15T00:00:00.000Z');
    console.log('form data', formData.entries(), getAPIConfiguration(formData));
    const privateRequest = await Api.performRequest(getAPIConfiguration(formData));
    console.log(privateRequest, privateRequest?.data?.image?.data?.data);
    console.log(arrayBufferToBase64(privateRequest?.data?.image?.data?.data));
    setLeagueSucess(privateRequest?.data);
  };

  return (
    <Container>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <DropzoneArea
              acceptedFiles={['image/*', 'video/*', 'application/*']}
              onChange={e => setImage(e)}
              showFileNames
              dropzoneText="Upload league Image"
              showAlerts={false}
              filesLimit={1}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Button fullWidth variant="contained" color="primary" onClick={() => addLeague()}>
              Sign In
            </Button>
          </Paper>
        </Grid>
        {leagueSucess ? (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <img src={`data:image/png;base64,${arrayBufferToBase64(leagueSucess?.image?.data?.data)}`} />
            </Paper>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}
