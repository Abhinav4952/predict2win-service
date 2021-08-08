import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function LeagueAdminBasicDetails({
    handleNext,
    handleChange,
    values: { firstName, lastName, username, email },
    formErrors,
}){
    const isValid =
    firstName?.length > 0 &&
    !formErrors?.firstName &&
    lastName?.length > 0 &&
    !formErrors?.username &&
    email?.length > 0 &&
    !formErrors?.email;

    return (
        <>
          <Grid container spacing={2} noValidate>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                placeholder="First Name"
                margin="normal"
                value={firstName || ''}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                placeholder="Last Name"
                margin="normal"
                value={lastName || ''}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="UserName"
                name="username"
                value={username || ''}
                onChange={handleChange}
                margin="normal"
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
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