import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginScreen.css';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import GoogleLogin from 'react-google-login';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://enigmatic-temple-25922.herokuapp.com/">
        Predict2Win
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const classes = useStyles();
  const vertical = 'bottom';
  const horizontal = 'center';

  const handleClose = () => setError('');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/');
    }
    console.log('process.env', process.env);
  }, [history]);

  const loginHandler = async e => {
    e.preventDefault();

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = await axios.post('/api/v1/auth/login', { email, password }, config);

      localStorage.setItem('authToken', data.token);

      history.push('/');
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const responseGoogle = async response => {
    try {
      const config = {
        header: {
          'Content-Type': 'application/json',
        },
      };
      const userDetails = response?.profileObj;
      if (!userDetails) {
        setError('Error while logging in');
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }
      const userRequest = {
        email: userDetails?.email,
        username: userDetails?.name,
        firstName: userDetails?.familyName,
        lastName: userDetails?.givenName,
        password: userDetails?.googleId,
      };
      const { data } = await axios.post('/api/v1/auth/socialLogin', userRequest, config);

      localStorage.setItem('authToken', data.token);

      history.push('/');
    } catch (err) {
      console.log(err);
      setError('Error while logging in');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const errorResponseGoogle = async response => {
    try {
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={loginHandler} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            error={!!error}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            error={!!error}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            autoComplete="current-password"
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword" className="login-screen__forgotpassword">
                Forgot Password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
          <Grid container direction="column">
            <Grid item xs={12} md={12} lg={12} className="my-3">
              <GoogleLogin
                clientId="498194458961-hgose7sid1tu6aamdkp7on8l99i97ppi.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={errorResponseGoogle}
                className="w-100"
              ></GoogleLogin>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={!!error}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={3000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginScreen;
