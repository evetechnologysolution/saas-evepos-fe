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

ConfirmCancel.propTypes = {
    open: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleClose: PropTypes.func,
    handleClick: PropTypes.func,
};

export default function ConfirmCancel({ open, isLoading, handleClose, handleClick }) {

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ padding: "24px 24px 16px" }}>Cancel</DialogTitle>
            <DialogContent sx={{ padding: "0px 24px" }}>
                <DialogContentText>
                    Are you sure want to cancel order?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton variant="contained" loading={isLoading} onClick={() => handleClick()}>Yes</LoadingButton>
                <Button variant="outlined" onClick={() => handleClose()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
