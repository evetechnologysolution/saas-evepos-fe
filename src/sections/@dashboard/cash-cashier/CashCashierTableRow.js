import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
// @mui
import {
  styled,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableRow,
  TableCell,
  MenuItem,
  Grid,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../../utils/axios';
// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
import { TableMoreMenu } from '../../../components/table';
import CashCashierPrint from './CashCashierPrint';
// hooks
import useAuth from '../../../hooks/useAuth';
// utils
import { formatDate, formatDate2, formatOnlyTime, numberWithCommas } from '../../../utils/getData';

// ----------------------------------------------------------------------

OrdersTableRow.propTypes = {
  row: PropTypes.object,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

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

export default function OrdersTableRow({ row, onDeleteRow }) {
  const {
    startDate,
    endDate,
    cashIn,
    sales,
    cashOut,
    tax,
    serviceCharge,
    refund,
    detail,
    total,
    history,
    isOpen,
    notes,
  } = row;

  const eWallet = detail.dana + detail.ovo + detail.shopeePay + detail.qris;
  const card = detail.bri + detail.bni + detail.bca + detail.mandiri;

  const closeCashier = history.find((item) => item.title === 'Tutup Kas' && item.isCashOut === true);
  const fixCashOut = closeCashier ? cashOut - closeCashier.amount : cashOut;
  const expected = detail.cash + cashIn + eWallet + card - fixCashOut;

  const { user } = useAuth();

  const [openAction, setOpenAction] = useState(null);
  const [orders, setOrders] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  const [openDetail, setOpenDetail] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  // Print
  const printRef = useRef();
  const printContent = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = async () => {
    try {
      setPrintLoading(true);
      const response = await axios.get(`/order/close-cashier?start=${startDate}&end=${endDate}`);
      if (response.status === 200) {
        setOrders(response.data.docs);
      }
      setTimeout(() => {
        printContent();
        setPrintLoading(false);
        setOpenDetail(false);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setPrintLoading(false);
    }
  };

  return (
    <>
      <CustomTableRow>
        <TableCell align="center">
          {formatDate(startDate)}, {formatOnlyTime(startDate)}
        </TableCell>
        <TableCell align="center">{`Rp. ${numberWithCommas(cashIn)}`}</TableCell>
        <TableCell align="center">{`Rp. ${numberWithCommas(sales)}`}</TableCell>
        <TableCell align="center">{`Rp. ${numberWithCommas(cashOut)}`}</TableCell>
        <TableCell align="center">{`Rp. ${numberWithCommas(total)}`}</TableCell>
        <TableCell align="center">
          {endDate ? (
            <>
              {formatDate(endDate)}, {formatOnlyTime(endDate)}
            </>
          ) : (
            '-'
          )}
        </TableCell>
        <TableCell align="center">
          <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
            <CashCashierPrint ref={printRef} content={row} items={orders} />
          </div>
          <TableMoreMenu
            open={openAction}
            onOpen={handleOpenAction}
            onClose={handleCloseAction}
            actions={
              <>
                <MenuItem onClick={() => setOpenDetail(true)}>
                  <Iconify icon="fluent:text-bullet-list-square-sparkle-24-regular" sx={{ width: 24, height: 24 }} />
                  Detail
                </MenuItem>
                <MenuItem onClick={() => setOpenHistory(true)}>
                  <Iconify icon="fluent:apps-list-detail-24-regular" sx={{ width: 24, height: 24 }} />
                  History
                </MenuItem>
                <MenuItem
                  disabled={isOpen || printLoading ? Boolean(true) : Boolean(false)}
                  onClick={() => handlePrint()}
                >
                  <Iconify icon="solar:printer-outline" sx={{ width: 24, height: 24 }} />
                  {printLoading ? 'Loading...' : 'Print'}
                </MenuItem>
                {user.role === 'Super Admin' && (
                  <MenuItem
                    sx={{ color: 'red' }}
                    onClick={() => {
                      onDeleteRow();
                    }}
                    disabled={isOpen ? Boolean(true) : Boolean(false)}
                  >
                    <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                    Delete
                  </MenuItem>
                )}
              </>
            }
          />
        </TableCell>
      </CustomTableRow>

      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        fullWidth
        maxWidth="md"
        open={openDetail}
        className="detail-cash"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpenDetail(false)}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          Detail
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box p={1} borderRadius="8px" bgcolor="#F4F6F8">
            <Stack direction="row" justifyContent="space-evenly" alignItems="center">
              <Stack alignItems="center">
                <Typography variant="subtitle2">Start Shift</Typography>
                <Typography variant="subtitle1">{formatDate2(startDate)}</Typography>
              </Stack>
              <Stack alignItems="center">
                <Typography variant="subtitle2">End Shift</Typography>
                <Typography variant="subtitle1">{endDate ? formatDate2(endDate) : '-'}</Typography>
              </Stack>
            </Stack>
          </Box>
          <br />
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <i>#Kas Kasir</i>
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">Sales</Typography>
                    <Typography variant="body1">Cash In</Typography>
                    <Typography variant="body1">Cash Out</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(sales)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(cashIn)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(fixCashOut)}`}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <br />
              <Grid container>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="subtitle1">Cash</Typography>
                    <Typography variant="subtitle1">E-Wallet</Typography>
                    <Typography variant="subtitle1">Card</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(detail.cash)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(eWallet)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(card)}`}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <i>#Pajak & Lain-lain</i>
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">Tax</Typography>
                    <Typography variant="body1">Service Charge</Typography>
                    <Typography variant="body1">Refund</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(tax)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(serviceCharge)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(refund)}`}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <br />
              <Typography variant="subtitle1">
                <i>#Setor Tunai</i>
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">{`(Diharapkan)`}</Typography>
                    <Typography variant="body1">{`(Realisasi)`}</Typography>
                    <Typography variant="subtitle1">
                      <i>#Selisih</i>
                    </Typography>
                    {notes && (
                      <Typography variant="subtitle1">
                        <i>*Catatan</i>
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(expected)}`}</Typography>
                    <Typography variant="body1">: {`Rp. ${numberWithCommas(closeCashier?.amount || 0)}`}</Typography>
                    <Typography variant="body1">
                      : {`Rp. ${numberWithCommas((closeCashier?.amount || 0) - expected)}`}
                    </Typography>
                    {notes && (
                      <Typography variant="body1">
                        : <i>{notes}</i>
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            variant="contained"
            loading={printLoading}
            disabled={isOpen || printLoading ? Boolean(true) : Boolean(false)}
            onClick={() => handlePrint()}
          >
            <Iconify icon="solar:printer-outline" sx={{ width: 24, height: 24, mr: 1 }} />
            Print Detail
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        fullWidth
        maxWidth="sm"
        open={openHistory}
        className="detail-cash"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpenHistory(false)}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          History
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <table style={{ width: '100%' }}>
            <thead style={{ color: '#6c757d!important', fontSize: '0.9rem' }}>
              <tr>
                <th align="center">DATE</th>
                <th align="left">TRANSACTION NAME</th>
                <th align="center">AMOUNT</th>
                <th align="center">TYPE</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {history.length > 0 ? (
                <>
                  <tr>
                    <td align="center" style={{ padding: '0.5rem 0' }}>
                      {/* {endDate ? formatDate2(endDate) : formatDate2(startDate)} */}
                      {formatDate2(startDate)}
                    </td>
                    <td align="left" style={{ textTransform: 'capitalize' }}>
                      Sales
                    </td>
                    <td align="center">Rp. {numberWithCommas(sales)}</td>
                    <td align="center">
                      <Label variant="ghost" color="warning" sx={{ textTransform: 'capitalize' }}>
                        Sales
                      </Label>
                    </td>
                  </tr>
                  {history.map((item, i) => (
                    <tr key={i}>
                      <td align="center" style={{ padding: '0.5rem 0' }}>
                        {formatDate2(item.date)}
                      </td>
                      <td align="left" style={{ textTransform: 'capitalize' }}>
                        {item.title}
                      </td>
                      <td align="center">Rp. {numberWithCommas(item.amount)}</td>
                      <td align="center">
                        <Label
                          variant="ghost"
                          color={item.isCashOut ? 'error' : 'success'}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {item.isCashOut ? 'Cash Out' : 'Cash In'}
                        </Label>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td align="center" colSpan={4} style={{ padding: '0.5rem 0' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
