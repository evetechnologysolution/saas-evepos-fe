import PropTypes from 'prop-types';
// @mui
import {
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { formatDate2 } from '../../../../utils/getData';

// ----------------------------------------------------------------------

ModalTransferLog.propTypes = {
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
  data: PropTypes.object,
};

export default function ModalTransferLog(props) {
  const { data, open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="xs" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ borderBottom: '1px solid #ccc' }}
        >
          Transfer Log
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <table style={{ width: '100%' }}>
            <thead style={{ color: '#6c757d!important', fontSize: '0.9rem' }}>
              <tr>
                <th align="left">Date</th>
                <th align="left">Log</th>
                <th>Staff</th>
                <th> </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {data?.transfer?.log?.slice()?.reverse()?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td align="left" style={{ padding: '0.2rem 0' }}>
                      {item?.createdAt ? formatDate2(item?.createdAt) : "-"}
                    </td>
                    <td>
                      {item?.notes || "-"}
                    </td>
                    <td align="center">
                      {item?.staff || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
