import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LeagueBaseForm from './LeagueBaseForm/LeagueBaseForm';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    paddingRight: 10,
    paddingLeft: 10,
  },
  svg: {
    verticalAlign: 'middle',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      padding: theme.spacing(3),
    },
  },
}));

export default function AddLeagueForm({}) {
  const classes = useStyles();
  return (
    <div className="App">
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <LeagueBaseForm />
        </Paper>
        <Divider style={{ marginTop: 100 }} />
      </main>
    </div>
  );
}
