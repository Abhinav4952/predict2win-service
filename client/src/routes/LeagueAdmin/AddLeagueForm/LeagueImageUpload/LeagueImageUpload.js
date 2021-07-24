import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import { useState } from 'react';

export default function LeagueImageUpload({
  handleNext,
  handleBack,
  handleChange,
  values: { leagueIcon },
  formErrors,
}) {
  const isValid = !formErrors.image;
  const [leagueImage, setLeagueImage] = useState([leagueIcon]);

  const setImage = files => {
    const name = 'leagueIcon';
    if (!files.length) {
      setLeagueImage([]);
      handleChange({ target: { name, value: [] } });
      return;
    }
    setLeagueImage(files);
    handleChange({ target: { name, value: files[0] } });
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
            initialFiles={leagueImage}
            showAlerts={false}
            filesLimit={1}
          />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', marginTop: 50, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="default" onClick={handleBack} style={{ marginRight: 10 }}>
          Back
        </Button>
        <Button
          variant="contained"
          disabled={!leagueImage?.length}
          color="primary"
          onClick={isValid ? handleNext : null}
        >
          Next
        </Button>
      </div>
    </>
  );
}
