import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  styled,
  IconButton,
  Dialog,
  DialogTitle,
  TableRow,
  TableCell,
  MenuItem,
  Grid,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
import { TableMoreMenu } from '../../../components/table';
// hooks
import useAuth from '../../../hooks/useAuth';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';

// ----------------------------------------------------------------------

CashLogTableRow.propTypes = {
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

export default function CashLogTableRow({ row, onDeleteRow }) {
  const {
    createdAt,
    title,
    amount,
    isCashOut,
    orderRef
  } = row;

  const { user } = useAuth();

  const [openAction, setOpenAction] = useState(null);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  return (
    <>
      <CustomTableRow>
        <TableCell align="center">
          {formatDate2(createdAt)}
        </TableCell>
        <TableCell align="left">{title} {orderRef?.orderId ? orderRef?.orderId : ""}</TableCell>
        <TableCell align="center">{`Rp. ${numberWithCommas(amount || 0)}`}</TableCell>
        <TableCell align="center">
          <Label
            variant="ghost"
            color={isCashOut ? 'error' : 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {isCashOut ? 'Cash Out' : 'Cash In'}
          </Label>
        </TableCell>
        {/* <TableCell align="center">
          <TableMoreMenu
            open={openAction}
            onOpen={handleOpenAction}
            onClose={handleCloseAction}
            actions={
              <>
                {user.role === 'owner' && (
                  <MenuItem
                    sx={{ color: 'red' }}
                    onClick={() => {
                      onDeleteRow();
                    }}
                  >
                    <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                    Delete
                  </MenuItem>
                )}
              </>
            }
          />
        </TableCell> */}
      </CustomTableRow>
    </>
  );
}
