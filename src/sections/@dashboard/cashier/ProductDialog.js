import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
// @mui
import {
  Container,
  Button,
  Box,
  Grid,
  IconButton,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  TextField,
  Stack,
  Alert,
  InputAdornment
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// context
import { cashierContext } from "../../../contexts/CashierContext";
// components
import Iconify from "../../../components/Iconify";
// utils
import numberWithCommas from "../../../utils/numberWithCommas";

import OptionCard from "./OptionCard";

// ----------------------------------------------------------------------

ProductDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  productionPrice: PropTypes.number,
  variant: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.string,
  category: PropTypes.string,
  unit: PropTypes.string,
  notes: PropTypes.any,
  discount: PropTypes.any,
  amountKg: PropTypes.number,
  isLaundryBag: PropTypes.bool,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
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
            position: "absolute",
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

const QuantityButton = styled(Button)(() => ({
  cursor: "default",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export default function ProductDialog({ open, onClose, id, name, price, productionPrice, variant, category, unit, notes, discount, amountKg, isLaundryBag }) {
  const ctx = useContext(cashierContext);
  const currTheme = useTheme();
  const discBag = 0.15;

  const [selectedLaundryBag, setSelectedLaundryBag] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [currPrice, setCurrPrice] = useState(0);
  const [variantTotalPrice, setVariantTotalPrice] = useState(0);
  const [variantTotalProductionPrice, setVariantTotalProductionPrice] = useState(0);
  const [totalProductionPrice, setTotalProductionPrice] = useState(productionPrice);
  const [currNotes, setCurrNotes] = useState("");
  const [defaultMandatory, setDefaultMandatory] = useState(0);
  const [totalMandatory, setTotalMandatory] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrPrice(price);
      const sum = variant.filter((row) => row.isMandatory === true).length;
      setDefaultMandatory(sum);
    }
  }, [open]);

  useEffect(() => {
    const sumVariantPrice = selectedVariant.reduce((acc, i) => {
      return acc + ((Math.round(i.price * i.qty)) * (amountKg > 0 ? amountKg : 1));
    }, 0);
    const sumVariantProductionPrice = selectedVariant.reduce((acc, i) => {
      return acc + ((Math.round(i.productionPrice * i.qty)) * (amountKg > 0 ? amountKg : 1));
    }, 0);
    const tPrice = price + sumVariantPrice;
    setVariantTotalPrice(sumVariantPrice);
    setVariantTotalProductionPrice(sumVariantProductionPrice);
    setCurrPrice((selectedLaundryBag ? (tPrice - (tPrice * discBag)) : tPrice) * (quantity > 0 ? quantity : 1));

  }, [selectedVariant, selectedLaundryBag]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedLaundryBag(false);
      setQuantity(0);
      setCurrPrice(price);
      setVariantTotalPrice(0);
      setVariantTotalProductionPrice(0);
      setTotalProductionPrice(0);
      setCurrNotes("");
      setSelectedVariant([]);
      setTotalMandatory(0);
    }, 100);
  };

  useEffect(() => {
    const tPrice = price + variantTotalPrice;
    if (quantity > 0) {
      setCurrPrice(Math.round((selectedLaundryBag ? (tPrice - (tPrice * discBag)) : tPrice) * quantity));
    } else {
      setCurrPrice(selectedLaundryBag ? (tPrice - (tPrice * discBag)) : tPrice);
    }
  }, [quantity]);

  const handleSelectedVariant = (variant, option, variantPrice = 0, variantProductionPrice = 0, variantQty = 1) => {
    if (selectedVariant.find((data) => data.name.toLowerCase().indexOf(variant.variantRef.name.toLowerCase()) !== -1)) {
      // jika variant option yang dipilih sama
      if (selectedVariant.find((data) => data.name === variant.variantRef.name && data.option === option)) {
        const filteredData = selectedVariant.filter((row) => row.name !== variant.variantRef.name || row.option !== option);
        setSelectedVariant(filteredData);
        if (variant.isMandatory) {
          const check = filteredData.find((data) => data.name === variant.variantRef.name);
          if (!check) {
            setTotalMandatory((i) => i - 1);
          }
        }
      } else {
        if (variant.isMandatory) {
          if (selectedVariant.find((data) => data.name === variant.variantRef.name).length === 1) {
            setTotalMandatory((i) => i - 1);
          }
        }
        if (!variant.isMultiple) {
          setSelectedVariant((arr) => arr.filter((row) => row.name.toLowerCase().indexOf(variant.variantRef.name.toLowerCase()) === -1));
        }
        setSelectedVariant((arr) => [
          ...arr,
          {
            name: variant.variantRef.name,
            option,
            price: variantPrice,
            productionPrice: variantProductionPrice,
            qty: variantQty
          }
        ]);
      }
    } else {
      if (variant.isMandatory) {
        setTotalMandatory((i) => i + 1);
      }
      setSelectedVariant((arr) => [
        ...arr,
        {
          name: variant.variantRef.name,
          option,
          price: variantPrice,
          productionPrice: variantProductionPrice,
          qty: variantQty
        }
      ]);
    }
  };

  const handleDecreaseVariant = (index) => {
    setSelectedVariant(prev => {
      const updated = [...prev];

      // Cek apakah data pada index ada
      if (!updated[index]) return prev;

      if (updated[index].qty > 1) {
        updated[index] = {
          ...updated[index],
          qty: updated[index].qty - 1,
        };
      }

      return updated;
    });
  };

  const handleIncreaseVariant = (index) => {
    setSelectedVariant(prev => {
      const updated = [...prev];

      // Cek apakah data pada index ada
      if (!updated[index]) return prev;

      updated[index] = {
        ...updated[index],
        qty: updated[index].qty + 1,
      };

      return updated;
    });
  };



  const handleClick = () => {
    const tPrice = price + variantTotalPrice;

    let promoType = 0;
    let promoQtyMin = 0;
    let promoAmount = 0;
    if (discount.isAvailable && discount.amount) {
      promoType = 1;
      promoAmount = discount.amount;
    }
    if (discount.isAvailable && discount.qtyMin) {
      if (quantity >= discount.qtyMin) {
        const qtyFree = Math.floor(quantity / discount.qtyMin);
        const priceFree = tPrice * qtyFree;
        const priceTotal = tPrice * quantity;
        const percentFree = (priceFree / priceTotal) * 100;
        promoType = 2;
        promoQtyMin = discount.qtyMin;
        promoAmount = priceFree;
        // promoAmount = percentFree;
        console.log(priceTotal, priceFree, priceTotal - priceFree);
      }
    }

    ctx.setBill((arr) => [
      ...arr,
      {
        id,
        name,
        price: selectedLaundryBag ? (tPrice - (tPrice * discBag)) : tPrice,
        productionPrice: totalProductionPrice + variantTotalProductionPrice,
        qty: quantity,
        category,
        unit,
        promotionType: promoType,
        promotionQtyMin: promoQtyMin,
        discountAmount: promoAmount,
        isDailyPromotion: selectedLaundryBag ? true : discount.isDailyPromotion,
        variant: selectedVariant,
        notes: currNotes,
        discountLaundryBag: selectedLaundryBag ? (tPrice * discBag) : 0,
        isLaundryBag: selectedLaundryBag
      }
    ]);

    if (ctx.currentOrderID !== "") {
      ctx.setUpdatedBill((arr) => [
        ...arr,
        {
          id,
          name,
          price: selectedLaundryBag ? (tPrice - (tPrice * discBag)) : tPrice,
          productionPrice: totalProductionPrice + variantTotalProductionPrice,
          qty: quantity,
          category,
          unit,
          promotionType: promoType,
          promotionQtyMin: promoQtyMin,
          discountAmount: promoAmount,
          isDailyPromotion: selectedLaundryBag ? true : discount.isDailyPromotion,
          variant: selectedVariant,
          notes: currNotes,
          discountLaundryBag: selectedLaundryBag ? (tPrice * discBag) : 0,
          isLaundryBag: selectedLaundryBag
        },
      ]);
    }

    handleClose();
  };

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" fullWidth maxWidth="sm" open={open}>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        style={{ borderBottom: "1px solid #ccc", textAlign: "center", fontSize: "calc(1rem + 0.5vw)" }}
      >
        {name} - Rp. {numberWithCommas(currPrice)}
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Container>
          {variant.length > 0 &&
            variant.map((variant, v) => (
              variant.variantRef ? (
                <Box key={v}>
                  <Stack flexDirection="row" gap={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">
                      {variant.variantRef.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      ({variant.isMandatory ? "Wajib" : "Optional"}, {variant.isMultiple ? "Bisa Beberapa" : "Pilih Satu"})
                    </Typography>
                  </Stack>
                  <Grid container spacing={3} sx={{ mb: 3, height: "auto" }}>
                    {variant.variantRef.options.map((option, n) => {
                      const checkIndex = selectedVariant.findIndex(
                        (data) =>
                          data.name === variant.variantRef.name &&
                          data.option === option.name
                      );

                      const checkData = checkIndex !== -1 ? selectedVariant[checkIndex] : null;
                      return (
                        <Grid item xs={6} sm={4} key={n}>
                          <FormControl fullWidth>
                            <OptionCard
                              onClick={() => handleSelectedVariant(variant, option.name, option.price, option.productionPrice)}
                              active={checkData ? Boolean(true) : Boolean(false)}
                              title={option.name}
                              price={option.price}
                              isMultiple={checkData && option.isMultiple}
                            />
                            {checkData && option.isMultiple && (
                              <Stack flexDirection="row">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    height: 30,
                                    minWidth: 2,
                                    fontSize: "x-large"
                                  }}
                                  fullWidth
                                  onClick={() => handleDecreaseVariant(checkIndex)}
                                >
                                  -
                                </Button>
                                <QuantityButton
                                  variant="outlined"
                                  size="small"
                                  sx={{ borderRadius: 0, height: 30, fontSize: "medium" }}
                                  fullWidth
                                >
                                  {checkData?.qty}
                                </QuantityButton>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    height: 30,
                                    minWidth: 2,
                                    fontSize: "x-large"
                                  }}
                                  fullWidth
                                  onClick={() => handleIncreaseVariant(checkIndex)}
                                >
                                  +
                                </Button>
                              </Stack>
                            )}
                          </FormControl>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              ) : (
                <Alert key={v} severity="error" sx={{ mb: 2 }}>Data variant terhapus, silakan atur ulang di library product.</Alert>
              )
            ))
          }

          {isLaundryBag && (
            <Box>
              <Stack flexDirection="column" gap={0} sx={{ mb: 1 }}>
                <Stack flexDirection="row" gap={1}>
                  <Typography variant="subtitle2">
                    LAUNDRY BAG DAY
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {`(Diskon 15%, Setiap Selasa)`}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="error" fontStyle="italic">
                  *Jika menggunakan Laundry Bag <b>di hari lain</b>, harap tulis di notes.
                </Typography>
              </Stack>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth>
                    <OptionCard
                      onClick={() => setSelectedLaundryBag(false)}
                      active={!selectedLaundryBag ? Boolean(true) : Boolean(false)}
                      title="Tidak"
                      isBag
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth>
                    <OptionCard
                      onClick={() => setSelectedLaundryBag(true)}
                      active={selectedLaundryBag ? Boolean(true) : Boolean(false)}
                      title="Ya"
                      isBag
                      disabled={!ctx.isLaundryBagDay}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {notes && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      id="notes"
                      name="notes"
                      label="Add Notes"
                      type="text"
                      autoComplete="off"
                      multiline
                      rows={2}
                      onChange={(e) => setCurrNotes(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* <Button
              variant="outlined"
              size="large"
              sx={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
              onClick={handleMinus}
            >
              <Typography variant="h4">-</Typography>
            </Button> */}
            {/* <QuantityButton variant="outlined" size="large" sx={{ borderRadius: "0" }}>
              <Typography variant="subtitle1">{quantity}</Typography>
            </QuantityButton> */}
            <TextField
              size="medium"
              name="quantity"
              autoComplete="off"
              autoFocus
              type="number"
              sx={{
                width: "100px",
                "& .MuiOutlinedInput-root": {
                  // borderRadius: "0px",
                  paddingRight: "10px",
                  "& fieldset": {
                    borderColor: currTheme.palette.primary.light,
                  },
                  "&:hover fieldset": {
                    borderColor: currTheme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: currTheme.palette.primary.light,
                    border: `1px solid ${currTheme.palette.primary.main}`
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12.5px 10px"
                }
              }}
              InputProps={{
                inputProps: { min: category?.toLowerCase() === "kiloan" ? 3 : 1, style: { textAlign: "center" } },
                endAdornment: <InputAdornment position="end">{unit || "pcs"}</InputAdornment>
              }}
              value={quantity === 0 ? "" : quantity}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, "");
                setQuantity(value === "" ? "" : Number(value));
              }}
            />
            {/* <Button
              variant="outlined"
              size="large"
              sx={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              onClick={handlePlus}
              >
              <Typography variant="h5">+</Typography>
              </Button> */}
          </Box>
          {category?.toLowerCase() === "kiloan" && (
            <Typography variant="body2" color="error" fontStyle="italic" textAlign="center">
              *Jika <b>{`< 3kg`}</b>, mohon bulatkan ke 3kg
            </Typography>
          )}
        </Container>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={quantity === "" || (category?.toLowerCase() === "kiloan" ? quantity < 3 : quantity === 0) || defaultMandatory > totalMandatory ? Boolean(true) : Boolean(false)}
          onClick={() => handleClick()}
        >
          Save
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
