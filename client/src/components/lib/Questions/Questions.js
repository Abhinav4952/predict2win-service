import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  Radio,
  RadioGroup,
} from '@material-ui/core';
export default function Questions({ questions, handleChange }) {
  return questions.map(ele => (
    <Grid item xs={12} md={12} lg={12}>
      <FormControl component="fieldset">
        <Paper elevation={2} className="p-3">
          <Grid container spacing={2} direction="column">
            <Grid item xs={12} md={12} lg={12}>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  {ele.question}
                </Typography>
              </FormLabel>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <RadioGroup aria-label="quiz" name={ele.id} onChange={handleChange}>
                {ele.options.map(option => (
                  <Grid container spacing={2} justifyContent="space-between">
                    {option.map(o => (
                      <Grid item xs={6} md={6} lg={6}>
                        <FormControlLabel value={o} control={<Radio />} label={o} />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>
      </FormControl>
    </Grid>
  ));
}
