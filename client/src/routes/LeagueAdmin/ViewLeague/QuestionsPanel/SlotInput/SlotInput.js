import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useState } from 'react';

export default function SlotInput({ open, handleClose, handleSubmit }) {
  const [slots, setSlots] = useState(0);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">League Slots</DialogTitle>
      <DialogContent>
        <DialogContentText>Fill number of slots open for this league.</DialogContentText>
        <TextField
          fullWidth
          label="Slots"
          name="slots"
          type="number"
          placeholder="Slots"
          onChange={e => setSlots(e.target.value)}
          margin="normal"
          required
          className="w-100"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleSubmit(slots)} color="primary" disabled={!slots}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
