import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  box: {
    padding: theme.spacing(3),
  },
  title: {
    marginTop: 30,
  },
}));

export default function LeagueAddSucess({}) {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => history.replace('/'), 3000);
  }, []);
  return (
    <Box className={classes.box}>
      <Typography variant="h2" align="center">
        Thank you!
      </Typography>
      <Typography component="p" align="center" className={classes.title}>
        You will get an email with further instructions
      </Typography>
    </Box>
  );
}
