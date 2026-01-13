import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function EditCategory({ open, onClose, onEdit, selectedCategory, category, setCategory }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(selectedCategory);
  }, [selectedCategory]);

  const handleEdit = () => {
    if (!text.trim()) return;

    const duplicateCount = category.filter((val) => val.startsWith(text) && val !== selectedCategory).length;

    const updatedText = duplicateCount > 0 ? `${text}${duplicateCount + 1}` : text;

    setCategory((prev) => prev.map((item) => (item === selectedCategory ? updatedText : item)));

    setText('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ padding: '24px 24px 16px' }}>Edit Category</DialogTitle>
      <DialogContent sx={{ padding: '0px 24px' }}>
        <TextField
          label="Nama"
          value={text}
          onChange={(event) => setText(event.target.value)}
          sx={{ marginY: 2, width: '100%' }}
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" variant="contained" onClick={() => handleEdit()}>
          Update
        </Button>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
