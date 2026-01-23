import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
// hooks
import useAuth from '../../../../hooks/useAuth';
// context
import { cashierContext } from '../../../../contexts/CashierContext';
import { mainContext } from '../../../../contexts/MainContext';
// utils
import { numberWithCommas, formatDate2 } from '../../../../utils/getData';
import newLineText from '../../../../utils/newLineText';
import { headerPrint } from '../../../../_mock/headerPrint';
import './PrintReceipt.scss';

// ----------------------------------------------------------------------

const Divider = () => {
  return <div style={{ borderBottom: '1.9px dashed #000000', margin: '10px auto' }} />;
};

const PrintReceipt = React.forwardRef(({ bill, status = 'paid' }, ref) => {
  const { user } = useAuth();

  const ctx = useContext(cashierContext);
  const ctm = useContext(mainContext);

  const [currServiceCharge, setCurrServiceCharge] = useState(ctx.serviceCharge);
  const [currTax, setCurrTax] = useState(ctx.tax);

  const [image, setImage] = useState(null);

  const checkPoint = (value) => {
    // Tidak ada point jika bukan dari scan member atau bukan order online
    if (ctx.customerScan || ctx.customerData.address) {
      if (value < 10000) {
        return 0; // Tidak ada kelipatan jika nilai kurang dari 10.000
      }
      const count = Math.floor(value / 10000); // Menghitung jumlah kelipatan
      return count;
    }
    return 0;
  };

  useEffect(() => {
    if (ctx.displayOrderID) {
      QRCode.toDataURL(ctx.displayOrderID)
        .then((url) => {
          setImage(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ctx.displayOrderID]);

  useEffect(() => {
    const sumPrice = bill.reduce((acc, i) => {
      const tot = Math.round(i.price * i.qty);
      if (i.promotionType === 1) {
        return acc + (tot - (tot * i.discountAmount) / 100);
      }
      if (i.promotionType === 2) {
        return acc + (tot - i.discountAmount);
      }
      return acc + tot;
    }, 0);

    let serviceAmount = 0;
    let taxAmount = 0;
    const taxFor = ctx.orderType?.toLowerCase() === 'delivery' ? 'delivery' : 'onsite';

    if (ctx?.taxSetting?.serviceCharge?.isActive && ctx?.taxSetting?.serviceCharge?.orderType?.includes(taxFor)) {
      serviceAmount = (ctx.taxSetting.serviceCharge.percentage * sumPrice) / 100;
      setCurrServiceCharge((ctx.taxSetting.serviceCharge.percentage * sumPrice) / 100);
    }

    if (ctx?.taxSetting?.tax?.isActive && ctx?.taxSetting?.tax?.orderType?.includes(taxFor)) {
      taxAmount = (ctx.taxSetting.tax.percentage * (sumPrice + serviceAmount)) / 100;
      setCurrTax((ctx.taxSetting.tax.percentage * (sumPrice + serviceAmount)) / 100);
    }

    ctx.setActualPrice(
      sumPrice + serviceAmount + taxAmount - ctx.voucherDiscPrice - ctx.discountPrice + ctx.deliveryPrice
    );
  }, [bill]);

  return (
    <div ref={ref} className="no-break">
      <p style={{ textTransform: 'uppercase' }}>{ctm.receiptHeader?.name || headerPrint.name}</p>

      {ctm.receiptHeader?.isPrintLogo && ctm.receiptHeader?.image && (
        <img alt="Logo" src={ctm.receiptHeader?.image} style={{ width: '50px', margin: '1px auto' }} />
      )}

      <p style={{ fontSize: '11px' }}>
        {ctm.receiptHeader?.address ? `${ctm.receiptHeader.address},` : `${headerPrint.address},`}
        <br />
        {ctm.receiptHeader?.region ? `${ctm.receiptHeader.region}, ` : `${headerPrint.region}, `}
        {ctm.receiptHeader?.city ? `${ctm.receiptHeader.city}, ` : `${headerPrint.city}, `}
        {ctm.receiptHeader?.province ? `${ctm.receiptHeader.province} ` : `${headerPrint.province} `}
        {ctm.receiptHeader?.zipCode || headerPrint.zipCode}
      </p>

      <p style={{ fontSize: '11px' }}>{ctm.receiptHeader?.phone || headerPrint.phone}</p>

      {ctm.receiptHeader?.web && <p style={{ fontSize: '11px' }}>{ctm.receiptHeader?.web}</p>}

      <Divider />

      <table style={{ width: '100%', textAlign: 'left' }}>
        <tbody>
          <tr>
            <td>Date</td>
            <td>: {formatDate2(new Date())}</td>
          </tr>
          {ctx.displayOrderID && (
            <tr>
              <td>Order ID</td>
              <td>: {ctx.displayOrderID}</td>
            </tr>
          )}
          {ctx.customerName && (
            <tr>
              <td>Customer</td>
              <td>: {ctx.customerName}</td>
            </tr>
          )}
          <tr>
            <td>Created by</td>
            <td>: {user?.fullname || 'Cashier'}</td>
          </tr>
        </tbody>
      </table>

      <Divider />

      <table style={{ width: '100%' }}>
        <tbody>
          {bill.map((item, i) => {
            let originPrice = item.price;
            if (item.isLaundryBag) {
              originPrice += item.discountLaundryBag;
            }

            return (
              <React.Fragment key={i}>
                {/* Nama item & info tambahan */}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'left' }}>
                    <p>{item.name}</p>
                    {item?.variant?.length > 0 &&
                      item.variant.map((field, v) => (
                        <p key={v}>
                          <em>{`${field?.name} : ${field?.option} ${field?.qty > 1 ? `(x${field?.qty})` : ''}`}</em>
                        </p>
                      ))}
                    {item.notes && (
                      <p>
                        <em>Notes: {item.notes}</em>
                      </p>
                    )}
                  </td>
                </tr>

                {/* Qty x Harga & Harga awal */}
                <tr>
                  <td style={{ textAlign: 'left' }}>
                    {`${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''} x Rp. ${numberWithCommas(
                      originPrice
                    )}`}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      textDecoration:
                        item.promotionType === 1 || item.promotionType === 2 || item.isLaundryBag
                          ? 'line-through'
                          : 'none',
                    }}
                  >
                    Rp. {numberWithCommas(Math.round(item.qty * originPrice))}
                  </td>
                </tr>

                {/* Diskon Laundry Bag */}
                {item.isLaundryBag && item.discountLaundryBag > 0 && (
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <em>Laundry Bag Day</em>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        textDecoration: item.promotionType === 1 ? 'line-through' : 'none',
                      }}
                    >
                      Rp. {numberWithCommas(Math.round(item.qty * item.price))}
                    </td>
                  </tr>
                )}

                {/* Diskon Promosi */}
                {item.promotionType === 1 && (
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <em>Disc {item.discountAmount}%</em>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp.{' '}
                      {numberWithCommas(
                        Math.round(item.qty * item.price - (item.qty * item.price * item.discountAmount) / 100)
                      )}
                    </td>
                  </tr>
                )}
                {item.promotionType === 2 && (
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <em>Disc Rp. {numberWithCommas(item.discountAmount)}</em>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp. {numberWithCommas(Math.round(item.qty * item.price) - item.discountAmount)}
                    </td>
                  </tr>
                )}

                {/* Spacer antar item */}
                <tr>
                  <td colSpan={2} style={{ height: '8px' }} />
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <Divider />

      <table style={{ width: '100%' }}>
        <tbody>
          {ctx.serviceCharge > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Biaya Jasa ({ctx.serviceChargePercentage}%)</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(currServiceCharge)}</td>
            </tr>
          )}
          {ctx.tax > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Pajak ({ctx.taxPercentage}%)</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(currTax)}</td>
            </tr>
          )}
          {ctx.voucherDiscPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Voucher Diskon</td>
              <td style={{ textAlign: 'right' }}>-Rp. {numberWithCommas(ctx.voucherDiscPrice)}</td>
            </tr>
          )}
          {ctx.discountPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>
                <p>Diskon {ctx?.discountLabel !== 'FIRST WASH' && ctx.discount > 0 && `${ctx.discount}%`}</p>
                {ctx?.discountLabel ? <p style={{ fontSize: '8px' }}>{`(${ctx.discountLabel})`}</p> : null}
              </td>
              <td style={{ textAlign: 'right' }}>-Rp. {numberWithCommas(ctx.discountPrice)}</td>
            </tr>
          )}
          {ctx.deliveryPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Ongkir</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(ctx.deliveryPrice)}</td>
            </tr>
          )}
          <tr>
            <td style={{ textAlign: 'left' }}>Total</td>
            <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(ctx.actualPrice)}</td>
          </tr>

          {ctx.havePaid - ctx.amountBill > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Telah Dibayar</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(ctx.havePaid - ctx.amountBill)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {status?.toLowerCase() === 'paid' && <Divider />}

      <table style={{ width: '100%' }}>
        <tbody>
          {ctx.havePaid - ctx.amountBill > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Tagihan</td>
              <td style={{ textAlign: 'right' }}>
                Rp. {numberWithCommas(ctx.actualPrice - (ctx.havePaid - ctx.amountBill))}
              </td>
            </tr>
          )}

          {status?.toLowerCase() === 'paid' && (
            <>
              <tr>
                <td style={{ textAlign: 'left' }}>Bayar</td>
                <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(ctx.amountPaid)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Kembali</td>
                <td style={{ textAlign: 'right' }}>
                  Rp.{' '}
                  {numberWithCommas(
                    ctx.havePaid > 0
                      ? ctx.amountPaid - (ctx.actualPrice - (ctx.havePaid - ctx.amountBill))
                      : ctx.amountPaid - ctx.amountBill
                  )}
                </td>
              </tr>
              {ctx.donation > 0 && (
                <tr>
                  <td style={{ textAlign: 'left' }}>Donasi</td>
                  <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(ctx.donation)}</td>
                </tr>
              )}
            </>
          )}

          <tr>
            <td style={{ textAlign: 'left' }}>Status</td>
            <td style={{ textAlign: 'right' }}>{status?.toLowerCase() === 'paid' ? 'Lunas' : 'Belum Lunas'}</td>
          </tr>
        </tbody>
      </table>

      {/* {status?.toLowerCase() === "paid" && (
                <>
                    <Divider />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Poin Baru</p>
                        <p>{numberWithCommas(checkPoint(ctx.actualPrice))}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Total Poin</p>
                        <p>{numberWithCommas(Number(checkPoint(ctx.actualPrice)) + Number(ctx.customerPoint))}</p>
                    </div>
                </>
            )} */}

      <Divider />
      {ctm.receiptHeader?.notes && (
        <table style={{ width: '100%', fontSize: '8px', marginBottom: '10px' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>{newLineText(ctm.receiptHeader?.notes)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {image && <img alt="QR Code" src={image} style={{ width: '100px' }} />}
      <p className="powered">Powered by EvePOS</p>
      <br />
      <p style={{ fontSize: '8px', fontStyle: 'italic' }}>
        Bawa nota saat pengambilan laundry. Tanpa nota, wajib menyertakan nama lengkap & nomor HP.
      </p>
      <Divider />
      <Divider />
      <br />
      <br />
    </div>
  );
});

export default PrintReceipt;

PrintReceipt.propTypes = {
  bill: PropTypes.array,
  status: PropTypes.string,
};
