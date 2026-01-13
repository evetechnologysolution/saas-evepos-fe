import React, { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Button,
    Checkbox,
    Stack,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import ModalPayment from './ModalPayment';
// utils
import { numberWithCommas, formatDate2 } from '../../../../utils/getData';
// context
import { cashierContext } from "../../../../contexts/CashierContext";

// ----------------------------------------------------------------------

ModalSplitProduct.propTypes = {
    open: PropTypes.bool,
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

export default function ModalSplitProduct(props) {

    const ctx = useContext(cashierContext);

    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [afterSplit, setAfterSplit] = useState([]);

    useEffect(() => {
        if (props.open) {
            setOrders(ctx.bill)
        }
    }, [props.open])


    const [serviceCharge, setServiceCharge] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);
    const handleClosePayment = () => setOpenPayment(false);

    const handleCancel = () => {
        props.onClose();
        setTimeout(() => {
            setItems([]);
            setOrders([]);
            setServiceCharge(0);
            setTax(0);
        }, 1000);
    }

    const findQty = (field) => {
        const data = items.find((data) => data.id === field.id && JSON.stringify(data.variant) === JSON.stringify(field.variant));
        return data ? data.qty : 0;
    };

    const handleChecked = (e, item) => {
        if (e.target.checked) {
            setItems((arr) => [
                ...arr,
                {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty: item.splitQty ? item.qty - item.splitQty : item.qty,
                    category: item.category,
                    products: item.products,
                    promotionType: item.promotionType,
                    discountAmount: item.discountAmount,
                    section: item.section,
                    variant: item.variant,
                    status: item.status,
                }
            ])

            setOrders((curr) =>
                curr.map((row) =>
                    row.id === item.id && JSON.stringify(row.variant) === JSON.stringify(item.variant)
                        ? {
                            ...row,
                            splitQty: item.splitQty ? (item.splitQty + (item.qty - item.splitQty)) : item.qty,
                        }
                        : row
                )
            );

        } else {
            setItems((curr) => curr.filter((row) => row.id !== item.id || JSON.stringify(row.variant) !== JSON.stringify(item.variant)));

            setOrders((curr) =>
                curr.map((row) =>
                    row.id === item.id && row.variant === item.variant
                        ? {
                            ...row,
                            splitQty: item.splitQty ? item.splitQty : 0,
                        }
                        : row
                )
            );
        }
    };

    const handleDecrease = (field) => {
        setItems((curr) =>
            curr.map((item) =>
                item.id === field.id && JSON.stringify(item.variant) === JSON.stringify(field.variant)
                    ? {
                        ...item,
                        qty: Math.round(item.qty - 1),
                    }
                    : item
            )
        );

        setOrders((curr) =>
            curr.map((row) =>
                row.id === field.id && JSON.stringify(row.variant) === JSON.stringify(field.variant)
                    ? {
                        ...row,
                        splitQty: Math.round(row.splitQty - 1),
                    }
                    : row
            )
        );
    }

    const handleIncrease = (field) => {
        setItems((curr) =>
            curr.map((item) =>
                item.id === field.id && JSON.stringify(item.variant) === JSON.stringify(field.variant)
                    ? {
                        ...item,
                        qty: item.qty + 1,
                    }
                    : item
            )
        );

        setOrders((curr) =>
            curr.map((row) =>
                row.id === field.id && JSON.stringify(row.variant) === JSON.stringify(field.variant)
                    ? {
                        ...row,
                        splitQty: row.splitQty + 1,
                    }
                    : row
            )
        );
    }

    useEffect(() => {
        const sumPrice = items.reduce((acc, i) => {
            if (i.promotionType === 1) {
                return acc + (Math.round(i.price * i.qty) - (Math.round(i.price * i.qty) * i.discountAmount) / 100);
            }
            if (i.promotionType === 2) {
                return acc + (Math.round(i.price * i.qty) - i.discountAmount);
            }
            return acc + (Math.round(i.price * i.qty));
        }, 0);

        let serviceAmount = 0;
        let taxAmount = 0;
        const taxFor = ctx.orderType?.toLowerCase() === 'delivery' ? 'delivery' : 'onsite';

        if (ctx?.taxSetting?.serviceCharge?.isActive && ctx?.taxSetting?.serviceCharge?.orderType?.includes(taxFor)) {
            serviceAmount = (ctx.taxSetting.serviceCharge.percentage * sumPrice) / 100;
            setServiceCharge((ctx.taxSetting.serviceCharge.percentage * sumPrice) / 100);
        }

        if (ctx?.taxSetting?.tax?.isActive && ctx?.taxSetting?.tax?.orderType?.includes(taxFor)) {
            taxAmount = (ctx.taxSetting.tax.percentage * (sumPrice + serviceAmount)) / 100;
            setTax((ctx.taxSetting.tax.percentage * (sumPrice + serviceAmount)) / 100);
        }

        setTotal(sumPrice + serviceAmount + taxAmount);
    }, [items]);

    const handleSplit = () => {
        setOpenConfirm(true);
    };

    const handleSubmit = () => {
        ctx.setSplitAmount(total);
        ctx.setSplitBill(items);
        ctx.setSplitServiceCharge(serviceCharge);
        ctx.setSplitTax(tax);
        setAfterSplit(orders);
        handleCancel();
        setOpenConfirm(false);

        setTimeout(() => {
            setOpenPayment(true);
        }, 100);
    };

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="sm"
                open={props.open}
            >
                <DialogTitle id="customized-dialog-title" sx={{ m: 0, p: 2, borderBottom: "1px solid #ccc" }}>
                    Split Bill
                </DialogTitle>
                <DialogContent dividers>
                    <table style={{ width: '100%' }}>
                        <thead style={{ color: '#6c757d!important', fontSize: '0.9rem' }}>
                            <tr>
                                <th align="left">ITEMS</th>
                                <th width="100px">QUANTITY</th>
                                <th align="center">PRICE</th>
                                <th align="center">SPLIT</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.85rem' }}>
                            {ctx.bill.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '0.5rem 0' }}>
                                        <span>{item.name}</span>
                                        {item.variant &&
                                            item.promotionType !== 2 &&
                                            item.variant.map((variant, v) => (
                                                <p key={v} style={{ fontSize: '0.80rem', opacity: '0.7' }}>{variant.option}</p>
                                            ))}
                                        {item.splitQty > 0 && (
                                            <span style={{ color: 'red' }}>{`Telah dipisah x${item.splitQty}`}</span>
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
                                                    disabled={findQty(item) === (item.splitQty ? item.qty - item.splitQty : item.qty) ? Boolean(true) : Boolean(false)}
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
                                                <span style={{ color: 'red', textDecoration: 'line-through', opacity: 0.7 }}>
                                                    Rp. {numberWithCommas(Math.round((findQty(item) ? findQty(item) : item.qty) * item.price))}
                                                </span>
                                                <br />
                                                <span>
                                                    Rp. {numberWithCommas(((findQty(item) ? findQty(item) : item.qty)) * item.price - (Math.round(item.qty * item.price) * item.discountAmount) / 100)}
                                                </span>
                                            </>
                                        ) : (
                                            <span>Rp. {numberWithCommas(Math.round((findQty(item) ? findQty(item) : item.qty) * item.price))}</span>
                                        )}
                                    </td>
                                    <td align="center">
                                        <Checkbox
                                            disabled={item.splitQty && item.splitQty === item.qty ? Boolean(true) : Boolean(false)}
                                            onChange={(e) => handleChecked(e, item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {ctx.serviceCharge > 0 && (
                                <tr>
                                    <td colSpan={2}>Service Charge ({ctx.serviceChargePercentage}%)</td>
                                    <td align="center">Rp. {numberWithCommas(serviceCharge)}</td>
                                </tr>
                            )}
                            {ctx.tax > 0 && (
                                <tr>
                                    <td colSpan={2}>Tax ({ctx.taxPercentage}%)</td>
                                    <td align="center">Rp. {numberWithCommas(tax)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button variant="outlined" onClick={() => handleCancel()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={items.length > 0 ? Boolean(false) : Boolean(true)}
                        onClick={() => handleSplit()}
                    >
                        Split
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
                <DialogTitle sx={{ m: 0, p: 2, borderBottom: '1px solid #ccc' }}>
                    Split Bill Detail
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenConfirm(false)}
                        sx={{
                            position: 'absolute',
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
                        <Typography variant="body2">{ctx.displayOrderID}</Typography>
                    </Stack>
                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                    <table style={{ width: '100%' }}>
                        <tbody style={{ fontSize: '14px' }}>
                            {items.length > 0 && items.map((item, i) => (
                                <tr key={i}>
                                    <td>
                                        {item.name}
                                        {item.variant.length > 0 && item.variant.map((field, v) => (
                                            <span key={v}>
                                                <br />
                                                <em>{field.option}</em>
                                            </span>
                                        ))}
                                    </td>
                                    <td align="center">x{item.qty}</td>
                                    <td align="right">
                                        <span
                                            style={{
                                                color: item.promotionType === 1 ? 'red' : '#212B36',
                                                textDecoration: item.promotionType === 1 ? 'line-through' : 'none',
                                                opacity: item.promotionType === 1 ? 0.7 : 1
                                            }}
                                        >
                                            Rp. {numberWithCommas(Math.round(item.qty * item.price))}
                                        </span>
                                        {item.promotionType === 1 && (
                                            <>
                                                <br />
                                                <span>Rp. {numberWithCommas(Math.round(item.qty * item.price) - (Math.round(item.qty * item.price) * item.discountAmount) / 100)}</span>
                                                <br />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {ctx.serviceCharge > 0 && (
                                <tr>
                                    <td colSpan={2}>Service Charge ({ctx.serviceChargePercentage}%)</td>
                                    <td align="right">Rp. {numberWithCommas(serviceCharge)}</td>
                                </tr>
                            )}
                            {ctx.tax > 0 && (
                                <tr>
                                    <td colSpan={2}>Tax ({ctx.taxPercentage}%)</td>
                                    <td align="right">Rp. {numberWithCommas(tax)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography variant="subtitle2">Total</Typography>
                        <Typography variant="subtitle2">Rp. {numberWithCommas(total)}</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" fullWidth onClick={() => handleSubmit()}>Split Rp. {numberWithCommas(total)}</Button>
                </DialogActions>
            </Dialog>

            <ModalPayment
                open={openPayment}
                onClose={handleClosePayment}
                afterSplit={afterSplit}
            />
        </>
    );
}
