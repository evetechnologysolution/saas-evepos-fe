import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

ConfirmDelete.propTypes = {
    open: PropTypes.bool,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
};

export default function ConfirmDelete({ open, isLoading, onClose, onDelete }) {

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ padding: "24px 24px 16px" }}>Delete</DialogTitle>
            <DialogContent sx={{ padding: "0px 24px" }}>
                <DialogContentText>
                    Are you sure want to delete data?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton variant="contained" loading={isLoading} onClick={() => onDelete()}>Yes</LoadingButton>
                <Button variant="outlined" onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
