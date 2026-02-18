import React, { useState, useContext, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { NumericFormat } from 'react-number-format';
// @mui
import { Box, Button, InputAdornment, TextField, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useReactToPrint } from 'react-to-print';
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
// import { mainContext } from "../../../../contexts/MainContext";
// utils
// import { numberWithCommas, randomCustomer } from "../../../../utils/getData";
import { numberWithCommas } from '../../../../utils/getData';
// components
import Scrollbar from '../../../../components/Scrollbar';
import PrintReceipt from './PrintReceipt';

// ----------------------------------------------------------------------

export default function FinishForm() {
  const ctx = useContext(cashierContext);
  // const ctm = useContext(mainContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isDonate, setIsDonate] = useState(false);
  const [donation, setDonation] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const handleNewBill = () => {
    ctx.handleResetPos();
    // if (!ctm.generalSettings?.dineIn?.table && !ctm.generalSettings?.dineIn?.customer) {
    //     ctx.setCustomerName(randomCustomer());
    // }
    setTimeout(() => {
      setIsSubmit(false);
      setIsDonate(false);
      setDonation(0);
    }, 500);
  };

  const handlePay = () => {
    ctx.setDonation(0);
    ctx.setSplitAmount(0);
    ctx.setSplitBill([]);
    ctx.setIsFinished(false);
    setTimeout(() => {
      setIsSubmit(false);
      setIsDonate(false);
      setDonation(0);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch(`/order/raw/${ctx.currentOrderID}`, { donation });
      enqueueSnackbar('Submit donation success!');
      setIsSubmit(true);
    } catch (error) {
      console.error('Error submitting donation:', error);
      enqueueSnackbar('Failed to submit donation. Please try again.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Print
  const printRef = useRef();
  const handleAfterPrint = () => {
    ctx.updatePrintCount(ctx.currentOrderID, { staff: user?.fullname });
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: handleAfterPrint,
  });

  return (
    <Box sx={{ height: '75vh' }}>
      <Scrollbar>
        <Stack height="75vh" py="1vw" justifyContent="center" alignItems="center" position="relative">
          <Box position="absolute" top={0} right={0}>
            <Button variant="contained" size="large" onClick={handleNewBill}>
              New Bill
            </Button>
          </Box>
          <Box mt={3}>
            <Typography align="center" variant="subtitle1" color="primary">
              Payment Success!
            </Typography>
            <Typography align="center" variant="h3" mt={2}>
              Rp. {numberWithCommas(ctx.amountPaid - ctx.amountBill)} Change
            </Typography>
            <Typography align="center" variant="subtitle1">
              Out of Rp. {numberWithCommas(ctx.amountPaid)}
            </Typography>
            <Typography align="center" variant="subtitle1" my={3}>
              Customer ingin donasi?
            </Typography>
            <Stack justifyContent="center" alignItems="center">
              {!isSubmit ? (
                isDonate ? (
                  <form onSubmit={handleSubmit}>
                    <Stack flexDirection="row" justifyContent="center" alignItems="center" gap={1}>
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
                          inputProps: { style: { textAlign: 'right' } },
                        }}
                        fullWidth
                        value={donation ? Number(donation) : ''}
                        onValueChange={(values) => {
                          setDonation(Number(values.value));
                          ctx.setDonation(Number(values.value));
                        }}
                        required
                      />
                      <div>
                        <LoadingButton variant="contained" type="submit" loading={isLoading}>
                          Donate
                        </LoadingButton>
                      </div>
                    </Stack>
                  </form>
                ) : (
                  <Button variant="contained" onClick={() => setIsDonate(true)}>
                    Yes
                  </Button>
                )
              ) : (
                <Typography align="center" variant="subtitle1">
                  Telah donasi Rp. {numberWithCommas(ctx.donation)}
                </Typography>
              )}
            </Stack>

            <Typography align="center" variant="subtitle1" my={3}>
              Ingin cetak nota?
            </Typography>
            <Box textAlign="center">
              <Button
                variant="contained"
                color="info"
                size="large"
                sx={{ width: '15rem' }}
                onClick={() => handlePrint()}
              >
                Print Receipt
              </Button>
            </Box>
            <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
              <PrintReceipt ref={printRef} bill={ctx.bill} />
            </div>
          </Box>
          {ctx.splitAmount > 0 && ctx.totalPrice > 0 && (
            <>
              <Box width="100%" mt={5} mx={5} sx={{ borderTop: '2px solid #ccc' }} />
              <Box
                width="100%"
                maxWidth={400}
                mx="auto"
                mt={5}
                sx={{ p: 3, border: '2px solid #ccc', borderRadius: '10px' }}
              >
                <Typography variant="h5" mb={1}>
                  Split Bill
                </Typography>
                <table style={{ width: '100%', textAlign: 'left' }}>
                  <tbody>
                    <tr>
                      <td>
                        <Typography variant="subtitle1" mb={1}>
                          Order ID
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle1" mb={1}>
                          : {ctx.displayOrderID || ctx.currentOrderID}
                        </Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant="subtitle1" mb={1}>
                          Split Amount
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle1" mb={1} color="primary">
                          : Rp. {numberWithCommas(ctx.splitAmount)}
                        </Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant="subtitle1" mb={1}>
                          Remaining
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle1" mb={1} color="error">
                          : Rp. {numberWithCommas(ctx.totalPrice)}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Box textAlign="center">
                  <Button variant="contained" color="error" onClick={() => handlePay()}>
                    Pay
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </Scrollbar>
    </Box>
  );
}
