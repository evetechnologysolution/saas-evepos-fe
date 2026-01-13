import { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { styled, Stack, TableRow, TableCell, Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import ConfirmDelete from 'src/components/ConfirmDelete';
import { useQueryClient } from 'react-query';
import Iconify from '../../../../components/Iconify';
import axios from '../../../../utils/axios';
import { formatDate2 } from '../../../../utils/getData';

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    borderRadius: '8px',
  },
}));

MemberCardsTableRow.propTypes = {
  row: PropTypes.object,
};

export default function MemberCardsTableRow({ row }) {
  const { enqueueSnackbar } = useSnackbar();
  const client = useQueryClient();

  const { _id, date, cardId } = row;

  const [deleteData, setDelete] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    if (cardId) {
      QRCode.toDataURL(cardId)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error('QR Code generation failed:', err);
        });
    }
  }, [cardId]);

  const handleDeleteData = async () => {
    setDelete(false);
    await axios.delete(`/member-card/${_id}`);
    client.invalidateQueries('memberCards');
    enqueueSnackbar(`Deleted Card ID ${cardId} success!`);
  };

  const downloadQRCode = async () => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current);
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `qr-code-${cardId}.png`;
    link.click();
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(date)}</TableCell>
        <TableCell>{cardId}</TableCell>
        <TableCell align="center">
          <Stack direction="column" alignItems="center" spacing={2}>
            <div
              ref={qrRef}
              style={{
                padding: 10,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img alt="QR Code" src={qrCodeUrl} style={{ width: '100px' }} />
              <p>{cardId}</p>
            </div>
          </Stack>
        </TableCell>
        <TableCell align="center">
          <IconButton color="primary" onClick={downloadQRCode}>
            <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton color="error" onClick={() => setDelete(true)}>
            <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
          </IconButton>
        </TableCell>
      </CustomTableRow>

      <ConfirmDelete open={deleteData} isLoading={false} onClose={() => setDelete(false)} onDelete={handleDeleteData} />
    </>
  );
}
