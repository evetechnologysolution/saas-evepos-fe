import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import {
    Alert,
    styled,
    IconButton,
    Button,
    Box,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormGroup,
    FormControlLabel,
    Grid,
    InputAdornment,
    TextField,
    Typography,
    Link
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import ConfirmCloseCashier from './ConfirmCloseCashier';
import CashCashierPrint from './CashCashierPrint';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';
// context
import { mainContext } from '../../../contexts/MainContext';

// ----------------------------------------------------------------------

ModalCloseCashier.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleCloseCashier: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify icon="eva:close-fill" width={24} height={24} />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function ModalCloseCashier({ open, handleClose, handleCloseCashier }) {

    const ctx = useContext(mainContext);

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const [amount, setAmount] = useState(0);
    const [amountDisplay, setAmountDisplay] = useState('');
    const [cashData, setCashData] = useState(ctx.existCash);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isError, setIsError] = useState(false);
    const [orders, setOrders] = useState([]);

    const errorMessage = () => {
        if (isError) return "Amount exceeds total cash";
        return "";
    };

    let eWallet = 0;
    let card = 0;
    if (ctx.existCash?.detail) {
        eWallet = ctx.existCash?.detail?.dana + ctx.existCash?.detail?.ovo + ctx.existCash?.detail?.shopeePay + ctx.existCash?.detail?.qris;
        card = ctx.existCash?.detail?.bri + ctx.existCash?.detail?.bni + ctx.existCash?.detail?.bca + ctx.existCash?.detail?.mandiri;
    }

    useEffect(() => {
        if (showAlert) {
            const content = document.getElementById('alert-content');
            if (content) {
                setTimeout(() => {
                    content.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    }, [loading]);


    const handleChecked = (e) => {
        setIsError(false);
        setChecked(e.target.checked);
        if (e.target.checked) {
            setAmount(ctx.existCash?.total);
            setAmountDisplay(ctx.existCash?.total);
        } else {
            setAmount(0);
            setAmountDisplay('');
        }
    };

    const handleClick = () => {
        if (!isError) {
            setOpenConfirm(true);
        }
    };

    // Print
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Panggil API untuk menutup kasir dan mendapatkan data pesanan yang ditutup
            const currDate = new Date();
            const getOrder = await axios.get(`/orders/close-cashier?start=${ctx.existCash?.startDate}&end=${currDate}`);
            if (getOrder.status === 200) {
                setOrders(getOrder.data.docs);
            }

            // Periksa pesanan yang belum selesai
            const checkUnfinishedResponse = await axios.get(`/orders/unfinished`);
            if (checkUnfinishedResponse.data !== null) {
                setShowAlert(true);
                setLoading(false);
                setOpenConfirm(false);
                return; // Keluar dari fungsi jika ada pesanan yang belum selesai
            }

            // Jika tidak ada pesanan yang belum selesai, lanjutkan dengan menutup kasir
            let objData = {};
            if (amount > 0) {
                objData = {
                    ...objData,
                    cashOut: amount
                };
                ctx.existCash.cashOut += amount;
                ctx.existCash.history.push({ date: currDate, title: 'Tutup Kas', isCashOut: true, amount });
            }
            await setCashData(ctx.existCash);
            await ctx.closeCash(objData);
            handleCloseCashier();
            enqueueSnackbar('Close cashier success!');
            setTimeout(() => {
                handlePrint();
            }, 100);
            setShowAlert(false);
            setLoading(false);
            setOpenConfirm(false);
            setAmount(0);
            setAmountDisplay('');
            setChecked(false);
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('An error occurred while closing the cashier.', { variant: 'error' });
            setLoading(false);
            setOpenConfirm(false);
        }
    };


    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                maxWidth="sm"
                fullWidth
                open={open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={() => {
                        handleClose();
                        setTimeout(() => {
                            setAmount(0);
                            setAmountDisplay('');
                            setChecked(false);
                            setShowAlert(false);
                        }, 100);
                    }}
                    style={{ borderBottom: '1px solid #ccc' }}
                >
                    Close Cashier
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3} mb={3}>
                        {showAlert && (
                            <Grid item xs={12} id="alert-content">
                                <Alert severity="error">
                                    <span>Anda memiliki transaksi yang belum selesai. Silakan cek module</span>
                                    <Link
                                        sx={{ ml: 0.5, cursor: "pointer" }}
                                        variant="subtitle2"
                                        underline="hover"
                                        onClick={() => navigate(PATH_DASHBOARD.cashier.orders)}
                                    >
                                        Orders
                                    </Link>
                                </Alert>
                            </Grid>
                        )}
                        <Grid item xs={6}>
                            {/* <Box p={2} borderRadius="8px" bgcolor="#E18876" color="white"> */}
                            <Box p={2} borderRadius="8px" bgcolor="#6465A5" color="white">
                                <Typography variant="body1">
                                    Cash In
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(ctx.existCash?.cashIn || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box p={2} borderRadius="8px" bgcolor="#F05837" color="white">
                                <Typography variant="body1">
                                    Cash Out
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(ctx.existCash?.cashOut || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Box p={2} borderRadius="8px" bgcolor="#673AB7" color="white"> */}
                            <Box p={2} borderRadius="8px" bgcolor="#F28A30" color="white">
                                <Typography variant="body1">
                                    Cash
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(ctx.existCash?.detail?.cash || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Box p={2} borderRadius="8px" bgcolor="#F28A30" color="white"> */}
                            <Box p={2} borderRadius="8px" bgcolor="#673AB7" color="white">
                                <Typography variant="body1">
                                    E-Wallet
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(eWallet)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box p={2} borderRadius="8px" bgcolor="#9C27B0" color="white">
                                <Typography variant="body1">
                                    Card
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(card)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box p={2} borderRadius="8px" bgcolor="#009688" color="white">
                                <Typography variant="body1">
                                    Total
                                </Typography>
                                <Typography variant="h6" align="center">
                                    Rp {numberWithCommas(ctx.existCash?.total || 0)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            {/* <Box p={2} borderRadius="8px" bgcolor="#00BCD4" color="white"> */}
                            <Box p={2} borderRadius="8px" bgcolor="#776B04" color="white">
                                <Typography variant="body1">
                                    Start Date
                                </Typography>
                                <Typography variant="h6" align="center">
                                    {formatDate2(ctx.existCash?.startDate)}
                                </Typography>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={6}>
                            <Box p={2} borderRadius="8px" bgcolor="#00BCD4" color="white">
                                <Typography variant="body1">
                                    End Date
                                </Typography>
                                <Typography variant="h6" align="center">
                                    -
                                </Typography>
                            </Box>
                        </Grid> */}
                    </Grid>
                    <Typography variant="subtitle2">
                        Input nominal untuk menarik uang kas
                    </Typography>
                    <FormGroup sx={{ mb: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChecked}
                                />
                            }
                            label="Tarik Semua" />
                    </FormGroup>
                    <NumericFormat
                        customInput={TextField}
                        fullWidth
                        id="amount"
                        name="amount"
                        label="Amount"
                        autoComplete="off"
                        decimalScale={2}
                        decimalSeparator="."
                        thousandSeparator=","
                        allowNegative={false}
                        error={isError ? Boolean(true) : Boolean(false)}
                        helperText={errorMessage()}
                        disabled={checked ? Boolean(true) : Boolean(false)}
                        value={amountDisplay}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                        }}
                        onValueChange={(values) => {
                            if (values.value > ctx.existCash?.total) {
                                setIsError(true);
                            } else {
                                setIsError(false);
                            }
                            setAmount(values.value)
                            setAmountDisplay(values.formattedValue)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size="large" fullWidth onClick={() => handleClick()}>Close Cashier</Button>
                </DialogActions>
            </BootstrapDialog>

            <ConfirmCloseCashier
                open={openConfirm}
                handleClose={() => setOpenConfirm(false)}
                handleClick={handleSubmit}
                isLoading={loading}
            />

            {cashData && (
                <div style={{ overflow: "hidden", height: 0, width: 0 }}>
                    <CashCashierPrint ref={printRef} content={cashData} items={orders} />
                </div>
            )}
        </>
    );
}
