import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from 'react-query';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

GenerateCardID.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function GenerateCardID({ open, onClose }) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const client = useQueryClient();

  const handleGenerateCardId = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`/member-card/generate/${amount}`);
      client.invalidateQueries('memberCards');
      onClose();
    } catch (error) {
      console.warn('An error occurred while generating card ID: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <form id="generateCardId" onSubmit={handleGenerateCardId}>
        <DialogTitle sx={{ padding: '24px 24px 16px' }}>Generate Card ID</DialogTitle>
        <DialogContent sx={{ padding: '0px 24px' }}>
          <DialogContentText>{`Masukkan jumlah yang ingin dibuat (maks 15)`}</DialogContentText>
          <TextField
            type="number"
            placeholder="Jumlah"
            fullWidth
            margin="normal"
            InputProps={{
              inputProps: { min: 1, max: 15 },
            }}
            value={amount || ""}
            required
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton variant="contained" type="submit" loading={loading}>
            Generate
          </LoadingButton>
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
