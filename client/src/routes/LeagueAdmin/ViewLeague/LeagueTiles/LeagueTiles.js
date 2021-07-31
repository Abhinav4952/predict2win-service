import { Grid } from '@material-ui/core';
import SlotsFilled from './SlotsFilled/SlotsFilled';

export default function LeagueTiles({}) {
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SlotsFilled />
      </Grid>
    </>
  );
}
