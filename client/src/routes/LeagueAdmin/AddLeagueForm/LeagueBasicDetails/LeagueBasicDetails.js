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
  values: { leagueName, leagueCategory, endTime, leagueDescription },
  formErrors,
}) {
  const isValid =
    leagueName?.length > 0 &&
    !formErrors?.leagueName &&
    leagueCategory?.length > 0 &&
    !formErrors?.leagueCategory &&
    endTime?.length > 0 &&
    !formErrors?.email;

  const leagueCategories = { ...LeagueCategory };
  const categories = Object.keys(leagueCategories).map(key => [key, leagueCategories[key]]);

  return (
    <>
      <Grid container spacing={2} noValidate>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="League Name"
            name="leagueName"
            placeholder="League Name"
            margin="normal"
            value={leagueName || ''}
            onChange={handleChange}
            error={!!formErrors.leagueName}
            helperText={formErrors.leagueName}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required margin="normal">
            <InputLabel>League Category</InputLabel>
            <Select value={leagueCategory} onChange={handleChange} name="leagueCategory">
              {categories.map(ele => (
                <MenuItem value={ele[1]} key={ele[1]}>
                  {ele[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Time"
            name="endTime"
            type="datetime-local"
            value={endTime || ''}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.endTime}
            helperText={formErrors.endTime}
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
            name="leagueDescription"
            multiline
            rows={3}
            value={leagueDescription || ''}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.leagueDescription}
            helperText={formErrors.leagueDescription}
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
