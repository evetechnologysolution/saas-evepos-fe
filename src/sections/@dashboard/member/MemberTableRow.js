import PropTypes from 'prop-types';
import { useState } from 'react';
import QRCode from 'qrcode';
import {
  styled, Stack, TableRow, TableCell, Link, Typography, MenuItem,
  // Button,
} from '@mui/material';
// components
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
// hooks
import useAuth from '../../../hooks/useAuth';
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

  const [openAction, setOpenAction] = useState(null);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const handleDownloadQrCard = async () => {
    if (!memberId) return;

    try {
      await document.fonts.ready;

      const qrCode = await QRCode.toDataURL(memberId, {
        width: 500,
        margin: 1,
        errorCorrectionLevel: "H",
      });

      const [qrImage, logoImage] = await Promise.all([
        loadImage(qrCode),
        loadImage("/logo/evewash.png"),
      ]);

      const W = 1400;
      const H = 900;
      const TOP_H = 555;   // white card section
      const MID_H = 225;   // instructions section
      const BOT_H = H - TOP_H - MID_H; // footer

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = W;
      canvas.height = H;

      // =====================
      // TOP SECTION — white background
      // =====================
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, TOP_H);

      // diagonal soft-blue gradient on right half
      const diagGrad = ctx.createLinearGradient(W * 0.38, 0, W, TOP_H);
      diagGrad.addColorStop(0, "rgba(210,232,255,0)");
      diagGrad.addColorStop(1, "rgba(210,232,255,0.55)");
      ctx.fillStyle = diagGrad;
      ctx.beginPath();
      ctx.moveTo(W * 0.38, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, TOP_H);
      ctx.lineTo(W * 0.25, TOP_H);
      ctx.closePath();
      ctx.fill();

      // =====================
      // LOGO — top-left
      // =====================
      ctx.drawImage(logoImage, 50, 30, 220, 85);

      // =====================
      // PREMIUM MEMBER badge — top-right
      // =====================
      const badgeW = 270;
      const badgeH = 52;
      const badgeX = W - badgeW - 40;
      const badgeY = 38;
      ctx.fillStyle = "#1b3d7a";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 26);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("◆  PREMIUM MEMBER", badgeX + badgeW / 2, badgeY + 33);

      // =====================
      // E-MEMBER CARD title
      // =====================
      ctx.fillStyle = "#1b3d7a";
      ctx.font = "bold 74px Arial";
      ctx.textAlign = "left";
      ctx.fillText("E-MEMBER CARD", 50, 210);

      // tagline
      ctx.fillStyle = "#4a90d9";
      ctx.font = "italic 26px Georgia, serif";
      ctx.fillText("Cuci Bersih, Hidup Lebih Nyaman ✶", 50, 250);

      // =====================
      // INFO ROWS — left column
      // =====================
      const drawInfoRow = (iconChar, label, value, rowY) => {
        // circle icon background
        ctx.fillStyle = "#deeeff";
        ctx.beginPath();
        ctx.arc(88, rowY + 22, 30, 0, Math.PI * 2);
        ctx.fill();

        // icon character
        ctx.fillStyle = "#1b3d7a";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(iconChar, 88, rowY + 30);

        // label
        ctx.fillStyle = "#4a90d9";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "left";
        ctx.fillText(label, 135, rowY + 10);

        // value
        ctx.fillStyle = "#1b3d7a";
        ctx.font = "bold 26px Arial";
        ctx.fillText(value || "-", 135, rowY + 40);

        // divider line
        ctx.strokeStyle = "#ddeeff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(50, rowY + 64);
        ctx.lineTo(680, rowY + 64);
        ctx.stroke();
      };

      drawInfoRow("\u{1F4CB}", "ID MEMBER", memberId, 285);
      drawInfoRow("\u{1F464}", "NAMA", name, 365);
      drawInfoRow("\u{1F4DE}", "NOMOR TELEPON", phone, 445);

      // =====================
      // QR PANEL — right column
      // =====================
      const qrPanelX = 760;
      const qrPanelY = 50;
      const qrPanelW = W - qrPanelX - 40;
      const qrPanelH = TOP_H - 65;
      const qrBlueSectionH = 130;
      const qrBlueSectionY = qrPanelY + qrPanelH - qrBlueSectionH;
      const qrSize = 300;
      const qrImgX = qrPanelX + (qrPanelW - qrSize) / 2;
      const qrImgY = qrPanelY + 25;

      // panel border
      ctx.strokeStyle = "#b8d8f5";
      ctx.lineWidth = 2.5;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(qrPanelX, qrPanelY, qrPanelW, qrPanelH, 22);
      ctx.fill();
      ctx.stroke();

      // QR image
      ctx.drawImage(qrImage, qrImgX, qrImgY, qrSize, qrSize);

      // blue bottom "SCAN QR" section (rounded bottom corners only)
      ctx.fillStyle = "#1b3d7a";
      ctx.beginPath();
      ctx.moveTo(qrPanelX, qrBlueSectionY);
      ctx.lineTo(qrPanelX + qrPanelW, qrBlueSectionY);
      ctx.lineTo(qrPanelX + qrPanelW, qrPanelY + qrPanelH - 22);
      ctx.arcTo(qrPanelX + qrPanelW, qrPanelY + qrPanelH, qrPanelX + qrPanelW - 22, qrPanelY + qrPanelH, 22);
      ctx.lineTo(qrPanelX + 22, qrPanelY + qrPanelH);
      ctx.arcTo(qrPanelX, qrPanelY + qrPanelH, qrPanelX, qrPanelY + qrPanelH - 22, 22);
      ctx.closePath();
      ctx.fill();

      const qrCX = qrPanelX + qrPanelW / 2;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("\u{1F4F1}  SCAN QR INI", qrCX, qrBlueSectionY + 40);
      ctx.font = "19px Arial";
      ctx.fillText("Tunjukkan saat transaksi", qrCX, qrBlueSectionY + 72);
      ctx.fillText("untuk mendapatkan evewash point", qrCX, qrBlueSectionY + 97);

      // =====================
      // MID SECTION — instructions
      // =====================
      ctx.fillStyle = "#edf4fc";
      ctx.fillRect(0, TOP_H, W, MID_H);

      ctx.strokeStyle = "#c5dcf2";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, TOP_H);
      ctx.lineTo(W, TOP_H);
      ctx.stroke();

      // "PETUNJUK MEMBER" badge
      const pmW = 240;
      const pmH = 38;
      const pmX = 50;
      const pmY = TOP_H + 22;
      ctx.fillStyle = "#1b3d7a";
      ctx.beginPath();
      ctx.roundRect(pmX, pmY, pmW, pmH, 6);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 19px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PETUNJUK MEMBER", pmX + pmW / 2, pmY + 25);

      // 4 instruction steps
      const steps = [
        {
          icon: "\u{1F4F1}",
          title: "1. TUNJUKKAN SAAT TRANSAKSI",
          desc: ["Scan kartu ini setiap kali transaksi", "untuk mendapatkan evewash point."],
        },
        {
          icon: "\u{1F464}",
          title: "2. DAFTARKAN DIRI ANDA",
          desc: ["Daftarkan diri anda di akun", "evewash.com agar setiap scan", "akan dapat point."],
        },
        {
          icon: "⭐",
          title: "3. CEK & KUMPULKAN POINT",
          desc: ["Point yang kamu kumpulkan", "bisa dicek di akun kamu di", "evewash.com."],
        },
        {
          icon: "\u{1F381}",
          title: "4. TUKARKAN POINT",
          desc: ["Tukarkan point di evewash.com", "untuk cuci gratis, tukar laundry", "bag, dan hadiah lainnya."],
        },
      ];

      const stepColW = (W - 100) / 4;
      steps.forEach((step, i) => {
        const sx = 50 + i * stepColW;
        const sy = TOP_H + 76;

        // circle icon
        ctx.fillStyle = "#cce0f5";
        ctx.beginPath();
        ctx.arc(sx + 26, sy + 14, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(step.icon, sx + 26, sy + 21);

        // step title
        ctx.fillStyle = "#1b3d7a";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "left";
        ctx.fillText(step.title, sx + 56, sy + 16);

        // step description
        ctx.fillStyle = "#567a9a";
        ctx.font = "14px Arial";
        step.desc.forEach((line, j) => {
          ctx.fillText(line, sx + 56, sy + 36 + j * 18);
        });

        // column divider
        if (i < 3) {
          ctx.strokeStyle = "#c5dcf2";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx + stepColW - 2, TOP_H + 70);
          ctx.lineTo(sx + stepColW - 2, TOP_H + MID_H - 20);
          ctx.stroke();
        }
      });

      // =====================
      // FOOTER — dark blue bar
      // =====================
      const footY = TOP_H + MID_H;
      ctx.fillStyle = "#1b3d7a";
      ctx.fillRect(0, footY, W, BOT_H);

      // "Terima kasih..." italic text
      ctx.fillStyle = "#ffffff";
      ctx.font = "italic 25px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("Terima kasih telah memilih Evewash ❤", 40, footY + BOT_H / 2 + 9);

      // vertical separator
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(500, footY + 15);
      ctx.lineTo(500, footY + BOT_H - 15);
      ctx.stroke();

      // footer badges
      const footerBadges = [
        { icon: "\u{1F6E1}", line1: "Bersih", line2: "& Higienis" },
        { icon: "\u{1F455}", line1: "Perawatan", line2: "Terbaik" },
        { icon: "\u{1F44D}", line1: "Pelayanan", line2: "Profesional" },
        { icon: "⭐", line1: "Kualitas", line2: "Terpercaya" },
      ];

      const badgeAreaW = W - 520;
      const badgeColW = badgeAreaW / 4;
      footerBadges.forEach((b, i) => {
        const bx = 520 + i * badgeColW + badgeColW / 2;

        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(b.icon, bx, footY + 32);
        ctx.font = "bold 15px Arial";
        ctx.fillText(b.line1, bx, footY + 54);
        ctx.fillText(b.line2, bx, footY + 72);

        if (i < 3) {
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx + badgeColW / 2, footY + 12);
          ctx.lineTo(bx + badgeColW / 2, footY + BOT_H - 12);
          ctx.stroke();
        }
      });

      // =====================
      // DOWNLOAD
      // =====================
      const link = document.createElement("a");
      link.download = `EVEWASH-CARD-${memberId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download QR Card failed", err);
    }
  };

  const sendWa = (data) => {
    if (!data || !data.phone) {
      console.error('Data tidak valid');
      return;
    }

    const bodyMsg = `🎉 Halo kak, kami dari Evewash Laundry!
Berikut kami kirimkan QR Member Anda.

📌 Tunjukkan QR ini setiap kali bertransaksi di Evewash.
🎁 Dapatkan Evewash Point dari setiap transaksi.
🏆 Tukarkan point Anda dengan berbagai reward menarik, termasuk cuci gratis, di Evewash.com.

Semakin sering laundry, semakin banyak point yang Anda kumpulkan.
Simpan QR Member ini dengan baik dan gunakan setiap kali bertransaksi.
Terima kasih telah mempercayakan kebutuhan laundry Anda kepada Evewash. 💙`;

    const url = `https://api.whatsapp.com/send?phone=${data?.phone}&text=${encodeURIComponent(bodyMsg)}`;
    window.open(url, '_blank');
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
          {/* <Button
            title="Edit"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onEditRow();
            }}
          >
            <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
          </Button>
          {user.role === 'owner' && (
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
          )} */}
          <TableMoreMenu
            open={openAction}
            onOpen={handleOpenAction}
            onClose={handleCloseAction}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseAction();
                  }}
                >
                  <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
                  Edit
                </MenuItem>
                {user?.tenantRef?.isEvewash && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleDownloadQrCard();
                        handleCloseAction();
                      }}
                    >
                      <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
                      QR Member
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        sendWa(row);
                        handleCloseAction();
                      }}
                      disabled={!!phone?.includes('EM') || !phone}
                    >
                      <Iconify icon="fa6-brands:whatsapp" sx={{ width: 24, height: 24 }} />
                      Send WA
                    </MenuItem>
                  </>
                )}
                {['admin', 'owner'].includes(user?.role?.toLowerCase()) && (
                  <MenuItem
                    sx={{ color: 'red' }}
                    onClick={() => {
                      onDeleteRow();
                      handleCloseAction();
                    }}
                  >
                    <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                    Delete
                  </MenuItem>
                )}
              </>
            }
          />
        </Stack>
      </TableCell>
    </CustomTableRow>
  );
}
