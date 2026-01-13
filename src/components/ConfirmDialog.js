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

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    title: PropTypes.string,
    text: PropTypes.string,
};

export default function ConfirmDialog({ open, isLoading, onClose, onClick, title = 'Confirm', text = 'Are you sure?' }) {

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ padding: "24px 24px 16px" }}>{title}</DialogTitle>
            <DialogContent sx={{ padding: "0px 24px" }}>
                <DialogContentText>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton variant="contained" loading={isLoading} onClick={() => onClick()}>Yes</LoadingButton>
                <Button variant="outlined" onClick={() => onClose()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
