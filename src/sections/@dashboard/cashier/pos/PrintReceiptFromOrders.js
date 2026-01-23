import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
// hooks
import useAuth from '../../../../hooks/useAuth';
// context
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

const PrintReceiptFromOrders = React.forwardRef(({ data }, ref) => {
  const { user } = useAuth();

  const ctm = useContext(mainContext);

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data) {
      QRCode.toDataURL(data.orderId)
        .then((url) => {
          setImage(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [data]);

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
          <tr>
            <td>Order ID</td>
            <td>: {data.orderId}</td>
          </tr>
          {data?.customer?.name && (
            <tr>
              <td>Customer</td>
              <td>: {data?.customer?.name}</td>
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
          {data.orders.map((item, i) => {
            let originPrice = item.price;
            if (item.isLaundryBag) {
              originPrice += item.discountLaundryBag;
            }

            return (
              <React.Fragment key={i}>
                {/* Nama item dan varian */}
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
                        <em>Notes : {item.notes}</em>
                      </p>
                    )}
                  </td>
                </tr>

                {/* Harga utama */}
                <tr>
                  <td style={{ textAlign: 'left' }}>
                    {`${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''} x ${numberWithCommas(
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
                {item.isLaundryBag && item.discountLaundryBag && (
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <em>Laundry Bag Day: (-Rp. {numberWithCommas(item.discountLaundryBag * item.qty)})</em>
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

                {/* Diskon Promo */}
                {item.promotionType === 1 && (
                  <tr>
                    <td style={{ textAlign: 'left' }}>
                      <em>Disc {item.discountAmount}%</em>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp.{' '}
                      {numberWithCommas(
                        Math.round(item.qty * item.price) -
                          (Math.round(item.qty * item.price) * item.discountAmount) / 100
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

                {/* Spacer */}
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
          {data.serviceCharge > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Biaya Jasa ({data.serviceChargePercentage}%)</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.serviceCharge)}</td>
            </tr>
          )}

          {data.tax > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Pajak ({data.taxPercentage}%)</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.tax)}</td>
            </tr>
          )}

          {data.voucherDiscPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Voucher Diskon</td>
              <td style={{ textAlign: 'right' }}>-Rp. {numberWithCommas(data.voucherDiscPrice)}</td>
            </tr>
          )}

          {data.discountPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>
                <p>Diskon {data?.discountLabel !== 'FIRST WASH' && data.discount > 0 ? `(${data.discount}%)` : ''}</p>
                {data?.discountLabel ? <p style={{ fontSize: '8px' }}>{`(${data.discountLabel})`}</p> : null}
              </td>
              <td style={{ textAlign: 'right' }}>-Rp. {numberWithCommas(data.discountPrice)}</td>
            </tr>
          )}

          {data.deliveryPrice > 0 && (
            <tr>
              <td style={{ textAlign: 'left' }}>Ongkir</td>
              <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.deliveryPrice)}</td>
            </tr>
          )}

          <tr>
            <td style={{ textAlign: 'left' }}>Total</td>
            <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.billedAmount)}</td>
          </tr>
        </tbody>
      </table>

      {data.status?.toLowerCase() === 'paid' && (
        <>
          <Divider />

          <table style={{ width: '100%' }}>
            <tbody>
              {/* Bayar */}
              <tr>
                <td style={{ textAlign: 'left' }}>Bayar</td>
                <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.billedAmount)}</td>
              </tr>

              {/* Kembali */}
              <tr>
                <td style={{ textAlign: 'left' }}>Kembali</td>
                <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(0)}</td>
              </tr>

              {/* Donasi */}
              {data.donation > 0 && (
                <tr>
                  <td style={{ textAlign: 'left' }}>Donasi</td>
                  <td style={{ textAlign: 'right' }}>Rp. {numberWithCommas(data.donation)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Status */}
      <Divider />
      <table style={{ width: '100%' }} className="no-break">
        <tbody>
          <tr>
            <td style={{ textAlign: 'left' }}>Status</td>
            <td style={{ textAlign: 'right' }}>{data.status?.toLowerCase() === 'paid' ? 'Lunas' : 'Belum Lunas'}</td>
          </tr>
        </tbody>
      </table>

      <Divider />
      {ctm.receiptHeader?.notes && (
        <table style={{ width: '100%', fontSize: '8px', marginBottom: '10px' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>{newLineText(ctm.receiptHeader.notes)}</td>
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

export default PrintReceiptFromOrders;

PrintReceiptFromOrders.propTypes = {
  data: PropTypes.object,
};
