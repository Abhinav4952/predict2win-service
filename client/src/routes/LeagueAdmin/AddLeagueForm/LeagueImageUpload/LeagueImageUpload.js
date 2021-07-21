import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import { useState } from 'react';

export default function LeagueImageUpload({
  handleNext,
  handleBack,
  handleChange,
  values: { city, date, phone },
  formErrors,
}) {
  const isValid = city.length > 0 && !formErrors.city && date.length > 0 && phone.length > 0 && !formErrors.phone;
  const [leagueImage, setLeagueImage] = useState();

  const setImage = files => {
    console.log(files);
    setLeagueImage(files);
  };


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DropzoneArea
              acceptedFiles={['image/*', 'video/*', 'application/*']}
              onChange={e => setImage(e)}
              showFileNames
              dropzoneText="Upload league Image"
              showAlerts={false}
              filesLimit={1}
            />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', marginTop: 50, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="default" onClick={handleBack} style={{ marginRight: 10 }}>
          Back
        </Button>
        <Button variant="contained" disabled={!isValid} color="primary" onClick={isValid ? handleNext : null}>
          Next
        </Button>
      </div>
    </>
  );
}
