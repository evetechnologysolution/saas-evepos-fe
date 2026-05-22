import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { styled, Stack, TableRow, TableCell, Button, Link, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';
import { maskedPhone } from '../../../utils/masked';

// ----------------------------------------------------------------------

MemberTableRow.propTypes = {
  row: PropTypes.object,
  onDetailRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: 'inset 8px 0 0 #fff, inset -8px 0 0 #fff',
    borderRadius: '8px',
  },
}));

export default function MemberTableRow({ row, onDetailRow, onEditRow, onDeleteRow }) {
  const { user } = useAuth();

  const { createdAt, memberId, name, phone, email, addresses, point, isActive } = row;

  const mainAddress = Array.isArray(addresses) ? addresses?.find((item) => item?.isDefault) : null;

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // =========================
  // WAVE BACKGROUND
  // =========================
  const drawWave = (ctx, canvas) => {
    ctx.fillStyle = "#f5f8fc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cardBottom = canvas.height - 40; // 🔥 dekat bottom card

    // =========================
    // WAVE LAYER 1
    // =========================
    ctx.fillStyle = "rgba(58,129,190,0.08)";
    ctx.beginPath();
    ctx.moveTo(0, cardBottom - 80);

    ctx.bezierCurveTo(250, cardBottom - 140, 450, cardBottom - 40, 700, cardBottom - 80);

    ctx.bezierCurveTo(850, cardBottom - 110, 950, cardBottom - 60, canvas.width, cardBottom - 90);

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    // =========================
    // WAVE LAYER 2
    // =========================
    ctx.fillStyle = "rgba(58,129,190,0.05)";
    ctx.beginPath();
    ctx.moveTo(0, cardBottom - 160);

    ctx.bezierCurveTo(300, cardBottom - 220, 500, cardBottom - 100, 800, cardBottom - 160);

    ctx.bezierCurveTo(900, cardBottom - 180, 980, cardBottom - 120, canvas.width, cardBottom - 150);

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  };

  const handleDownloadQrCard = async () => {
    if (!memberId) return;

    try {
      await document.fonts.ready;

      const qrCode = await QRCode.toDataURL(memberId, {
        width: 400,
        margin: 1,
        errorCorrectionLevel: "H",
      });

      const [qrImage, logoImage] = await Promise.all([
        loadImage(qrCode),
        loadImage("/logo/evewash.png"),
      ]);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 1010;
      canvas.height = 638;

      // // =========================
      // // BACKGROUND (soft gray tone)
      // // =========================
      // ctx.fillStyle = "#f5f8fc";
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // // =========================
      // // MAIN CARD
      // // =========================
      // ctx.fillStyle = "#ffffff";
      // ctx.beginPath();
      // ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 30);
      // ctx.fill();

      // // shadow effect (manual)
      // ctx.strokeStyle = "rgba(58,129,190,0.25)";
      // ctx.lineWidth = 3;
      // ctx.stroke();

      // =========================
      // BACKGROUND (wafe)
      // =========================
      drawWave(ctx, canvas);

      // =========================
      // HEADER AREA
      // =========================
      ctx.fillStyle = "#3a81be";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("MEMBER CARD", canvas.width / 2, 85);

      // thin divider line
      ctx.strokeStyle = "rgba(58,129,190,0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 110);
      ctx.lineTo(canvas.width - 60, 110);
      ctx.stroke();

      // =========================
      // LOGO (left header)
      // =========================
      ctx.drawImage(logoImage, 60, 40, 160, 60);

      // =========================
      // LEFT COLUMN (INFO)
      // =========================
      const labelColor = "#7aa6d6";
      const valueColor = "#2f5f8f";

      let y = 190;

      const drawLabelValue = (label, value) => {
        ctx.fillStyle = labelColor;
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "left";
        ctx.fillText(label, 60, y);

        y += 30;

        ctx.fillStyle = valueColor;
        ctx.font = "24px Arial";
        ctx.fillText(value || "-", 60, y);

        y += 55;
      };

      drawLabelValue("Member ID", memberId);
      drawLabelValue("Name", name);
      drawLabelValue("Phone", phone);

      // =========================
      // QR SECTION (RIGHT SIDE)
      // =========================

      const qrX = 700;
      const qrY = 200;
      const qrSize = 230;

      // soft background box
      ctx.fillStyle = "#f0f7ff";
      ctx.beginPath();
      ctx.roundRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 80, 24);
      ctx.fill();

      // border accent
      ctx.strokeStyle = "#3a81be";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(qrX - 25, qrY - 25, qrSize + 50, qrSize + 80, 24);
      ctx.stroke();

      // QR image
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // QR text
      ctx.fillStyle = "#3a81be";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Scan This QR", qrX + qrSize / 2, qrY + qrSize + 35);

      // reset
      ctx.textAlign = "left";

      // =========================
      // DOWNLOAD
      // =========================
      const link = document.createElement("a");
      link.download = `EVEWASH-CARD-${memberId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download QR Card failed", err);
    }
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell>
        <Stack>
          <div>
            <Link component="button" variant="subtitle2" underline="hover" onClick={onDetailRow}>
              {memberId}
            </Link>
          </div>
          <div>
            <Label variant="ghost" color={isActive ? "success" : "warning"}>
              <Typography variant="subtitle2">
                {isActive ? "Active" : "Inactive"}
              </Typography>
            </Label>
          </div>
        </Stack>
      </TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>
        {!phone?.includes('EM') ? maskedPhone(['owner', 'super admin']?.includes(user?.role), phone) : '-'}
      </TableCell>

      <TableCell>{email}</TableCell>

      <TableCell>{mainAddress?.address || '-'}</TableCell>

      <TableCell align="center">
        <Label variant="ghost" color="success">
          <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
            {numberWithCommas(point || 0)}
          </Typography>
        </Label>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" gap={1}>
          <Button
            title="Download QR Member"
            variant="contained"
            color="primary"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={handleDownloadQrCard}
          >
            <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
          </Button>
          <Button
            title="Edit"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onEditRow();
            }}
          >
            <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
          </Button>
          {user.role === 'Super Admin' && (
            <Button
              title="Delete"
              variant="contained"
              color="error"
              sx={{ p: 0, minWidth: 35, height: 35 }}
              onClick={() => {
                onDeleteRow();
              }}
            >
              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          )}
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
