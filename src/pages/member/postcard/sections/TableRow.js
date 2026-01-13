import React, { useState } from "react";
import { useQueryClient } from "react-query";
import PropTypes from "prop-types";
import QRCode from "qrcode";
import { styled, TableRow, TableCell, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "../../../../utils/axios";
import Iconify from "../../../../components/Iconify";
// hooks
import useAuth from "../../../../hooks/useAuth";
// utils
import { formatDate2 } from "../../../../utils/getData";
import { maskedPhone } from "../../../../utils/masked";
import Label from "../../../../components/Label";

// ----------------------------------------------------------------------

LogVoucherTableRow.propTypes = {
  row: PropTypes.object
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
  },
}));

export default function LogVoucherTableRow({ row }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { _id, date, name, option, member, isPrinted } = row;

  const [isLoading, setIsLoading] = useState(false);

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const bgMap = {
    "opsi 1": "/postcard/opsi1.png",
    "opsi 2": "/postcard/opsi2.png",
    "opsi 3": "/postcard/opsi3.png",
    "opsi 4": "/postcard/opsi4.png",
    "opsi 5": "/postcard/opsi5.png",
  };

  // Helper
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

  const drawQrContainer = (ctx, qr, cfg) => {
    const {
      x,
      y,
      size = 180,
      padding = 20,
      radius = 20,
      borderColor = "#284E6F",
    } = cfg;

    const containerSize = size + padding * 2;

    // container
    drawRoundedRect(
      ctx,
      x,
      y,
      containerSize,
      containerSize,
      radius,
      null,
      borderColor,
      3
    );

    const qrX = x + padding;
    const qrY = y + padding;

    // qr bg
    drawRoundedRect(
      ctx,
      qrX - 10,
      qrY - 10,
      size + 20,
      size + 20,
      12,
      "#fff",
      "#cfcfcf",
      4
    );

    // qr image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, size, size, 10);
    ctx.clip();
    ctx.drawImage(qr, qrX, qrY, size, size);
    ctx.restore();
  };

  const drawTextBox = (ctx, texts, cfg) => {
    const {
      x,
      y,
      font = "bold 36px Poppins, Arial",
      fonts = [],
      color = "#fff",
      bg = null,
      paddingX = 18,
      paddingY = 14,
      radius = 20,
      gap = 50,
      center = false,
    } = cfg;

    ctx.font = font;
    // ukur text
    const widths = texts.map(t => ctx.measureText(t).width);
    const textHeight = gap * (texts.length - 1) + 36; // 36 ≈ font size
    const boxWidth = Math.max(...widths) + paddingX * 2;
    const boxHeight = textHeight + paddingY * 2;

    // posisi box
    const boxX = center ? x - boxWidth / 2 : x - paddingX;
    const boxY = y - boxHeight / 2;

    // draw background
    if (bg) {
      drawRoundedRect(
        ctx,
        boxX,
        boxY,
        boxWidth,
        boxHeight + 15,
        radius,
        bg
      );
    }

    // posisi awal text (vertically centered)
    const startTextY =
      boxY +
      paddingY +
      (boxHeight - paddingY * 2 - textHeight) / 2 + 36; // baseline fix

    ctx.fillStyle = color;
    ctx.textAlign = center ? "center" : "left";

    texts.forEach((t, i) => {
      if (fonts?.length > 0) {
        ctx.font = fonts[i]
      }
      ctx.fillText(
        t,
        x,
        startTextY + i * gap
      );
    });

    ctx.textAlign = "left"; // reset
  };

  const getLayoutConfig = (fixWidth) => ({
    "opsi 1": {
      text: {
        x: 80,
        y: 160,
        color: "#fff",
        gap: 70,
        texts: [
          `Full Name : ${member.name}`,
          `Evewash ID : ${member.memberId}`,
        ],
      },
      qr: { x: 900, y: 500 },
    },
    "opsi 2": {
      text: {
        x: 110,
        y: 210,
        bg: "rgba(0,0,0,0.1)",
        gap: 70,
        texts: [
          `Full Name : ${member.name}`,
          `Evewash ID : ${member.memberId}`,
        ],
      },
      qr: { x: 910, y: 490 },
    },
    "opsi 3": {
      text: {
        x: 590,
        y: 230,
        color: "#000",
        bg: "rgba(255,255,255,0.5)",
        gap: 70,
        texts: [
          `Full Name : ${member.name}`,
          `Evewash ID : ${member.memberId}`,
        ],
      },
      qr: { x: 80, y: 500 },
    },
    "opsi 4": {
      text: {
        x: fixWidth / 2,
        y: 250,
        color: "#192C60",
        center: true,
        font: "bold 28px Poppins, Arial",
        gap: 40,
        texts: [
          `Full Name : ${member.name}`,
          `Evewash ID : ${member.memberId}`,
        ],
      },
      qr: { x: 920, y: 530 },
    },
    "opsi 5": {
      text: {
        x: 60,
        y: 450,
        color: "#40494B",
        gap: 40,
        texts: ["Full Name :", member.name],
        fonts: ["28px Poppins, Arial", "Bold 36px Poppins, Arial"]
      },
      qr: { x: 60, y: 510 },
      footerId: true,
    },
  });

  const generateLayout = (ctx, fixWidth, opt, qr) => {
    const layoutConfig = getLayoutConfig(fixWidth);
    const cfg = layoutConfig[opt];
    if (!cfg) return;

    if (cfg.text) {
      if (cfg.text.center) ctx.textAlign = "center";
      drawTextBox(ctx, cfg.text.texts, cfg.text);
      ctx.textAlign = "left";
    }

    if (cfg.qr) {
      drawQrContainer(ctx, qr, cfg.qr);
    }

    if (cfg.footerId) {
      ctx.fillStyle = "#40494B";
      ctx.font = "bold 20px Poppins, Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        member.memberId,
        cfg.qr.x + 110,
        cfg.qr.y + 250
      );
    }
  };

  const handleDownload = async () => {
    if (!member?.memberId) return;
    setIsLoading(true);

    const bgSrc = bgMap[option] || bgMap["opsi 1"];

    try {
      // Generate QR (PASTI siap)
      const qrCodeUrl = await QRCode.toDataURL(member.memberId, {
        scale: 10,
        margin: 1,
        errorCorrectionLevel: "H",
      });

      // Load images
      const [bg, qr] = await Promise.all([
        loadImage(bgSrc),
        loadImage(qrCodeUrl),
      ]);

      // Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 1200;
      canvas.height = 800;

      // Background
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // generate layout
      generateLayout(ctx, canvas.width, option, qr);

      // Download
      const link = document.createElement("a");
      link.download = `postcard-${member.memberId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      if (!isPrinted) {
        try {
          await axiosInstance.patch(`/member-vouchers/${_id}`, { isPrinted: true });
          queryClient.invalidateQueries("allNotif");
          queryClient.invalidateQueries("listPostcard");
        } catch (error) {
          console.error("Gagal update:", error);
        }
      }

    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(date)}</TableCell>

      <TableCell>{name}</TableCell>

      <TableCell>{member.memberId}</TableCell>

      <TableCell>{member.name}</TableCell>

      <TableCell>{!member?.phone?.includes("EM") ? maskedPhone(user.role === "Super Admin", member?.phone) : "-"}</TableCell>

      <TableCell align="center">
        <Label
          variant="ghost"
          color={isPrinted ? "warning" : "success"}
          sx={{ textTransform: "capitalize" }}
        >
          {isPrinted ? "Sudah Print" : "New"}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" gap={1}>
          <LoadingButton
            title="Download Postcard"
            variant="contained"
            color="primary"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            loading={isLoading}
            onClick={() => handleDownload()}
          >
            <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
          </LoadingButton>
        </Stack>
      </TableCell>

    </CustomTableRow>
  );
}
