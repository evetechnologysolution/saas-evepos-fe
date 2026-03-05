import React, { useContext } from 'react';
// @mui
import { Alert, Button, Typography } from '@mui/material';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
// import { mainContext } from "../../../../contexts/MainContext";
// components
import Iconify from '../../../../components/Iconify';
// utils
// import { numberWithCommas, randomCustomer } from "../../../../utils/getData";
import { numberWithCommas } from '../../../../utils/getData';

export default function Bill() {
  const ctx = useContext(cashierContext);
  // const ctm = useContext(mainContext);

  // const handleResetBill = () => {
  //   ctx.handleResetPos();
  //   // if (!ctm.generalSettings?.dineIn?.table && !ctm.generalSettings?.dineIn?.customer) {
  //   //   ctx.setCustomerName(randomCustomer());
  //   // }
  // };

  return (
    <>
      {ctx.dp > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {' '}
          Telah masuk dp sebesar <b>Rp. {numberWithCommas(ctx.dp)}</b>
        </Alert>
      )}
      {ctx.voucherCode && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {' '}
          Voucher : <b>{ctx.voucherCode}</b>
        </Alert>
      )}
      {ctx.bill.length > 0 ? (
        <>
          <table style={{ marginTop: '16px', width: '100%' }}>
            <thead style={{ color: '#6c757d!important', fontSize: '0.9rem' }}>
              <tr>
                <th align="left" width="50px">
                  QTY
                </th>
                <th align="left">ITEMS</th>
                <th align="right" width="100px">
                  PRICE
                </th>
                <th width="50px" />
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {ctx.bill.map((item, i) => {
                const originPrice = item.price;
                return (
                  <tr key={i}>
                    <td>{`${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''}`} x</td>
                    <td>
                      {item.name}
                      {item?.variant &&
                        item?.variant?.map((variant, v) => (
                          <Typography key={v} variant="inherit" sx={{ opacity: 0.7 }}>
                            {`${variant.name} : ${variant.option} ${variant.qty > 1 ? `(x${variant.qty})` : ''}`}
                          </Typography>
                        ))}
                      {item.promotionLabel && (
                        <Typography variant="inherit" sx={{ opacity: 0.7 }}>
                          Laundry Bag Day
                        </Typography>
                      )}
                      {item.notes && (
                        <Typography variant="inherit" sx={{ opacity: 0.7 }}>{`Notes : ${item.notes}`}</Typography>
                      )}
                      {item?.variant?.length > 0 && <p style={{ marginBottom: '8px' }} />}
                    </td>
                    <td align="right">
                      <span>Rp. {numberWithCommas(Math.round(item.qty * originPrice))}</span>
                      {item.discountAmount ? (
                        <>
                          <br />
                          <span style={{ color: '#FF4842', fontStyle: 'italic', fontWeight: 400, fontSize: '0.75rem' }}>
                            Disc{' '}
                            {item.promotionType === 2
                              ? `Rp. ${numberWithCommas(item.discountAmount)}`
                              : `${item.discountAmount}%`}
                          </span>
                          <br />
                          <span>
                            Rp.
                            {numberWithCommas(
                              item.promotionType === 2
                                ? Math.round(item.qty * item.price) - item.discountAmount
                                : Math.round(item.qty * item.price) -
                                    (Math.round(item.qty * item.price) * item.discountAmount) / 100
                            )}
                          </span>
                        </>
                      ) : null}
                    </td>

                    <td align="right">
                      <Button
                        color="error"
                        variant="contained"
                        sx={{
                          boxShadow: '0',
                          p: 0,
                          minWidth: 30,
                          height: 30,
                          mb: 0.5,
                          bgcolor: '#FFC2B4',
                          color: 'red',
                          '&:hover': {
                            bgcolor: '#FFC2B4',
                          },
                        }}
                        size="large"
                        // onClick={() => {
                        //   if (ctx.bill[i].qty >= 2) {
                        //     ctx.setBill((currentBill) =>
                        //       currentBill.map((data, index) =>
                        //         index === i
                        //           ? {
                        //             ...data,
                        //             qty: Math.round(data.qty - 1),
                        //           }
                        //           : data
                        //       )
                        //     );
                        //   } else {
                        //     ctx.setBill((currentBill) => currentBill.filter((row, index) => index !== i));
                        //   }
                        // }}
                        onClick={() => {
                          ctx.setBill((currentBill) =>
                            currentBill
                              .map((data, index) => {
                                if (index === i) {
                                  const minQty = data?.category?.toLowerCase() === 'kiloan' ? 3 : 1;
                                  const nextQty = data.qty - 1;
                                  const newQty = nextQty < minQty ? 0 : nextQty;

                                  // Hitung promo buy X get Y hanya jika masih ada qty
                                  let promoType = data?.promotionType || 0;
                                  let promoQtyMin = data?.promotionQtyMin || 0;
                                  let promoAmount = data?.discountAmount || 0;

                                  if (data.promotionType === 1) {
                                    // jika diskon
                                    promoType = data.promotionType;
                                    promoQtyMin = 0;
                                    promoAmount = data.discountAmount;
                                  } else if (
                                    // jika bundle
                                    data.promotionType === 2 &&
                                    data.promotionQtyMin &&
                                    newQty >= data.promotionQtyMin
                                  ) {
                                    const qtyFree = Math.floor(newQty / data.promotionQtyMin);
                                    const priceFree = data.price * qtyFree;
                                    promoType = data.promotionType;
                                    promoQtyMin = data.promotionQtyMin;
                                    promoAmount = priceFree;
                                  } else {
                                    promoType = 0;
                                    promoQtyMin = 0;
                                    promoAmount = 0;
                                  }

                                  return {
                                    ...data,
                                    qty: newQty,
                                    promotionType: promoType,
                                    promotionQtyMin: promoQtyMin,
                                    discountAmount: promoAmount,
                                  };
                                }
                                return data;
                              })
                              // filter kalau qty 0
                              .filter((row) => row.qty > 0)
                          );
                        }}
                      >
                        <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{
              boxShadow: "0", bgcolor: "#FFC2B4", color: "red",
              "&:hover": {
                bgcolor: "#FFC2B4"
              },
            }}
            onClick={handleResetBill}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} width={24} height={24} />
            Clear Items
          </Button> */}
        </>
      ) : (
        <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
          No Items
        </Typography>
      )}
    </>
  );
}
