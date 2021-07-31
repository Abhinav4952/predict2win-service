import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { useState } from "react";

export default function SlotInput({ open, handleClose, handleSubmit }) {

  const [slots, setSlots] = useState(0);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill number slots applicable for this league.
        </DialogContentText>
        <TextField
            fullWidth
            label="Correct Answer Value"
            name="correctValue"
            type="number"
            placeholder="Correct Answer Value"
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
