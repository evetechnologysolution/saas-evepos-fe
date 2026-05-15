import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
import useTransfer from '../../../../pages/cashier/service/useTransfer';
// utils
import { handleMutationFeedback } from '../../../../utils/mutationfeedback';

// ----------------------------------------------------------------------

ModalTransfer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  actionCode: PropTypes.number,
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

export default function ModalTransfer(props) {
  const { data, open, onClose, actionCode } = props;

  const { updateRaw } = useTransfer();

  const { enqueueSnackbar } = useSnackbar();

  const [staff, setStaff] = useState("");

  const transferConfig = {
    1: {
      status: "accepted",
      notes: "Transfer Order Diterima",
    },
    2: {
      status: "return",
      notes: "Transfer Order Dikembalikan ke Outlet Asal",
    },
    3: {
      status: "closed",
      notes: "Transfer Order Diterima di Outlet Asal",
    },
  };

  const currentTransfer = transferConfig[actionCode] || {
    status: "open",
    notes: "Transfer Order",
  };

  const { status, notes } = currentTransfer;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStaff("");
    }, 500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!notes || !staff) return;
    try {
      const objData = {
        transfer: {
          updatedAt: new Date(),
          status,
          newLog: {
            notes,
            staff
          }
        }
      };
      const mutation = updateRaw.mutateAsync({ id: data?._id, payload: objData });
      await handleMutationFeedback(mutation, {
        successMsg: `Update Transfer Order ${data?.orderId} success!`,
        errorMsg: `Update Transfer Order ${data?.orderId} failed!`,
        onSuccess: () => {
          handleClose();
        },
        enqueueSnackbar,
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Transfer failed!', { variant: 'error' });
    }
  };

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="xs" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          Transfer Order
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSave}>
            <Stack gap={2}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                value={notes}
                disabled
                required
              />
              <TextField
                name="staff"
                label="Staff"
                fullWidth
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                required
              />
              <Stack alignItems="center">
                <LoadingButton
                  variant="contained"
                  loading={updateRaw?.isLoading}
                  type="submit"
                >
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
