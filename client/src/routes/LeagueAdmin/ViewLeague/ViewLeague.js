import { Box, Grid, Container, Paper, LinearProgress, CircularProgress } from '@material-ui/core';
import LeagueTiles from './LeagueTiles/LeagueTiles';
import LeagueUserDashboard from './LeagueUserDashboard/LeagueUserDashboard';
import QuestionsPanel from './QuestionsPanel/QuestionsPanel';

export default function ViewLeague({}) {
  return (
    <Paper style={{ background: '#FFFFF' }}>
      <Container maxWidth="xl" className="p-3">
        <Grid container spacing={3}>
          <LeagueTiles />
          <Grid item xs={12} md={12} lg={6}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} sm={12} md={12}>
                <div style={{height: "230px"}} className="d-flex justify-content-center align-items-center align-content-center">
                  <Box>
                    <CircularProgress />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Paper elevation={'3'} className="p-3">
                  <LeagueUserDashboard />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Paper elevation={'3'} className="p-3">
              <QuestionsPanel />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
