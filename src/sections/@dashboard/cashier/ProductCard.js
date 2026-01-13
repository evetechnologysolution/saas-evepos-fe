import React, { useState, useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Marquee from "react-fast-marquee";
// @mui
import { Box, Card, Tooltip, Typography } from "@mui/material";
// context
import { cashierContext } from "../../../contexts/CashierContext";
// components
import Label from "../../../components/Label";
// import Image from "../../../components/Image";
import ProductDialog from "./ProductDialog";
import "./ProductCard.scss";

// ----------------------------------------------------------------------

ProductCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  price: PropTypes.number,
  productionPrice: PropTypes.number,
  variant: PropTypes.array,
  discount: PropTypes.any,
  category: PropTypes.string,
  unit: PropTypes.string,
  notes: PropTypes.any,
  amountKg: PropTypes.number,
  isLaundryBag: PropTypes.bool,
  isAvailable: PropTypes.bool,
};

export default function ProductCard({ id, name, image, price, productionPrice, variant, discount, category, unit, notes, amountKg, isLaundryBag, isAvailable }) {
  const ctx = useContext(cashierContext);

  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const wrapperWidth = wrapperRef?.current?.offsetWidth;
      const contentWidth = contentRef?.current?.scrollWidth;

      setIsOverflow(contentWidth >= wrapperWidth);
    };

    checkOverflow();

    // Tambahkan event listener untuk mengatasi perubahan ukuran layar
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [id]);

  const [isHovering, setIsHovering] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const findQty = () => {
    const data = ctx.bill.find((data) => data.id === id);
    return data ? data.qty : 0;
  };

  const findQtyUpdatedBill = () => {
    const data = ctx.updatedBill.find((data) => data.id === id);
    return data ? data.qty : 0;
  };

  const handleClick = () => {
    if (isAvailable) {
      if (
        (variant.length === 0 && !notes) ||
        (variant.length === 0 && !notes)
      ) {
        let promoType = 0;
        let promoQtyMin = 0;
        let promoAmount = 0;
        if (discount.isAvailable && discount.amount) {
          promoType = 1;
          promoAmount = discount.amount;
        }

        if (discount.isAvailable && discount.qtyMin) {
          const totalQty = findQty() + 1;
          if (totalQty >= discount.qtyMin) {
            const qtyFree = Math.floor(totalQty / discount.qtyMin);
            const priceFree = price * qtyFree;
            const priceTotal = price * totalQty;
            const percentFree = (priceFree / priceTotal) * 100;
            promoType = 2;
            promoQtyMin = discount.qtyMin;
            promoAmount = priceFree;
            // promoAmount = percentFree;
            // console.log(priceTotal, priceFree, priceTotal - priceFree);
          }
        }

        if (findQty() === 0) {
          ctx.setBill((arr) => [
            ...arr,
            {
              id,
              name,
              price,
              productionPrice,
              qty: 1,
              category,
              unit,
              promotionType: promoType,
              promotionQtyMin: promoQtyMin,
              discountAmount: promoAmount,
              isDailyPromotion: discount.isDailyPromotion,
              isLaundryBag
            },
          ]);
        } else {
          ctx.setBill((currentBill) =>
            currentBill.map((item) =>
              item.id === id
                ? {
                  ...item,
                  qty: item.qty + 1,
                  promotionType: promoType,
                  promotionQtyMin: promoQtyMin,
                  discountAmount: promoAmount,
                }
                : item
            )
          );
        }

        if (ctx.currentOrderID !== "") {
          if (findQtyUpdatedBill() === 0) {
            ctx.setUpdatedBill((arr) => [
              ...arr,
              {
                id,
                name,
                price,
                productionPrice,
                qty: 1,
                category,
                unit,
                promotionType: promoType,
                discountAmount: promoAmount,
                isLaundryBag
              },
            ]);
          } else {
            ctx.setUpdatedBill((currentBill) =>
              currentBill.map((item) =>
                item.id === id
                  ? {
                    ...item,
                    qty: item.qty + 1,
                  }
                  : item
              )
            );
          }
        }
      } else {
        setOpenDialog(!openDialog);
      }
    }
  };

  const Ribbon = ({ color = "error", text }) => {
    return (
      <Label
        variant="filled"
        color={color}
        sx={{
          top: 15,
          right: 0,
          zIndex: 9,
          borderRadius: "20px 0px 0px 20px",
          height: 30,
          padding: 2,
          position: "absolute",
          textTransform: "uppercase",
          fontWeight: 400,
          opacity: "1",
        }}
      >
        {text}
      </Label>
    )
  };

  Ribbon.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
  };

  return (
    <>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick()}
        sx={{
          textAlign: "center",
          cursor: "pointer",
          boxShadow: isHovering ? "rgba(0, 0, 0, 0.24) 0px 3px 8px;" : "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        <Box sx={{ position: "relative" }}>
          {!isAvailable ? (
            <Ribbon
              text="out of stock"
            />
          ) : (
            discount.isAvailable && (
              <>
                {discount.amount > 0 && (
                  <Ribbon
                    color="error"
                    text={`Disc ${discount.amount}%`}
                  />
                )}
                {discount.qtyMin > 0 && (
                  <Ribbon
                    color="warning"
                    text={`Order ${discount.qtyMin}, Free ${discount.qtyFree}`}
                  />
                )}
              </>
            )
          )}
          {/* <Image src={image} alt={image} ratio="4/3" sx={{ opacity: isAvailable ? "1" : "0.5" }} /> */}
          <Box
            component="span"
            sx={{
              width: 1,
              lineHeight: 0,
              display: "block",
              overflow: "hidden",
              position: "relative",
              pt: "calc(100% / 4 * 3)",
            }}
          >
            <Box
              component="span"
              sx={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                lineHeight: 0,
                position: "absolute",
                backgroundSize: "cover !important",
              }}
            >
              <img src={image} alt={image} style={{ opacity: isAvailable ? "1" : "0.5", width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
          </Box>
        </Box>
        {/* Elemen tersembunyi untuk pengukuran */}
        <Typography
          ref={contentRef}
          variant="subtitle2"
          noWrap
          sx={{ my: 1, px: 2, visibility: "hidden", position: "absolute", }}
        >
          {name}
        </Typography>
        {/* Render elemen sesuai kondisi */}
        <Tooltip title={name} arrow>
          <Typography
            ref={wrapperRef}
            variant="subtitle2"
            noWrap
            sx={{ my: 1, px: 2, textDecoration: isAvailable ? "none" : "line-through" }}
          >
            {isOverflow ? (
              <Marquee>
                <span style={{ marginRight: 10 }}>
                  {name}
                </span>
              </Marquee>
            ) : (
              <span>
                {name}
              </span>
            )}
          </Typography>
        </Tooltip>
      </Card>

      <ProductDialog
        open={openDialog}
        onClose={handleCloseDialog}
        id={id}
        name={name}
        price={price}
        productionPrice={productionPrice}
        discount={discount}
        category={category}
        unit={unit}
        variant={variant}
        notes={notes}
        amountKg={amountKg}
        isLaundryBag={isLaundryBag}
        isAvailable={isAvailable}
      />
    </>
  );
}
