import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
import { useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
// uuid
import { v4 as uuid } from "uuid";
// @mui
import {
    Button,
    Checkbox,
    IconButton,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    TextField,
    Typography,
    MenuItem,
    Alert
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../../components/Iconify";
// utils
import { numberWithCommas, formatDate2 } from "../../../../utils/getData";
// hooks
// import useAuth from "../../../../hooks/useAuth";
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalRefund.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: PropTypes.object,
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

export default function ModalRefund(props) {
    const client = useQueryClient();

    // const { user } = useAuth();

    const { enqueueSnackbar } = useSnackbar();

    const ctx = useContext(cashierContext);

    const [isLoading, setIsLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);

    // current orders data
    const [items, setItems] = useState(props.data.orders);

    const [refund, setRefund] = useState([]);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [total, setTotal] = useState(0);
    const [productionPrice, setProductionPrice] = useState(0);

    const [selected, setSelected] = useState("");
    const [reason, setReason] = useState("");

    const reasonOptions = ["Pesanan Tidak Sampai", "Kesalahan Transaksi", "Lainnya"];

    useEffect(() => {
        const sumPrice = refund.reduce((acc, i) => {
            if (i.promotionType === 1) {
                return acc + (Math.round(i.price * i.qty) - (Math.round(i.price * i.qty) * i.discountAmount) / 100);
            }
            if (i.promotionType === 2) {
                return acc + (Math.round(i.price * i.qty) - i.discountAmount);
            }
            return acc + (Math.round(i.price * i.qty));
        }, 0);
        setTotal(sumPrice);

        const sumProductionPrice = refund.reduce((acc, i) => {
            return acc + (Math.round((i?.productionPrice || 0) * i.qty));
        }, 0);
        setProductionPrice(sumProductionPrice);
    }, [refund]);

    useEffect(() => {
        const sumQty = props.data.orders.reduce((acc, i) => {
            return acc + i.qty;
        }, 0);

        if (props.data.discountPrice) {
            setDiscountPrice(props.data.discountPrice / sumQty);
        }

    }, []);

    const getTax = (value) => {
        return value * (props.data.taxPercentage / 100);
    }

    const getServiceCharge = (value) => {
        return value * (props.data.serviceChargePercentage / 100);
    }

    const closeConfirm = () => {
        setOpenConfirm(false);
    };

    const handleClose = () => {
        props.onClose();
        setTimeout(() => {
            setRefund([]);
            setSelected("");
            setReason("");
        }, 1000);
    }

    const findQty = (field) => {
        const data = refund.find((data) => data.id === field.id && JSON.stringify(data.variant) === JSON.stringify(field.variant));
        return data ? data.qty : 0;
    };

    const handleChecked = (e, item) => {
        if (e.target.checked) {
            setRefund((arr) => [
                ...arr,
                {
                    id: item.id,
                    name: item.name,
                    price: ((item.price - discountPrice) + getTax(item.price) + getServiceCharge(item.price)),
                    productionPrice: item?.productionPrice || 0,
                    qty: item.refundQty ? item.qty - item.refundQty : item.qty,
                    category: item.category,
                    products: item.products,
                    promotionType: item.promotionType,
                    discountAmount: item.discountAmount,
                    section: item.section,
                    variant: item.variant,
                    status: item.status,
                    notes: item.notes,
                }
            ])

            setItems((curr) =>
                curr.map((row) =>
                    row.id === item.id && JSON.stringify(row.variant) === JSON.stringify(item.variant)
                        ? {
                            ...row,
                            refundQty: item.refundQty ? (item.refundQty + (item.qty - item.refundQty)) : item.qty,
                        }
                        : row
                )
            );

        } else {
            setRefund((curr) => curr.filter((row) => row.id !== item.id || JSON.stringify(row.variant) !== JSON.stringify(item.variant)));

            setItems((curr) =>
                curr.map((row) =>
                    row.id === item.id && JSON.stringify(row.variant) === JSON.stringify(item.variant)
                        ? {
                            ...row,
                            refundQty: item.refundQty ? item.refundQty : 0,
                        }
                        : row
                )
            );
        }
    };

    const handleDecrease = (field) => {
        setRefund((curr) =>
            curr.map((item) =>
                item.id === field.id && JSON.stringify(item.variant) === JSON.stringify(field.variant)
                    ? {
                        ...item,
                        qty: Math.round(item.qty - 1),
                    }
                    : item
            )
        );

        setItems((curr) =>
            curr.map((row) =>
                row.id === field.id && JSON.stringify(row.variant) === JSON.stringify(field.variant)
                    ? {
                        ...row,
                        refundQty: Math.round(row.refundQty - 1),
                    }
                    : row
            )
        );
    }

    const handleIncrease = (field) => {
        setRefund((curr) =>
            curr.map((item) =>
                item.id === field.id && JSON.stringify(item.variant) === JSON.stringify(field.variant)
                    ? {
                        ...item,
                        qty: item.qty + 1,
                    }
                    : item
            )
        );

        setItems((curr) =>
            curr.map((row) =>
                row.id === field.id && JSON.stringify(row.variant) === JSON.stringify(field.variant)
                    ? {
                        ...row,
                        refundQty: row.refundQty + 1,
                    }
                    : row
            )
        );
    }

    const handleSelected = (e) => {
        setSelected(e.target.value);

        if (e.target.value !== "Lainnya") {
            setReason(e.target.value);
        } else {
            setReason("");
        }
    }

    const handleRefund = async () => {
        setIsLoading(true);
        try {
            const objData = {
                _id: uuid(),
                orderId: props.data.orderId,
                date: new Date(Date.now()),
                customer: props.data.customer,
                orders: refund,
                orderType: props.data.orderType,
                status: "refund",
                havePaid: -total,
                discount: 0,
                discountPrice: 0,
                billedAmount: -total,
                productionAmount: -productionPrice,
                payment: "Cash",
                cardBankName: "",
                cardAccountName: "",
                cardNumber: "",
                notes: "",
                refundType: props.data.billedAmount === total ? 1 : 2, // 1 penuh, 2 sebagian
                refundReason: reason,
            };

            await ctx.createOrders(objData);

            await ctx.updateOrders(props.data._id, { orders: items });

            client.invalidateQueries("listOrders");

            if (props.data.billedAmount === total) {
                enqueueSnackbar("Refund (penuh) success!");
            } else {
                enqueueSnackbar("Refund (sebagian) success!");
            }
            handleClose();
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Refund failed!", { variant: "error" });
        }
        closeConfirm();
        setIsLoading(false);
    }

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="sm"
                open={props.open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    style={{ borderBottom: "1px solid #ccc" }}
                >
                    Detail
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Alert severity="warning" sx={{ mb: 2 }}>Harga produk terakumulasi dengan diskon, pajak, dan biaya jasa!</Alert>
                    <table style={{ width: "100%" }}>
                        <thead style={{ color: "#6c757d!important", fontSize: "0.9rem" }}>
                            <tr>
                                <th align="left">ITEMS</th>
                                <th width="100px">QUANTITY</th>
                                <th align="center">PRICE</th>
                                <th align="center">REFUND</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.85rem" }}>
                            {props.data.orders.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ padding: "0.5rem 0" }}>
                                        <span>{item.name}</span>
                                        {item.variant && item.variant.map((variant, v) => (
                                            <p key={v} style={{ fontSize: "0.80rem", opacity: "0.7" }}>{`${variant.name} : ${variant.option} ${variant.qty > 1 ? `(x${variant.qty})` : ""}`}</p>
                                        ))}
                                        {item.notes && (
                                            <p style={{ fontSize: "0.80rem", opacity: "0.7" }}>Notes : {item.notes}</p>
                                        )}
                                        {item.refundQty > 0 && (
                                            <span style={{ color: "red" }}>{`Telah direfund x${item.refundQty}`}</span>
                                        )}
                                    </td>
                                    <td align="center">
                                        {findQty(item) ? (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minWidth: "3px", boxShadow: "0" }}
                                                    disabled={findQty(item) === 1 ? Boolean(true) : Boolean(false)}
                                                    onClick={() => handleDecrease(item)}
                                                >-</Button>
                                                x{findQty(item)}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minWidth: "3px", boxShadow: "0" }}
                                                    disabled={findQty(item) === (item.refundQty ? item.qty - item.refundQty : item.qty) ? Boolean(true) : Boolean(false)}
                                                    onClick={() => handleIncrease(item)}
                                                >+</Button>
                                            </Stack>
                                        ) : (
                                            `x${item.qty}`
                                        )}
                                    </td>
                                    <td align="center" width={100}>
                                        {item.promotionType === 1 ? (
                                            <>
                                                <span style={{ color: "red", textDecoration: "line-through", opacity: 0.7 }}>
                                                    Rp. {numberWithCommas((findQty(item) ? findQty(item) : item.qty) * ((item.price - discountPrice) + getTax(item.price) + getServiceCharge(item.price)))}
                                                </span>
                                                <br />
                                                <span>
                                                    Rp. {numberWithCommas(((findQty(item) ? findQty(item) : item.qty)) * ((item.price - discountPrice) + getTax(item.price) + getServiceCharge(item.price)) - (item.qty * ((item.price - discountPrice) + getTax(item.price) + getServiceCharge(item.price)) * item.discountAmount) / 100)}
                                                </span>
                                            </>
                                        ) : (
                                            <span>Rp. {numberWithCommas((findQty(item) ? findQty(item) : item.qty) * ((item.price - discountPrice) + getTax(item.price) + getServiceCharge(item.price)))}</span>
                                        )}
                                    </td>
                                    <td align="center">
                                        <Checkbox
                                            disabled={item.refundQty && item.refundQty === item.qty ? Boolean(true) : Boolean(false)}
                                            onChange={(e) => handleChecked(e, item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <Stack gap={2}>
                        <TextField
                            name="reason"
                            label="Alasan"
                            select
                            fullWidth
                            value={selected}
                            onChange={handleSelected}
                        >
                            {reasonOptions.map((option) => (
                                <MenuItem
                                    key={option}
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
                        {selected === "Lainnya" && (
                            <TextField
                                name="others"
                                placeholder="Ketik disini..."
                                fullWidth
                                onChange={(e) => setReason(e.target.value)}
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        disabled={refund.length > 0 && reason !== "" ? Boolean(false) : Boolean(true)}
                        onClick={() => setOpenConfirm(true)}
                    >
                        Refund
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            <Dialog
                open={openConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc" }}>
                    Refund
                    <IconButton
                        aria-label="close"
                        onClick={closeConfirm}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Iconify icon="eva:close-fill" width={24} height={24} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography variant="body2">Date</Typography>
                        <Typography variant="body2">{formatDate2(new Date())}</Typography>
                    </Stack>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography variant="body2">Order ID</Typography>
                        <Typography variant="body2">{props.data.orderId}</Typography>
                    </Stack>
                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                    <table style={{ width: "100%" }}>
                        <tbody style={{ fontSize: "14px" }}>
                            {refund.length > 0 && refund.map((item, i) => (
                                <tr key={i}>
                                    <td>
                                        {item.name}
                                        {item.variant.length > 0 && item.variant.map((field, v) => (
                                            <span key={v}>
                                                <br />
                                                <em>{`${field.name} : ${field.option}`}</em>
                                            </span>
                                        ))}
                                        {item.notes && (
                                            <span>
                                                <br />
                                                <em>Notes : {item.notes}</em>
                                            </span>
                                        )}
                                    </td>
                                    <td align="center">x{item.qty}</td>
                                    <td align="right">
                                        <span
                                            style={{
                                                color: item.promotionType === 1 ? "red" : "#212B36",
                                                textDecoration: item.promotionType === 1 ? "line-through" : "none",
                                                opacity: item.promotionType === 1 ? 0.7 : 1
                                            }}
                                        >
                                            Rp. {numberWithCommas(Math.round(item.qty * item.price))}
                                        </span>
                                        {item.promotionType === 1 && (
                                            <>
                                                <br />
                                                <span>Rp. {numberWithCommas(item.qty * (item.price - discountPrice) - (item.qty * ((item.price - discountPrice)) * item.discountAmount) / 100)}</span>
                                                <br />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography variant="subtitle2">Total</Typography>
                        <Typography variant="subtitle2">Rp. {numberWithCommas(total)}</Typography>
                    </Stack>
                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                    <Stack>
                        <Typography variant="body2">Alasan:</Typography>
                        <Typography variant="subtitle2">{reason}</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <LoadingButton variant="contained" fullWidth loading={isLoading} onClick={() => handleRefund()}>Refund Rp. {numberWithCommas(total)}</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
