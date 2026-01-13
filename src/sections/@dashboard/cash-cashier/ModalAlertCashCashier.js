import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  IconButton,
  styled,
  Grid,
  Stack,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------
ModalAlertCashCashier.propTypes = {
  open: PropTypes.bool,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalAlertCashCashier(props) {
  const navigate = useNavigate();

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="xs" open={props.open}>
      <DialogTitle sx={{ m: 0, p: 2, borderBottom: '1px solid #ccc' }}>
        Alert
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={12}>
            <Alert severity="error">
              <span>Silakan cek module</span>
              <Link
                sx={{ mx: 0.5, cursor: "pointer" }}
                variant="subtitle2"
                underline="hover"
                onClick={() => navigate(PATH_DASHBOARD.cashCashier.root)}
              >
                Cash Cashier
              </Link>
              <span>untuk tutup kas dan buka yang baru. Sebelumnya pastikan semua transaksi di module</span>
              <Link
                sx={{ mx: 0.5, cursor: "pointer" }}
                variant="subtitle2"
                underline="hover"
                onClick={() => navigate(PATH_DASHBOARD.cashier.orders)}
              >
                Orders
              </Link>
              <span>sudah <b>dibayar</b> semua.</span>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
    </BootstrapDialog>
  );
}
