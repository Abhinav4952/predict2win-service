import { Button, Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { useState } from 'react';

export default function AddQuestion({ onCancel, onSubmit }) {
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState({});
  const [correctValue, setCorrectValue] = useState({});

  const handleOptions = e => {
    const { name, value } = e.target;

    // Set values
    setOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Paper elevation={1} className="p-3">
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            label="Question"
            name="leagueQuestion"
            placeholder="League Name"
            onChange={e => setQuestion(e.target.value)}
            margin="normal"
            required
            multiline
            rows={2}
            className="w-100"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="Option 1"
                name="option-1"
                placeholder="Option 1"
                margin="normal"
                onChange={handleOptions}
                required
                className="w-100"
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="Option 2"
                name="option-2"
                placeholder="Option 2"
                margin="normal"
                onChange={handleOptions}
                required
                className="w-100"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="Option 3"
                name="option-3"
                placeholder="Option 3"
                margin="normal"
                required
                onChange={handleOptions}
                className="w-100"
              />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <TextField
                fullWidth
                label="Option 4"
                name="option-4"
                placeholder="Option 4"
                margin="normal"
                onChange={handleOptions}
                required
                className="w-100"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            fullWidth
            label="Correct Answer Value"
            name="correctValue"
            type="number"
            placeholder="Correct Answer Value"
            onChange={e => setCorrectValue(e.target.value)}
            margin="normal"
            required
            className="w-25"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={() => onCancel()} className="mx-3">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() => onSubmit({ question, options, correctValue })}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
