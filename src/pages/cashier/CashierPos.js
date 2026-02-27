import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Card, Container, Button, Grid, Typography, Stack, Tooltip, Menu, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
// react-to-print
import { useReactToPrint } from 'react-to-print';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
// sections
import {
  Bill,
  ModalSavedBill,
  ModalInputCustomer,
  ModalScanCustomer,
  ModalInputVoucher,
  ModalSplitProduct,
  ModalSplitTotal,
  ModalPayment,
  FinishForm,
} from '../../sections/@dashboard/cashier/pos';
import { ModalCashCashier, ModalAlertCashCashier } from '../../sections/@dashboard/cash-cashier';
// context
import { cashierContext } from '../../contexts/CashierContext';
import { mainContext } from '../../contexts/MainContext';
// utils
// import { numberWithCommas, formatDay, randomCustomer } from "../../utils/getData";
import { generateRandomId } from '../../utils/generateRandom';
import { numberWithCommas, formatDay } from '../../utils/getData';
import CashierPosProduct from './CashierPosProduct';
import PrintReceipt from '../../sections/@dashboard/cashier/pos/PrintReceipt';

// ----------------------------------------------------------------------

export default function CashierPos() {
  const ctx = useContext(cashierContext);
  const ctm = useContext(mainContext);

  const theme = useTheme();

  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const [openInputCustomer, setOpenInputCustomer] = useState(false);
  const [openScanCustomer, setOpenScanCustomer] = useState(false);

  const [openInputVoucher, setOpenInputVoucher] = useState(false);

  const [isPrint, setIsPrint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currUid, setCurrUid] = useState('');

  const handleOpenInput = () => {
    return setOpenInputCustomer(true);
  };

  const [openSavedBill, setOpenSavedBill] = useState(false);
  const handleOpenSavedBill = () => setOpenSavedBill(true);
  const handleCloseSavedBill = () => setOpenSavedBill(false);

  // for open cashier
  const [openCashier, setOpenCashier] = useState(false);

  // for alert cashier
  const [alertCashier, setAlertCashier] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await ctm.getGeneralSettings();
      await ctm.getExistCash();

      if (ctm.generalSettings?.cashBalance && !ctm.existCash?.isOpen) {
        setOpenCashier(true);
      }

      const today = new Date().setHours(0, 0, 0, 0);
      const openDate = new Date(ctm.existCash?.startDate).setHours(0, 0, 0, 0);

      if (
        ctm.generalSettings?.cashBalance &&
        ctm.existCash?.isOpen &&
        new Date(today).getTime() > new Date(openDate).getTime()
      ) {
        setAlertCashier(true);
      }

      // if (!ctm.generalSettings?.dineIn?.table && !ctm.generalSettings?.dineIn?.customer && !ctx.currentOrderID) {
      //     ctx.setCustomerName(randomCustomer());
      // }

      // if (ctm.generalSettings?.dineIn?.table && !ctx.currentOrderID) {
      //     ctx.setCustomerName("");
      // }

      // if (!ctm.generalSettings?.dineIn?.table && ctm.generalSettings?.dineIn?.customer && !ctx.currentOrderID) {
      //     ctx.setCustomerName("");
      // }
    };

    fetchData(); // Call the fetchData function
  }, []);

  // for select order type
  const handleSelectType = (value) => {
    ctx.setOrderType(value);
    // return setOpenInputCustomer(true);
  };

  // split bill
  const splitType = ['by Product', 'by Amount'];
  const [byProduct, setByProduct] = useState(false);
  const [byTotal, setByTotal] = useState(false);
  const [anchorSplit, setAnchorSplit] = useState(null);
  const splitOpen = Boolean(anchorSplit);

  const handleCloseSplit = () => {
    setAnchorSplit(null);
  };

  const handleSelectSplitType = (value) => {
    if (value === 'by Product') {
      setByProduct(true);
    } else {
      setByTotal(true);
    }
    handleCloseSplit();
  };

  const [openPayment, setOpenPayment] = useState(false);
  const handleClosePayment = () => setOpenPayment(false);
  const handleOpenPayment = () => {
    if (ctx.bill.length === 0) {
      return enqueueSnackbar('Bill masing kosong!', { variant: 'error' });
    }
    if (ctx.orderType === '') {
      return enqueueSnackbar('Tipe order belum dipilih!', { variant: 'error' });
    }
    if (ctx.dp > 0 && ctx.totalPrice < 0) {
      return enqueueSnackbar(`Minimal total order senilai Rp. ${numberWithCommas(ctx.dp)}!`, { variant: 'error' });
    }
    if (ctx.customerName === '') {
      enqueueSnackbar('Silakan isi customer terlebih dahulu!', { variant: 'error' });
      return setOpenInputCustomer(true);
    }
    return setOpenPayment(true);
  };

  // Print
  const printRef = useRef();
  const handleAfterPrint = () => {
    if (currUid) {
      ctx.updatePrintCount(currUid, { staff: user?.fullname });
      setIsPrint(false);
      ctx.handleResetPos();
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    if (isPrint) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isPrint]);

  // Check status network
  // const [isOnline, setIsOnline] = useState(navigator.onLine);

  // useEffect(() => {
  //     // Update network status
  //     const handleStatusChange = () => {
  //         setIsOnline(navigator.onLine);
  //     };

  //     // Listen to the online status
  //     window.addEventListener("online", handleStatusChange);

  //     // Listen to the offline status
  //     window.addEventListener("offline", handleStatusChange);

  //     // Specify how to clean up after this effect for performance improvment
  //     return () => {
  //         window.removeEventListener("online", handleStatusChange);
  //         window.removeEventListener("offline", handleStatusChange);
  //     };
  // }, [isOnline]);

  const handleSave = async () => {
    if (ctx.bill.length === 0) {
      return enqueueSnackbar('Bill masing kosong!', { variant: 'error' });
    }
    if (ctx.orderType === '') {
      return enqueueSnackbar('Tipe order belum dipilih!', { variant: 'error' });
    }
    if (ctx.dp > 0 && ctx.totalPrice < 0) {
      return enqueueSnackbar(`Minimal total order senilai Rp. ${numberWithCommas(ctx.dp)}!`, { variant: 'error' });
    }
    if (ctx.customerName === '') {
      enqueueSnackbar('Silakan isi customer terlebih dahulu!', { variant: 'error' });
      return setOpenInputCustomer(true);
    }

    if (ctx.isSaved) {
      return handlePrint();
    }

    if (ctx.bill.length > 0) {
      setIsLoading(true);

      if (ctx.currentOrderID !== '') {
        let objData = {
          orders: ctx.bill,
          orderType: ctx?.orderType || 'onsite',
          serviceChargePercentage: ctx.serviceChargePercentage,
          serviceCharge: ctx.serviceCharge,
          taxPercentage: ctx.taxPercentage,
          tax: ctx.tax,
          discountPrice: ctx.discountPrice,
          billedAmount: ctx.actualPrice,
          productionAmount: ctx.productionAmount,
          isScan: ctx?.customerScan || false,
        };
        if (ctx.customerName) {
          objData = Object.assign(objData, {
            customer: {
              ...(ctx.customerData || {}), // Pastikan customerData bukan undefined/null
              memberId: undefined, // reset karena dicek lagi di BE
              name: ctx.customerName,
              phone: ctx.customerPhone,
              notes: ctx.customerNotes,
              isNew: ctx?.customerNew || false,
            },
          });
        }
        await ctx.updateOrders(ctx.currentOrderID, objData);
        enqueueSnackbar('Update success!');
      } else {
        const orderUid = uuid(); // for orders _id
        const orderId = generateRandomId(6);

        setCurrUid(orderUid);
        ctx.setDisplayOrderID(orderId);

        let objData = {
          // _id: orderUid,
          tempId: orderUid,
          // date: combinedDateTime(ctx?.orderDate || new Date()),
          createdAt: ctx?.orderDate,
          orderId,
          staff: user?.fullname,
          orders: ctx.bill,
          orderType: ctx?.orderType || 'onsite',
          status: 'unpaid',
          serviceChargePercentage: ctx.serviceChargePercentage,
          serviceCharge: ctx.serviceCharge,
          taxPercentage: ctx.taxPercentage,
          tax: ctx.tax,
          billedAmount: ctx.actualPrice,
          productionAmount: ctx.productionAmount,
          payment: '',
          cardNumber: '',
          notes: '',
          isScan: ctx?.customerScan || false,
        };
        if (ctx.customerName) {
          objData = Object.assign(objData, {
            customer: {
              ...(ctx.customerData || {}), // Pastikan customerData bukan undefined/null
              memberId: undefined, // reset karena dicek lagi di BE
              name: ctx.customerName,
              phone: ctx.customerPhone,
              notes: ctx.customerNotes,
              isNew: ctx?.customerNew || false,
            },
          });
        }
        await ctx.createOrders(objData);
        enqueueSnackbar('New order has been saved!');
        setIsPrint(true);
        ctx.setIsSaved(true);
      }

      setIsLoading(false);
    }

    return null;
  };

  const handleVoucher = async () => {
    if (ctx.customerName === '' || ctx.customerPhone === '') {
      enqueueSnackbar('Silakan isi nama dan nomor customer terlebih dahulu!', { variant: 'error' });
      return setOpenInputCustomer(true);
    }

    return setOpenInputVoucher(true);
  };

  const handleResetBill = () => {
    ctx.handleResetPos();
  };

  return (
    <Page title="Pos">
      <Card
        sx={{
          padding: '2vw 0',
          margin: '0 5vw',
          boxShadow: '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
        }}
      >
        <Container maxWidth={themeStretch ? false : 'xl'}>
          {!ctx.isFinished && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7} sx={{ height: '71vh' }}>
                <CashierPosProduct />
              </Grid>

              <Grid item xs={12} md={5}>
                <Card
                  sx={{
                    height: '78vh',
                    position: 'relative',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;',
                    marginRight: '1vw',
                  }}
                >
                  <Stack flexDirection="row">
                    <Tooltip title="Local Orders" placement="top" arrow>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          boxShadow: 0,
                          p: 0,
                          width: 50,
                          height: 80,
                          overflow: 'hidden',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                        onClick={() => handleOpenSavedBill()}
                      >
                        <Iconify icon="dashicons:menu" width={30} height={30} />
                      </Button>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ boxShadow: 0, p: 0, width: '100%', height: 80, overflow: 'hidden', borderRadius: 0 }}
                      onClick={() => handleOpenInput()}
                    >
                      <div style={{ width: 50 }} />
                      <Stack>
                        <Typography variant="body2">{formatDay(new Date(), 'en-ID')}</Typography>
                        <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
                          <span style={{ fontSize: '22px' }}>{ctx.customerName || 'Customer'}</span>
                          <Iconify icon="ph:note-pencil-bold" width={24} height={24} />
                        </Stack>
                      </Stack>
                    </Button>
                    <Tooltip title="Scan Customer" placement="top" arrow>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          boxShadow: 0,
                          p: 0,
                          width: 50,
                          height: 80,
                          overflow: 'hidden',
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                        onClick={() => setOpenScanCustomer(true)}
                      >
                        <Iconify icon="si:barcode-scan-alt-line" width={30} height={30} />
                      </Button>
                    </Tooltip>
                  </Stack>

                  <Stack flexDirection="row" px={1} mt={1} gap={1}>
                    <Typography variant="body2">Status:</Typography>
                    <Label variant="ghost" color={ctx.customerScan ? 'success' : 'warning'}>
                      {ctx.customerScan
                        ? `Sudah Scan | Total Point: ${numberWithCommas(ctx.customerPoint || 0)}`
                        : 'Tidak Scan'}
                    </Label>
                  </Stack>

                  <Stack flexDirection="row" justifyContent="space-between" px={1} mt={1}>
                    <Stack flexDirection="row" gap={1} bgcolor={theme.palette.primary.light} p={1} borderRadius={100}>
                      <Button
                        variant={ctx.orderType === 'onsite' ? 'contained' : 'text'}
                        size="medium"
                        sx={{
                          borderRadius: 100,
                          boxShadow: 0,
                          p: 0,
                          minWidth: 100,
                          overflow: 'hidden',
                          color: 'white',
                        }}
                        onClick={() => handleSelectType('onsite')}
                      >
                        Onsite
                      </Button>
                      {/* <Button
                                                variant={ctx.orderType !== "onsite" ? "contained" : "text"}
                                                size="medium"
                                                sx={{ borderRadius: 100, boxShadow: 0, p: 0, minWidth: 100, overflow: "hidden", color: "white" }}
                                                onClick={() => handleSelectType("delivery")}
                                            >
                                                Delivery
                                            </Button> */}
                    </Stack>
                    <Tooltip title="Reset Data" placement="top" arrow>
                      <Button
                        color="error"
                        variant="contained"
                        size="medium"
                        sx={{
                          borderRadius: 100,
                          boxShadow: 0,
                          p: 0,
                          minWidth: 100,
                          overflow: 'hidden',
                          bgcolor: '#FFC2B4',
                          color: 'red',
                          '&:hover': {
                            bgcolor: '#FFC2B4',
                          },
                        }}
                        onClick={() => handleResetBill()}
                      >
                        <Iconify icon="mdi:reload" width={20} height={20} sx={{ mr: 0.5 }} />
                        Reset
                      </Button>
                    </Tooltip>
                  </Stack>

                  <Box sx={{ height: '50vh' }}>
                    <Scrollbar>
                      <Container>
                        <Bill />
                      </Container>
                    </Scrollbar>
                  </Box>

                  <Box sx={{ position: 'absolute', bottom: '0', width: '100%' }}>
                    <Container sx={{ height: '100%', bgcolor: 'white' }}>
                      {ctx.subtotalPrice > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Subtotal
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.subtotalPrice)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.serviceCharge > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Service Charge ({ctx.serviceChargePercentage}%)
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.serviceCharge)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.tax > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Tax ({ctx.taxPercentage}%)
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.tax)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.voucherDiscPrice > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Voucher Discount
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.voucherDiscPrice)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.discountPrice > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          {/* <Typography variant="body2" ml={1}>Discount {ctx.discount ? `(${ctx.discount}% ${ctx.discountLabel})` : ""}</Typography> */}
                          <Typography variant="body2" ml={1}>
                            Discount {ctx.discountLabel ? `(${ctx.discountLabel})` : ''}
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.discountPrice)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.deliveryPrice > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Delivery Fee
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.deliveryPrice)}
                          </Typography>
                        </Stack>
                      )}
                      {ctx.havePaid > 0 && (
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" ml={1}>
                            Telah Dibayar
                          </Typography>
                          <Typography variant="body2" mr={1}>
                            Rp. {numberWithCommas(ctx.havePaid)}
                          </Typography>
                        </Stack>
                      )}
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="subtitle2" ml={1}>
                          TOTAL
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" mr={1}>
                          Rp. {numberWithCommas(ctx.totalPrice)}
                        </Typography>
                      </Stack>
                    </Container>
                    <Stack
                      flexDirection="row"
                      justifyContent="space-between"
                      mt={1}
                      p={1}
                      sx={{ backgroundColor: '#F4F6F9' }}
                    >
                      <Stack flexDirection="row">
                        <LoadingButton
                          size="large"
                          variant="contained"
                          sx={{
                            boxShadow: 0,
                            overflow: 'hidden',
                            bgcolor: theme.palette.primary.light,
                            // borderRadius: "8px 0px 0px 8px",
                          }}
                          disabled={ctx.bill.length > 0 && !isLoading ? Boolean(false) : Boolean(true)}
                          loading={isLoading}
                          onClick={() => handleSave()}
                        >
                          {ctx.currentOrderID !== '' ? 'Update' : 'Save'}
                        </LoadingButton>
                        {/* <Button
                                                    size="large"
                                                    variant="contained"
                                                    sx={{
                                                        boxShadow: 0,
                                                        overflow: "hidden",
                                                        bgcolor: theme.palette.primary.light,
                                                        borderRadius: "0px 8px 8px 0px",
                                                    }}
                                                    disabled={ctx.bill.length > 0 ? Boolean(false) : Boolean(true)}
                                                    onClick={() => handleVoucher()}
                                                >
                                                    Voucher
                                                </Button> */}
                      </Stack>
                      <Stack flexDirection="row" justifyContent="space-between">
                        <Menu anchorEl={anchorSplit} open={splitOpen} onClose={handleCloseSplit}>
                          {splitType.map((item, i) => (
                            <MenuItem key={i} onClick={() => handleSelectSplitType(item)}>
                              {item}
                            </MenuItem>
                          ))}
                        </Menu>
                        {/* <Button
                                                    variant="contained"
                                                    size="large"
                                                    sx={{
                                                        boxShadow: 0,
                                                        overflow: "hidden",
                                                        bgcolor: theme.palette.primary.light,
                                                        borderRadius: "8px 0px 0px 8px",
                                                    }}
                                                    disabled={ctx.currentOrderID && ctx.totalPrice > 0 ? Boolean(false) : Boolean(true)}
                                                    onClick={handleOpenSplit}
                                                >
                                                    Split
                                                </Button> */}
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            // borderRadius: "0px 8px 8px 0px",
                            boxShadow: '0',
                            overflow: 'hidden',
                          }}
                          onClick={() => handleOpenPayment()}
                        >
                          <Iconify icon="solar:dollar-linear" sx={{ mr: 1 }} width={24} height={24} />
                          Proceed to Pay
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
          {ctx.isFinished && <FinishForm />}
        </Container>

        <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
          <PrintReceipt ref={printRef} bill={ctx.bill} status="pending" />
        </div>
      </Card>

      <ModalInputCustomer open={openInputCustomer} onClose={() => setOpenInputCustomer(false)} />

      <ModalScanCustomer open={openScanCustomer} onClose={() => setOpenScanCustomer(false)} />

      <ModalInputVoucher open={openInputVoucher} onClose={() => setOpenInputVoucher(false)} />

      <ModalSplitProduct open={byProduct} onClose={() => setByProduct(false)} />

      <ModalSplitTotal open={byTotal} onClose={() => setByTotal(false)} />

      <ModalSavedBill open={openSavedBill} onClose={handleCloseSavedBill} />

      <ModalPayment open={openPayment} onClose={handleClosePayment} />

      <ModalCashCashier
        open={openCashier}
        onClose={() => setOpenCashier(false)}
        addTransaction={ctm.existCash?.isOpen}
        required
      />

      <ModalAlertCashCashier open={alertCashier} />
    </Page>
  );
}
