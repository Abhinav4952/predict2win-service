import { Box, Grid, Container, Paper } from '@material-ui/core';
import LeagueBaseForm from '../AddLeagueForm/LeagueBaseForm/LeagueBaseForm';
import LeagueTiles from './LeagueTiles/LeagueTiles';
import LeagueUserDashboard from './LeagueUserDashboard/LeagueUserDashboard';

export default function ViewLeague({}) {
  return (
    <Paper style={{background: '#FFFFF'}}>
      <Container maxWidth="xl" className="p-3">
        <Grid container spacing={3}>
          <LeagueTiles />
          <Grid item xs={12} md={6} lg={6}>
            <Box>
                Testst
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper elevation={"3"}>
                <LeagueBaseForm />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper elevation={"3"} className="p-3">
                <LeagueUserDashboard />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
