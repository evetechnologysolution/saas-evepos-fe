import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { styled, TableRow, TableCell, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axiosInstance from '../../../../utils/axios';
import Iconify from '../../../../components/Iconify';

import useAuth from '../../../../hooks/useAuth';
import { formatDate2 } from '../../../../utils/getData';
import { maskedPhone } from '../../../../utils/masked';
import Label from '../../../../components/Label';

LogVoucherTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    borderRadius: '8px',
  },
}));

export default function LogVoucherTableRow({ row }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { _id, createdAt, name, option, memberRef, isPrinted } = row;

  const [isLoading, setIsLoading] = useState(false);

  const bgMap = {
    'opsi 1': '/postcard/opsi1.png',
    'opsi 2': '/postcard/opsi2.png',
    'opsi 3': '/postcard/opsi3.png',
    'opsi 4': '/postcard/opsi4.png',
    'opsi 5': '/postcard/opsi5.png',
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  /* ----------------- DRAW HELPERS ----------------- */

  const drawRoundedRect = (ctx, x, y, w, h, r, fill, stroke, lineWidth = 1) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const drawQrContainer = (ctx, qr, { x, y }) => {
    const size = 180;
    const padding = 20;

    const container = size + padding * 2;

    drawRoundedRect(ctx, x, y, container, container, 20, null, '#284E6F', 3);

    const qrX = x + padding;
    const qrY = y + padding;

    drawRoundedRect(ctx, qrX - 10, qrY - 10, size + 20, size + 20, 12, '#fff', '#ccc', 3);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, size, size, 10);
    ctx.clip();
    ctx.drawImage(qr, qrX, qrY, size, size);
    ctx.restore();
  };

  /* ----------------- TEXT ENGINE ----------------- */

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach((word) => {
      const test = `${line}${word} `;
      const width = ctx.measureText(test).width;

      if (width > maxWidth && line !== '') {
        lines.push(line);
        line = `${word} `;
      } else {
        line = test;
      }
    });

    lines.push(line);
    return lines;
  };

  const drawTextBox = (ctx, texts, cfg) => {
    const {
      x,
      y,
      font = 'bold 36px Poppins, Arial',
      color = '#fff',
      center = false,
      gap = 50,
      maxWidth = 600,
    } = cfg;

    ctx.fillStyle = color;
    ctx.textAlign = center ? 'center' : 'left';
    ctx.font = font;

    let offset = 0;

    texts.forEach((text) => {
      const lines = wrapText(ctx, text, maxWidth);

      lines.forEach((l) => {
        ctx.fillText(l.trim(), x, y + offset);
        offset += gap;
      });
    });

    ctx.textAlign = 'left';
  };

  /* ----------------- LAYOUT ----------------- */

  const getLayout = (width) => ({
    'opsi 1': {
      text: {
        x: 80,
        y: 160,
        texts: [`Full Name : ${memberRef?.name}`, `Evewash ID : ${memberRef?.memberId}`],
      },
      qr: { x: 900, y: 500 },
    },

    'opsi 2': {
      text: {
        x: 110,
        y: 210,
        texts: [`Full Name : ${memberRef?.name}`, `Evewash ID : ${memberRef?.memberId}`],
      },
      qr: { x: 910, y: 490 },
    },

    'opsi 3': {
      text: {
        x: 590,
        y: 230,
        color: '#000',
        texts: [`Full Name : ${memberRef?.name}`, `Evewash ID : ${memberRef?.memberId}`],
      },
      qr: { x: 80, y: 500 },
    },

    'opsi 4': {
      text: {
        x: width / 2,
        y: 250,
        color: '#192C60',
        center: true,
        font: 'bold 28px Poppins',
        texts: [`Full Name : ${memberRef?.name}`, `Evewash ID : ${memberRef?.memberId}`],
      },
      qr: { x: 920, y: 530 },
    },

    'opsi 5': {
      text: {
        x: 60,
        y: 450,
        color: '#40494B',
        font: 'bold 32px Poppins',
        texts: [memberRef?.name],
      },
      qr: { x: 60, y: 510 },
      footer: true,
    },
  });

  const generateLayout = (ctx, width, option, qr) => {
    const layout = getLayout(width)[option];

    if (!layout) return;

    if (layout.text) {
      drawTextBox(ctx, layout.text.texts, layout.text);
    }

    if (layout.qr) {
      drawQrContainer(ctx, qr, layout.qr);
    }

    if (layout.footer) {
      ctx.fillStyle = '#40494B';
      ctx.font = 'bold 20px Poppins';
      ctx.textAlign = 'center';

      ctx.fillText(memberRef?.memberId, layout.qr.x + 110, layout.qr.y + 250);
    }
  };

  /* ----------------- DOWNLOAD ----------------- */

  const handleDownload = async () => {
    if (!memberRef?.memberId) return;

    setIsLoading(true);

    try {
      const bgSrc = bgMap[option] || bgMap['opsi 1'];

      await document.fonts.ready;

      const qrCode = await QRCode.toDataURL(memberRef.memberId, {
        scale: 10,
        margin: 1,
        errorCorrectionLevel: 'H',
      });

      const [bg, qr] = await Promise.all([loadImage(bgSrc), loadImage(qrCode)]);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      /* HIGH DPI for print */
      // canvas.width = 2400;
      // canvas.height = 1600;
      // ctx.scale(2, 2);

      canvas.width = 1200;
      canvas.height = 800;


      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      generateLayout(ctx, canvas.width, option, qr);

      const link = document.createElement('a');
      link.download = `postcard-${memberRef.memberId}.png`;
      link.href = canvas.toDataURL('image/png');

      link.click();

      if (!isPrinted) {
        await axiosInstance.patch(`/member-voucher/${_id}`, { isPrinted: true });

        queryClient.invalidateQueries('allNotif');
        queryClient.invalidateQueries('listPostcard');
      }
    } catch (err) {
      console.error('Download failed', err);
    }

    setIsLoading(false);
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{memberRef?.memberId}</TableCell>

      <TableCell>{memberRef?.name}</TableCell>

      <TableCell>
        {!memberRef?.phone?.includes('EM')
          ? maskedPhone(['owner', 'super admin']?.includes(user?.role), memberRef?.phone)
          : '-'}
      </TableCell>

      <TableCell align="center">
        <Label variant="ghost" color={isPrinted ? 'warning' : 'success'}>
          {isPrinted ? 'Sudah Print' : 'New'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center">
          <LoadingButton
            title="Download Postcard"
            variant="contained"
            color="primary"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            loading={isLoading}
            onClick={handleDownload}
          >
            <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
          </LoadingButton>
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}