import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// react-to-print
import { useReactToPrint } from "react-to-print";
// @mui
import {
    Alert,
    Container,
    Button,
    Grid,
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    FormControl,
    TextField,
    Stack,
    Switch,
    InputAdornment,
    FormControlLabel,
    MenuItem
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme, alpha } from "@mui/material/styles";
// uuid
import { v4 as uuid } from "uuid";
// numeric format
import { NumericFormat } from "react-number-format";
// hooks
import useAuth from "../../../../hooks/useAuth";
// components
import Iconify from "../../../../components/Iconify";
import { bankOptions } from "../../../../_mock/paymentOptions";
// context
import { cashierContext } from "../../../../contexts/CashierContext";
// utils
import axiosInstance from "../../../../utils/axios";
import { numberWithCommas, cardNumberFormat, resetCardNumberFormat, combinedDateTime, formatDate2 } from "../../../../utils/getData";
import { generateRandomId } from "../../../../utils/generateRandom";
import PaymentType from "./PaymentType";
import PaymentItem from "./PaymentItem";
import PrintReceipt from "./PrintReceipt";

// ----------------------------------------------------------------------

ModalPayment.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    afterSplit: PropTypes.array,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
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
                        position: "absolute",
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

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    width: 60,
    "& .MuiSwitch-track": {
        borderRadius: 22 / 2,
        "&:before, &:after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            fontSize: 11,
            fontWeight: 700,
            color: "#FFFFFF"
        },
        "&:before": {
            content: '"Rp"',
            left: 12,
        },
        "&:after": {
            content: '"%"',
            right: 8,
        },
        backgroundColor: theme.palette.primary.light,
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "none",
        width: 16,
        height: 16,
        margin: 2,
        backgroundColor: "#FFFFFF",
    },
}));


export default function ModalPayment(props) {
    const theme = useTheme();

    const { enqueueSnackbar } = useSnackbar();

    const ctx = useContext(cashierContext);

    const { user } = useAuth();

    const [currUid, setCurrUid] = useState("");
    const [isPrint, setIsPrint] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPercent, setIsPercent] = useState(true);
    const [active, setActive] = useState("");
    const [paymentType, setPaymentType] = useState("Cash");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardBankName, setCardBankName] = useState("");
    const [cardAccountName, setCardAccountName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);
    const [discountOrigin, setDiscountOrigin] = useState(0);
    const [discountPriceOrigin, setDiscountPriceOrigin] = useState(0);
    const [deliveryPriceOrigin, setDeliveryPriceOrigin] = useState(0);
    const [discount, setDiscount] = useState(ctx.discount);
    const [discountPrice, setDiscountPrice] = useState(ctx.discountPrice);
    const [deliveryPrice, setDeliveryPrice] = useState(ctx.deliveryPrice);
    const [donation, setDonation] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [fromOutlet, setFromOutlet] = useState(false); // jika voucher diinput di outlet
    const [isCameraOpen, setIsCameraOpen] = useState(false); // State untuk menampilkan kamera
    const [intervalId, setIntervalId] = useState(null);
    const webcamRef = useRef(null);
    const codeReaderRef = useRef(null);
    const inputRef = useRef(null);

    const [showAlert, setShowAlert] = useState(false);

    const amount = ctx.splitAmount > 0 ? ctx.splitAmount : ctx.totalPrice;

    const [payDate, setPayDate] = useState(new Date());

    useEffect(() => {
        if (props.open) {
            setDiscountOrigin(ctx.discount);
            setDiscountPriceOrigin(ctx.discountPrice);
            setDeliveryPriceOrigin(ctx.deliveryPrice);
            setPayDate(new Date());
            if (ctx.discountLabel === "FIRST WASH") {
                setIsPercent(false);
            }
        }
    }, [props.open]);

    const handleSwitch = () => {
        setIsPercent(!isPercent)
        setDiscount(discountOrigin);
        setDiscountPrice(discountPriceOrigin);
        ctx.setDiscount(discountOrigin);
        ctx.setDiscountPrice(discountPriceOrigin);
    }

    useEffect(() => {
        ctx.setDiscByPrice(!isPercent);
    }, [isPercent]);

    const handleReset = (type = "") => {
        setTimeout(() => {
            setActive("");
            setPaymentType("Cash");
            setPaymentMethod("");
            setCardBankName("");
            setCardAccountName("");
            setCardNumber("");
            setNotes("");
            setAmountPaid(0);
            setShowAlert(false);
            setDonation(0);
            setVoucherCode("");
            setError(false);
            setErrorMessage("");
            if (type === "all") {
                setDiscount(0);
                setDiscountPrice(0);
                setDeliveryPrice(0);
            }
        }, 1000);
    }

    const handleClose = () => {
        handleReset();
        if (fromOutlet) { // reset voucher yang diinput dari outlet
            setFromOutlet(false);
            ctx.setVoucherCode("");
            ctx.setVoucherDiscPrice(0);
        }
        ctx.setSplitAmount(0);
        ctx.setSplitBill([]);
        ctx.setDiscount(discountOrigin);
        ctx.setDiscountPrice(discountPriceOrigin);
        ctx.setDeliveryPrice(deliveryPriceOrigin);
        ctx.setDonation(0);
        setDiscount(discountOrigin);
        setDiscountPrice(discountPriceOrigin);
        setDeliveryPrice(deliveryPriceOrigin);
        props.onClose();
    }

    const handleCard = (e) => {
        if (resetCardNumberFormat(e).length <= 16) {
            setCardNumber(e);
        }
        if (resetCardNumberFormat(e).length < 16) {
            setAmountPaid(0);
        } else {
            setAmountPaid(amount);
        }
    };

    const moneyOptions = [5000, 10000, 20000, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000];

    const smartPay1 = () => {
        const count = amount.toString().length;
        let pembulat = 100;
        if (count <= 4) {
            pembulat = 1000;
        }
        if (count <= 6) {
            pembulat = 10000;
        }
        if (count === 7) {
            pembulat = 100000;
        }
        if (count === 8) {
            pembulat = 1000000;
        }

        let pay = Math.ceil(amount / pembulat) * pembulat;

        if (pay === amount) {
            let closestDifference = Infinity;

            for (let i = 0; i < moneyOptions.length; i += 1) {
                const difference = moneyOptions[i] - amount;

                if (difference > 0 && difference < closestDifference) {
                    pay = moneyOptions[i];
                    closestDifference = difference;
                }
            }
        }

        return pay;
    }

    const smartPay2 = () => {
        let closestNumber = Math.ceil(smartPay1() / 1000) * 1000;
        let closestDifference = Infinity;

        for (let i = 0; i < moneyOptions.length; i += 1) {
            const difference = moneyOptions[i] - smartPay1();

            if (difference > 0 && difference < closestDifference) {
                closestNumber = moneyOptions[i];
                closestDifference = difference;
            }
        }

        if (closestNumber === smartPay1()) {
            closestNumber += 10000;
        }

        return closestNumber;
    }

    const handleSelectedPayment = (payMethod, checked) => {
        if (payMethod === "Cash") {
            if (checked === "cash-pas") {
                setAmountPaid(amount);
                handleDisplay("");
            } else if (checked === "cash-smart1") {
                setAmountPaid(smartPay1());
                handleDisplay("");
            } else if (checked === "cash-smart2") {
                setAmountPaid(smartPay2());
                handleDisplay("");
            }
            setCardBankName("");
            setCardAccountName("");
            setCardNumber("");

        } else if (payMethod === "Bank Transfer") {
            setCardBankName(checked);
            setAmountPaid(amount);

        } else if (payMethod === "Card") {
            if (resetCardNumberFormat(cardNumber).length < 16 && cardBankName === "" && cardAccountName === "") {
                setAmountPaid(0);
            } else {
                setAmountPaid(amount);
            }
            handleDisplay("");

        } else {
            setAmountPaid(amount);
            handleDisplay("");
            setCardBankName("");
            setCardAccountName("");
            setCardNumber("");
        }

        setPaymentMethod(payMethod);
        setActive(checked);
    };

    const resetPayment = () => {
        setPaymentMethod("");
        setActive("");
        handleDisplay("");
        setAmountPaid(0);
        setCardBankName("");
        setCardAccountName("");
        setCardNumber("");
    }

    const handleSelectedPaymentType = (type) => {
        if (paymentType !== type) {
            resetPayment();
        }
        setPaymentType(type);
    };

    const handleInput = (value) => {
        setAmountPaid(value);
    }

    const handleDisplay = (value) => {
        setInputAmount(value);
    }

    const handleScanSuccess = (text) => {
        if (text) {
            setVoucherCode(text); // Set hasil scan
            if (inputRef.current) {
                // Fokus ke input field
                inputRef.current.focus();

                // Trigger event keydown Enter secara programatik
                setTimeout(() => {
                    const enterEvent = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                    });
                    inputRef.current.dispatchEvent(enterEvent);
                }, 100); // Delay untuk memastikan memberId sudah diset dan fokusnya sudah aktif
            }
        }
        handleCloseCamera();
    };

    const handleOpenCamera = () => {
        setIsCameraOpen(true);

        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
        }
        codeReaderRef.current = new BrowserMultiFormatReader();

        // Ambil frame tiap 500ms dan decode
        const id = setInterval(async () => {
            if (!webcamRef.current) return;
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                try {
                    const result = await codeReaderRef.current.decodeFromImageUrl(
                        imageSrc
                    );
                    if (result) {
                        handleScanSuccess(result.getText());
                    }
                } catch (err) {
                    // ignore decode errors (artinya belum ketemu QR)
                }
            }
        }, 500);

        setIntervalId(id);
    };

    const handleCloseCamera = () => {
        setIsCameraOpen(false);

        // Hentikan ZXing
        if (codeReaderRef.current) {
            try {
                codeReaderRef.current.reset();
            } catch (err) {
                console.warn("ZXing reset error:", err);
            }
        }

        // Stop interval
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useEffect(() => {
        // Handle back navigation (browser back button or device back button)
        const handleBackAction = () => {
            if (isCameraOpen) {
                handleCloseCamera();
            }
        };

        // Add event listener for browser back action
        window.addEventListener("popstate", handleBackAction);

        // Manipulasi riwayat secara manual saat membuka kamera
        if (isCameraOpen) {
            window.history.pushState(null, null, window.location.href);
        }

        // Cleanup when the component unmounts or camera is closed
        return () => {
            window.removeEventListener("popstate", handleBackAction);
            if (isCameraOpen) {
                handleCloseCamera(); // Ensure camera is closed when leaving the modal
            }
        };
    }, [isCameraOpen]);

    const handleSearch = async () => {
        if (voucherCode && voucherCode !== ctx.voucherCode) {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/member-vouchers/scan/${voucherCode}`);
                if (res?.status === 200 && res?.data) {
                    if (res?.data?.voucherType !== 1) {
                        setError(true);
                        setErrorMessage("Bukan voucher diskon!");
                        ctx.setVoucherCode("");
                        ctx.setVoucherDiscPrice(0);
                        return;
                    }
                    if (res?.data?.isUsed) {
                        setError(true);
                        setErrorMessage(`Voucher sudah digunakan pada ${formatDate2(res?.data?.usedAt)}`);
                        ctx.setVoucherCode("");
                        ctx.setVoucherDiscPrice(0);
                        return;
                    }
                    if (res?.data?.isExpired) {
                        setError(true);
                        setErrorMessage("Voucher sudah kedaluwarsa!");
                        ctx.setVoucherCode("");
                        ctx.setVoucherDiscPrice(0);
                        return;
                    }

                    let vPrice = 0;
                    const canUseVoucher = ctx.bill.some((item) => {
                        const matchedProduct = res?.data?.product?.find((row) => row?._id === item?.id);
                        const hasMatchingQty = item?.qty >= res?.data?.qtyProduct;
                        if (res?.data?.member?.phone === ctx.customerPhone) {
                            vPrice = matchedProduct?.price || 0;
                            return matchedProduct && hasMatchingQty;
                        }
                        return false;
                    });

                    if (canUseVoucher) {
                        setError(false);
                        setErrorMessage("");
                        setFromOutlet(true); // jika voucher diinput di outlet
                        ctx.setVoucherCode(res?.data?.voucherCode);
                        ctx.setVoucherDiscPrice(vPrice * res?.data?.qtyProduct || 1);
                    } else {
                        setError(true);
                        setErrorMessage("Voucher tidak valid!");
                        ctx.setVoucherCode("");
                        ctx.setVoucherDiscPrice(0);
                    }

                } else {
                    setError(true);
                    setErrorMessage("Voucher tidak ditemukan!");
                    ctx.setVoucherCode("");
                    ctx.setVoucherDiscPrice(0);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(true);
                setErrorMessage("Voucher tidak ditemukan!");
                ctx.setVoucherCode("");
                ctx.setVoucherDiscPrice(0);
            } finally {
                setLoading(false);
                resetPayment();
            }
        }
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Print
    const printRef = useRef();
    const handleAfterPrint = () => {
        if (currUid) {
            ctx.updatePrintCount(currUid, { staff: user?.fullname });
            setCurrUid("");
            setIsPrint(false);
            ctx.handleResetPos();
        }
    };
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        onAfterPrint: handleAfterPrint,
    });

    const handleCharge = async (type = "payment") => {
        if (type === "payment") {
            if (amount > amountPaid) {
                return setShowAlert(true);
            }
        }

        setIsLoading(true);

        ctx.setAmountBill(Number(amount));
        ctx.setAmountPaid(amountPaid);
        ctx.setDeliveryPrice(deliveryPrice);
        ctx.setDiscount(discount);
        ctx.setDiscountPrice(discountPrice);
        ctx.setDonation(donation);

        const isUpdate = ctx.currentOrderID !== "";
        const orderUid = isUpdate ? ctx.currentOrderID : uuid();
        const orderId = isUpdate ? ctx.displayOrderID : generateRandomId(6);

        if (type === "save") {
            setCurrUid(orderUid);
        }

        let objData = {
            ...(isUpdate ? {} : { _id: orderUid, date: ctx?.orderDate, orderId, staff: user?.fullname, orderType: ctx?.orderType || "onsite" }),
            orders: props.afterSplit?.length ? props.afterSplit : ctx.bill,
            serviceChargePercentage: ctx.serviceChargePercentage,
            serviceCharge: ctx.serviceCharge,
            taxPercentage: ctx.taxPercentage,
            tax: ctx.tax,
            voucherCode: ctx.voucherCode,
            voucherDiscPrice: ctx.voucherDiscPrice,
            discount,
            discountPrice,
            deliveryPrice,
            donation,
            billedAmount: ctx.actualPrice,
            productionAmount: ctx.productionAmount,
            notes,
            isScan: ctx?.customerScan || false
        };

        if (type === "payment") {
            objData = {
                ...objData,
                havePaid: isUpdate ? Number(ctx.havePaid) + Number(amount) : ctx.actualPrice,
                paymentDate: combinedDateTime(payDate || new Date()),
                status: isUpdate
                    ? (Number(ctx.havePaid) + Number(amount)) === ctx.actualPrice ? "paid" : "half paid"
                    : "paid",
                payment: cardNumber ? "Card" : paymentMethod,
                cardBankName,
                cardAccountName,
                cardNumber,
            }
        }

        // Tambahkan data customer jika ada
        if (ctx.customerName) {
            objData.customer = {
                ...ctx.customerData || {},
                name: ctx.customerName,
                phone: ctx.customerPhone,
                notes: ctx.customerNotes,
                isNew: ctx?.customerNew || false
            };
        }

        // Tambahkan data pickup jika ada
        if (ctx.pickupData?.by) {
            objData.pickupData = ctx.pickupData;
            objData.pickUpStatus = ctx.pickupData.status || "completed";
        }

        let res;

        // Update atau create order
        if (isUpdate) {
            if (props.afterSplit?.length) {
                ctx.setBill(props.afterSplit);
            }
            res = await ctx.updateOrders(ctx.currentOrderID, objData);

            if (res?.status === 200) {
                setTimeout(() => {
                    ctx.setHavePaid(Number(ctx.havePaid) + Number(amount));
                }, 500);
            }
        } else {
            if (ctx.savedBillID) {
                const updatedSaved = ctx.savedBill.filter((b) => b.id !== ctx.savedBillID);
                ctx.setSavedBill(updatedSaved);
            }
            ctx.setCurrentOrderID(orderUid);
            ctx.setDisplayOrderID(orderId);
            res = await ctx.createOrders(objData);
        }

        if (res?.status === 200) {
            props.onClose();
            handleReset("all");
            if (type === "payment") {
                ctx.setIsFinished(true);
            }
            if (type === "save") {
                enqueueSnackbar("Successfully update order!");
                setIsPrint(true);
            }
        } else {
            enqueueSnackbar("Terjadi kesalahan. Silakan coba lagi!", { variant: "error" });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (isPrint) {
            const timer = setTimeout(() => {
                handlePrint();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isPrint]);

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="md"
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ borderBottom: "1px solid #ccc", textAlign: "center", fontSize: "calc(1rem + 0.8vw)" }}>
                    Payment
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Container>
                        {showAlert && (
                            <Alert severity="error" sx={{ mb: 2 }}>Nominal pembayaran kurang</Alert>
                        )}
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    Sub Total
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" align="right" mr={1.5}>
                                    Rp. {numberWithCommas(ctx.splitAmount > 0 ? ctx.splitAmount : ctx.subtotalPrice)}
                                </Typography>
                            </Grid>
                            {ctx.splitAmount === 0 && ctx.havePaid === 0 && (
                                <>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle1">
                                                Voucher Code
                                            </Typography>
                                            <LoadingButton variant="contained" loading={loading} onClick={handleOpenCamera}>
                                                <Iconify icon="solar:camera-bold" width={30} height={30} />
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            ref={inputRef}
                                            autoComplete="off"
                                            fullWidth
                                            inputProps={{ style: { textAlign: "right" } }}
                                            error={error ? Boolean(true) : Boolean(false)}
                                            helperText={error ? errorMessage : ""}
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                            onKeyDown={handleOnKeyPress}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">
                                            Voucher Discount
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1" align="right" mr={1.5}>
                                            Rp. {numberWithCommas(ctx.voucherDiscPrice)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle1">
                                                Discount
                                            </Typography>
                                            <FormControlLabel
                                                control={<Android12Switch checked={isPercent} onClick={() => handleSwitch()} disabled={ctx.discountLabel === "FIRST WASH"} />}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {isPercent ? (
                                            <TextField
                                                type="number"
                                                placeholder="0"
                                                autoComplete="off"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                    inputProps: { min: 1, max: 100, style: { textAlign: "right" } }
                                                }}
                                                fullWidth
                                                value={discount && discountPrice ? Number(discount) : ""}
                                                onChange={(e) => {
                                                    const percent = Math.min(Number(e.target.value), 100);
                                                    const discPrice = (percent / 100) * ctx.subtotalPrice;
                                                    setDiscount(percent);
                                                    setDiscountPrice(discPrice);
                                                    ctx.setDiscount(percent);
                                                    ctx.setDiscountPrice(discPrice);
                                                }}
                                            />
                                        ) : (
                                            <NumericFormat
                                                customInput={TextField}
                                                id="discount"
                                                name="discount"
                                                placeholder="0"
                                                autoComplete="off"
                                                decimalScale={2}
                                                decimalSeparator="."
                                                thousandSeparator=","
                                                allowNegative={false}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                                    inputProps: { style: { textAlign: "right" } }
                                                }}
                                                fullWidth
                                                value={discountPrice ? Number(discountPrice) : ""}
                                                onValueChange={(values) => {
                                                    setDiscountPrice(Number(values.value));
                                                    ctx.setDiscountPrice(Number(values.value));
                                                }}
                                            // disabled={ctx.discountLabel === "FIRST WASH"}
                                            />
                                        )}
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">
                                            Delivery Fee
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <NumericFormat
                                            customInput={TextField}
                                            id="deliveryPrice"
                                            name="deliveryPrice"
                                            placeholder="0"
                                            autoComplete="off"
                                            decimalScale={2}
                                            decimalSeparator="."
                                            thousandSeparator=","
                                            allowNegative={false}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                                inputProps: { style: { textAlign: "right" } }
                                            }}
                                            fullWidth
                                            value={deliveryPrice ? Number(deliveryPrice) : ""}
                                            onValueChange={(values) => {
                                                setDeliveryPrice(Number(values.value));
                                                ctx.setDeliveryPrice(Number(values.value));
                                            }}
                                        />
                                    </Grid>

                                    {/* <Grid item xs={6}>
                                    <Typography variant="subtitle1">
                                        Donation
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <NumericFormat
                                        customInput={TextField}
                                        id="donation"
                                        name="donation"
                                        placeholder="0"
                                        autoComplete="off"
                                        decimalScale={2}
                                        decimalSeparator="."
                                        thousandSeparator=","
                                        allowNegative={false}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                            inputProps: { style: { textAlign: "right" } }
                                        }}
                                        fullWidth
                                        value={donation ? Number(donation) : ""}
                                        onValueChange={(values) => {
                                            setDonation(Number(values.value));
                                            ctx.setDonation(Number(values.value));
                                        }}
                                    />
                                </Grid> */}
                                </>
                            )}
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" color="red">
                                    Total Pembayaran
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" align="right" color="red" mr={1.5}>
                                    Rp. {numberWithCommas(amount)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    Tanggal Bayar
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileDatePicker
                                        inputFormat="dd/MM/yyyy"
                                        value={payDate}
                                        onChange={(newValue) => {
                                            setPayDate(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <img src="/assets/calender-icon.svg" alt="icon" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container mt={2}>
                            <Grid item xs={12} md={3}>
                                <Stack
                                    sx={{
                                        backgroundColor: theme.palette.primary.lighter,
                                        borderRadius: { xs: "10px 10px 0 0", md: "10px 0 0 10px" },
                                        height: "100%"
                                    }}
                                    p={2}
                                >
                                    <Typography variant="subtitle1" mb={1}>
                                        Payment Type
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4} md={12}>
                                            <PaymentType
                                                onClick={() => handleSelectedPaymentType("Cash")}
                                                active={paymentType === "Cash" ? "active" : ""}
                                                title="Cash"
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={12}>
                                            <PaymentType
                                                onClick={() => handleSelectedPaymentType("Bank Transfer")}
                                                active={paymentType === "Bank Transfer" ? "active" : ""}
                                                title="Transfer"
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={12}>
                                            <PaymentType
                                                onClick={() => handleSelectedPaymentType("E-Wallet")}
                                                active={paymentType === "E-Wallet" ? "active" : ""}
                                                title="E-Wallet"
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={12}>
                                            <PaymentType
                                                onClick={() => handleSelectedPaymentType("Card")}
                                                active={paymentType === "Card" ? "active" : ""}
                                                title="Card"
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <Stack
                                    sx={{
                                        backgroundColor: alpha(theme.palette.primary.lighter, 0.5),
                                        borderRadius: { xs: "0 0 10px 10px", md: "0 10px 10px 0" },
                                        height: "100%"
                                    }}
                                    p={2}
                                >
                                    <Typography variant="subtitle1" mb={1}>
                                        Option
                                    </Typography>
                                    {paymentType === "Cash" && (
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Cash", "cash-pas")}
                                                        active={paymentMethod && active === "cash-pas" ? "active" : ""}
                                                        // title={`Rp. ${numberWithCommas(amount)}`}
                                                        title="Uang Pas"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Cash", "cash-smart1")}
                                                        active={paymentMethod && active === "cash-smart1" ? "active" : ""}
                                                        title={`Rp. ${numberWithCommas(smartPay1())}`}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Cash", "cash-smart2")}
                                                        active={paymentMethod && active === "cash-smart2" ? "active" : ""}
                                                        title={`Rp. ${numberWithCommas(smartPay2())}`}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Cash", "cash-input")}
                                                        active={paymentMethod && active === "cash-input" ? "active" : ""}
                                                        input
                                                        inputAmount={inputAmount}
                                                        handleInput={handleInput}
                                                        handleDisplay={handleDisplay}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {paymentType === "Bank Transfer" && (
                                        <Grid container spacing={2}>
                                            {bankOptions.map((option, i) => (
                                                <Grid item xs={4} key={i}>
                                                    <FormControl fullWidth>
                                                        <PaymentItem
                                                            onClick={() => handleSelectedPayment("Bank Transfer", option)}
                                                            active={paymentMethod && active === option ? "active" : ""}
                                                            title={option}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}

                                    {paymentType === "E-Wallet" && (
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Dana", "dana")}
                                                        active={paymentMethod && active === "dana" ? "active" : ""}
                                                        // image="/pictures/dana.png"
                                                        title="DANA"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("Shopee Pay", "shopeePay")}
                                                        active={paymentMethod && active === "shopeePay" ? "active" : ""}
                                                        // image="/pictures/Logo-ShopeePay.png"
                                                        title="SHOPEEPAY"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("OVO", "ovo")}
                                                        active={paymentMethod && active === "ovo" ? "active" : ""}
                                                        // image="/pictures/ovo-logo.png"
                                                        title="OVO"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <FormControl fullWidth>
                                                    <PaymentItem
                                                        onClick={() => handleSelectedPayment("QRIS", "qris")}
                                                        active={paymentMethod && active === "qris" ? "active" : ""}
                                                        // image="/pictures/qris-logo.png"
                                                        title="QRIS"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {paymentType === "Card" && (
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        id="bankName"
                                                        name="bankName"
                                                        label="Bank Name"
                                                        select
                                                        fullWidth
                                                        value={cardBankName}
                                                        InputProps={{
                                                            style: { backgroundColor: "#FFFFFF" }
                                                        }}
                                                        onChange={(e) => setCardBankName(e.target.value)}
                                                    >
                                                        {bankOptions.map((option, n) => (
                                                            <MenuItem
                                                                key={n}
                                                                value={option}
                                                                sx={{
                                                                    mx: 1,
                                                                    my: 0.5,
                                                                    borderRadius: 0.75,
                                                                    typography: "body2",
                                                                    textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        id="accountName"
                                                        name="accountName"
                                                        type="text"
                                                        label="Account Name"
                                                        autoComplete="off"
                                                        fullWidth
                                                        InputProps={{
                                                            style: { backgroundColor: "#FFFFFF" }
                                                        }}
                                                        onChange={(e) => setCardAccountName(e.target.value)}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        id="card"
                                                        name="card"
                                                        type="text"
                                                        label="Card Number"
                                                        autoComplete="off"
                                                        fullWidth
                                                        InputProps={{
                                                            style: { backgroundColor: "#FFFFFF" }
                                                        }}
                                                        onClick={() => handleSelectedPayment("Card", "card")}
                                                        // onFocus={(e) => handleCard(e.target.value)}
                                                        onChange={(e) => handleCard(e.target.value)}
                                                        value={cardNumber ? cardNumberFormat(cardNumber) : ""}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* <Typography variant="subtitle1" sx={{ mt: 2.5, mb: 1 }}>
                        Other
                    </Typography>
                    <Grid container spacing={2} >
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <PaymentItem
                                    onClick={() => handleSelectedPayment("Transfer", "transfer")}
                                    active={paymentMethod && active === "transfer" ? "active" : ""}
                                    title="Transfer"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <PaymentItem
                                    onClick={() => handleSelectedPayment("Deposit", "deposit")}
                                    active={paymentMethod && active === "deposit" ? "active" : ""}
                                    title="Deposit"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <PaymentItem
                                    onClick={() => handleSelectedPayment("Gift Card", "gift-card")}
                                    active={paymentMethod && active === "gift-card" ? "active" : ""}
                                    title="Gift Card"
                                />
                            </FormControl>
                        </Grid>
                    </Grid> */}

                        {/* <Typography variant="subtitle1" sx={{ mt: 2.5, mb: 1 }}>
                        Notes
                    </Typography>
                    <TextField
                        id="notes"
                        name="notes"
                        type="text"
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Other Notes"
                        autoComplete="off"
                        onChange={(e) => setNotes(e.target.value)}
                    /> */}
                    </Container>
                </DialogContent >
                <DialogActions>
                    <Stack
                        flexDirection="row"
                        sx={{ mx: 1.5, width: "100%" }}
                    >
                        <LoadingButton
                            size="large"
                            variant="contained"
                            sx={{
                                minWidth: "fit-content",
                                py: 4,
                                fontSize: "calc(12px + 0.4vw)",
                                boxShadow: 0,
                                borderRadius: "8px 0px 0px 8px",
                                bgcolor: theme.palette.primary.light,
                            }}
                            loading={isLoading}
                            disabled={ctx.bill.length > 0 && !isLoading ? Boolean(false) : Boolean(true)}
                            onClick={() => handleCharge("save")}
                        >
                            Save
                        </LoadingButton>
                        <LoadingButton
                            sx={{
                                py: 4,
                                fontSize: "calc(12px + 0.4vw)",
                                boxShadow: 0,
                                borderRadius: "0px 8px 8px 0px",
                            }}
                            fullWidth
                            size="large"
                            variant="contained"
                            loading={isLoading}
                            disabled={
                                (paymentType === "Card" && cardBankName === "") ||
                                    (paymentType === "Card" && cardAccountName === "") ||
                                    (paymentType === "Card" && cardNumber === "") ||
                                    paymentMethod === "" ||
                                    loading ? Boolean(true) : Boolean(false)
                            }
                            onClick={() => handleCharge()}
                        >
                            Proceed to Pay
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </BootstrapDialog >

            {isCameraOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Kamera pakai react-webcam */}
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                        onClick={() => handleCloseCamera()}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 10000,
                        }}
                    >
                        <Iconify icon="eva:close-fill" width={30} height={30} />
                    </IconButton>
                    <Stack
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                        p={1}
                        sx={{ position: "absolute", inset: 0 }}
                    >
                        <div style={{ position: "relative", width: "50vw", height: "50vh" }}>
                            {["top left", "top right", "bottom left", "bottom right"].map((pos, i) => {
                                let bgColor = "#FFFFFF transparent transparent #FFFFFF";
                                if (i === 1) bgColor = "#FFFFFF #FFFFFF transparent transparent";
                                if (i === 2) bgColor = "transparent transparent #FFFFFF #FFFFFF";
                                if (i === 3) bgColor = "transparent #FFFFFF #FFFFFF transparent";
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            position: "absolute",
                                            [pos.split(" ")[0]]: 0,
                                            [pos.split(" ")[1]]: 0,
                                            width: "2rem",
                                            height: "2rem",
                                            border: "4px solid transparent",
                                            borderColor: bgColor,
                                        }}
                                    />
                                );
                            })}

                            {/* Animasi scan */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(255, 255, 255, 0.1)",
                                        position: "absolute",
                                    }}
                                />
                                <div
                                    style={{
                                        width: "100%",
                                        height: "4px",
                                        background: "rgba(255, 255, 255, 0.8)",
                                        position: "absolute",
                                        animation: "scanMove 2s linear infinite",
                                        boxShadow: "0px 0px 10px #FFFFFF",
                                    }}
                                />
                            </div>

                            {/* CSS Animasi */}
                            <style>
                                {`
                                @keyframes scanMove {
                                    0% { top: 0; opacity: 0.1; }
                                    50% { opacity: 1; }
                                    100% { top: 100%; opacity: 0.1; }
                                }
                            `}
                            </style>
                        </div>
                        <Typography variant="body" color="#FFFFFF" textAlign="center">
                            Sejajarkan kode QR di dalam kotak untuk pemindai otomatis
                        </Typography>
                    </Stack>
                </div>
            )}

            <div style={{ overflow: "hidden", height: 0, width: 0 }}>
                <PrintReceipt ref={printRef} bill={ctx.bill} status="pending" />
            </div>
        </>
    );
}
