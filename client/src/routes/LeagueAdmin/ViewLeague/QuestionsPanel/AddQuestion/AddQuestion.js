import { Button, Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';

export default function AddQuestion({onCancel}) {
  return (
    <Paper elevation={1} className="p-3">
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            label="League Name"
            name="leagueName"
            placeholder="League Name"
            margin="normal"
            required
            className="w-100"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="League Name"
                name="leagueName"
                placeholder="League Name"
                margin="normal"
                required
                className="w-100"
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="League Name"
                name="leagueName"
                placeholder="League Name"
                margin="normal"
                required
                className="w-100"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="League Name"
                name="leagueName"
                placeholder="League Name"
                margin="normal"
                required
                className="w-100"
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="League Name"
                name="leagueName"
                placeholder="League Name"
                margin="normal"
                required
                className="w-100"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={() => onCancel()} className="mx-3">
              Cancel
            </Button>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
