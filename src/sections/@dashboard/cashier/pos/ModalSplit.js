import React, { useState } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Button,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    // TextField,
    // MenuItem,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack
} from '@mui/material';
// components
import ModalSplitProduct from './ModalSplitProduct';
import ModalSplitTotal from './ModalSplitTotal';

// ----------------------------------------------------------------------

ModalSplit.propTypes = {
    open: PropTypes.bool,
    roomId: PropTypes.string,
    tableId: PropTypes.string,
    onClose: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ModalSplit(props) {

    // const [alert, setAlert] = useState(false);

    const splitOptions = ['by Product', 'by Amount'];
    const [selected, setSelected] = useState('');

    const [openSplitProduct, setOpenSplitProduct] = useState(false);
    const [openSplitTotal, setOpenSplitTotal] = useState(false);

    const handleSelected = (e) => {
        setSelected(e.target.value);
    }

    const handleCancel = () => {
        props.onClose();
        setTimeout(() => {
            setSelected("");
            // setAlert(false);
        }, 1000);
    }

    const handleSubmit = () => {
        if (selected !== '') {
            handleCancel();
            setTimeout(() => {
                if (selected === 'by Product') {
                    setOpenSplitProduct(true);
                } else {
                    setOpenSplitTotal(true);
                }
            }, 100);

        }
        // else {
        //     setAlert(true);
        // }
    }

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="xs"
                open={props.open}
            >
                <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc" }}>
                    Split Bill
                </DialogTitle>
                <DialogContent dividers>
                    {/* <TextField
                        name="splitOption"
                        label="Select option"
                        select
                        fullWidth
                        value={selected}
                        onChange={handleSelected}
                        error={alert ? Boolean(true) : Boolean(false)}
                        helperText={alert ? 'Option is required' : ''}
                    >
                        {splitOptions.map((option, i) => (
                            <MenuItem
                                key={i}
                                value={option}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <Stack alignItems="center" mt={2}>
                        <FormControl>
                            <FormLabel id="radio-button">Option</FormLabel>
                            <RadioGroup
                                aria-labelledby="radio-button"
                                name="split-option"
                                value={selected}
                                onChange={handleSelected}
                            >
                                {splitOptions.map((option, i) => (
                                    <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="outlined" onClick={() => handleCancel()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={selected !== '' ? Boolean(false) : Boolean(true)}
                        onClick={() => handleSubmit()}
                    >
                        Split
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            <ModalSplitProduct
                open={openSplitProduct}
                onClose={() => setOpenSplitProduct(false)}
                roomId={props.roomId}
                tableId={props.tableId}
            />

            <ModalSplitTotal
                open={openSplitTotal}
                onClose={() => setOpenSplitTotal(false)}
                roomId={props.roomId}
                tableId={props.tableId}
            />
        </>
    );
}
