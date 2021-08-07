import { Grid, Typography } from '@material-ui/core';

export default function LeagueTitle({ name, description }) {
  return (
    <Grid container spacing={3} className="w-100" direction="column">
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="h4" className="p-2" gutterBottom>
          {name}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="body1" className="p-2" gutterBottom>
          {description}
        </Typography>
      </Grid>
    </Grid>
  );
}
