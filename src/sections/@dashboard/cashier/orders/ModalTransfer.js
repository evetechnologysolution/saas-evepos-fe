import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
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
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
import useOutlet from '../../../../pages/outlet/service/useOutlet';
import useOrder from '../../../../pages/cashier/service/useOrder';
// utils
import { handleMutationFeedback } from '../../../../utils/mutationfeedback';
// contexts
import { mainContext } from '../../../../contexts/MainContext';

// ----------------------------------------------------------------------

ModalTransfer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
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
  const { data, open, onClose } = props;

  const ctm = useContext(mainContext);
  const { updateRaw } = useOrder();

  const { list: listOulet } = useOutlet();
  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  const { enqueueSnackbar } = useSnackbar();

  const [outletDesti, setOutletDesti] = useState("");
  const [staff, setStaff] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setOutletDesti("");
    }, 500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!outletDesti || !staff) return;
    try {
      const today = new Date();
      const objData = {
        transfer: {
          toOutletRef: outletDesti,
          createdAt: today,
          updatedAt: today,
          status: "open",
          newLog: {
            notes: "Transfer Order",
            staff
          }
        }
      };
      const mutation = updateRaw.mutateAsync({ id: data?._id, payload: objData });
      await handleMutationFeedback(mutation, {
        successMsg: `Transfer Order ${data?.orderId} success!`,
        errorMsg: `Transfer Order ${data?.orderId} failed!`,
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
                name="toOutletRef"
                label="Outlet Tujuan"
                select
                fullWidth
                value={outletDesti}
                onChange={(e) => setOutletDesti(e.target.value)}
                required
              >
                {dataOulet?.docs
                  ?.filter((row) => row?._id !== ctm?.selectedOutlet)
                  ?.map((option, i) => (
                    <MenuItem
                      key={option?._id || i}
                      value={option?._id}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {option?.name}
                    </MenuItem>
                  ))}
              </TextField>
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
                  loading={updateRaw?.isLoading || loadingOutlet}
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
