import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import LeagueCategory from '../../../../helpers/enums/LeagueCategory';
export default function LeagueBasicDetails({
  handleNext,
  handleChange,
  values: { firstName, lastName, email, gender },
  formErrors,
}) {
  const isValid =
    firstName.length > 0 &&
    !formErrors.firstName &&
    lastName.length > 0 &&
    !formErrors.lastName &&
    email.length > 0 &&
    !formErrors.email &&
    gender.length > 0;

  const leagueCategory = {...LeagueCategory};
  const categories = Object.keys(leagueCategory).map((key) => [key, leagueCategory[key]]);

  return (
    <>
      <Grid container spacing={2} noValidate>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="League Name"
            name="firstName"
            placeholder="League Name"
            margin="normal"
            value={firstName || ''}
            onChange={handleChange}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required margin="normal">
            <InputLabel>League Category</InputLabel>
            <Select value={gender} onChange={handleChange} name="gender">
              {categories.map(ele => (<MenuItem value={ele[1]} key={ele[1]}>{ele[0]}</MenuItem>))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Time"
            name="email"
            type="datetime-local"
            value={email || ''}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Time"
            name="email"
            type="datetime-local"
            value={email || ''}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
        <TextField
            fullWidth
            label="League Description"
            name="email"
            multiline
            rows={3}
            value={email || ''}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', marginTop: 50, justifyContent: 'flex-end' }}>
        <Button variant="contained" disabled={!isValid} color="primary" onClick={isValid ? handleNext : null}>
          Next
        </Button>
      </div>
    </>
  );
}
