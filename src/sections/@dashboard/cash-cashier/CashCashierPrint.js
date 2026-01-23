import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// hooks
import useAuth from '../../../hooks/useAuth';
// context
import { mainContext } from '../../../contexts/MainContext';
// utils
import { numberWithCommas, formatDate2 } from '../../../utils/getData';
import { headerPrint } from '../../../_mock/headerPrint';
import '../cashier/pos/PrintReceipt.scss';

// ----------------------------------------------------------------------

const CashCashierPrint = React.forwardRef(({ content, items }, ref) => {
  const { user } = useAuth();

  const ctm = useContext(mainContext);

  const eWallet = content.detail.dana + content.detail.ovo + content.detail.shopeePay + content.detail.qris;
  const card = content.detail.bri + content.detail.bni + content.detail.bca + content.detail.mandiri;

  const closeCashier = content.history.find((item) => item.title === 'Tutup Kas' && item.isCashOut === true);

  const cashOut = closeCashier ? content.cashOut - closeCashier.amount : content.cashOut;

  const truncateString = (text) => {
    const maxLength = 15;
    const str = text.toString();
    const truncatedText = str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;

    return <span>{truncatedText}</span>;
  };

  const checkPrice = (val) => {
    if (val.promotionType === 1) {
      return val.price - val.price * (Number(val.discountAmount) / 100);
    }
    return val.price;
  };

  return (
    <div ref={ref} className="no-break">
      <p style={{ textTransform: 'uppercase' }}>{ctm.receiptHeader?.name || headerPrint.name}</p>

      <p>
        {ctm.receiptHeader?.address ? `${ctm.receiptHeader.address},` : `${headerPrint.address},`}
        <br />
        {ctm.receiptHeader?.region ? `${ctm.receiptHeader.region}, ` : `${headerPrint.region}, `}
        {ctm.receiptHeader?.city ? `${ctm.receiptHeader.city}, ` : `${headerPrint.city}, `}
        {ctm.receiptHeader?.province ? `${ctm.receiptHeader.province} ` : `${headerPrint.province} `}
        {ctm.receiptHeader?.zipCode || headerPrint.zipCode}
        <br />
        {ctm.receiptHeader?.phone || headerPrint.phone}
      </p>

      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />
      <h4>LAPORAN SHIFT</h4>
      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

      <div style={{ textAlign: 'left' }}>
        <table>
          <tbody>
            <tr>
              <td>Created by</td>
              <td>: {user?.fullname || 'Cashier'}</td>
            </tr>
            <tr>
              <td>Start Shift</td>
              <td>: {formatDate2(content.startDate)}</td>
            </tr>
            <tr>
              <td>End Shift</td>
              <td>: {formatDate2(content.endDate ? content.endDate : new Date())}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {items?.length > 0 && (
        <div>
          <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />
          <h4>Produk</h4>
          <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

          {/* {items?.map((item, index) => (
                        item.status === "Paid" && (
                            <div key={index}>
                                {item?.orders?.map((row, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <div style={{ textAlign: "left" }}>
                                            <p>{formatDate2(item.date)}</p>
                                            <p>{truncateString(row.name)}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p>{`${row.qty}x ${numberWithCommas(checkPrice(row))}`}</p>
                                            <p>Rp. {numberWithCommas(row.qty * checkPrice(row))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ))} */}

          {items?.map(
            (item, index) =>
              item.status === 'Paid' && (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div>
                    <p style={{ textAlign: 'left' }}>{formatDate2(item.date)}</p>
                    {item?.orders?.map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'left' }}>
                          <p>{truncateString(row.name)}</p>
                          <p>{`${row.qty}x ${numberWithCommas(checkPrice(row))}`}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <br />
                          <p>Rp. {numberWithCommas(row.qty * checkPrice(row))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />
      <h4>Kas Kasir</h4>
      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>Sales</p>
        <p>Rp. {numberWithCommas(content.sales)}</p>
      </div>

      {content.history.length > 0 &&
        content.history.map((item, i) => (
          <div key={i} style={{ margin: '5px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ textAlign: 'left' }}>
                {item.isCashOut ? 'Cash Out' : 'Cash In'} <br />
                <span style={{ fontSize: '9px', fontStyle: 'italic' }}>({truncateString(item.title)})</span>
              </p>
              {item.isCashOut ? (
                <p>(-Rp. {numberWithCommas(item.amount)})</p>
              ) : (
                <p>Rp. {numberWithCommas(item.amount)}</p>
              )}
            </div>
          </div>
        ))}

      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />
      <h4>Pajak & Lain-lain</h4>
      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

      <div style={{ margin: '5px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Tax</p>
          <p>Rp. {numberWithCommas(content.tax)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Service Charge</p>
          <p>Rp. {numberWithCommas(content.serviceCharge)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Refund</p>
          <p>Rp. {numberWithCommas(content.refund)}</p>
        </div>
      </div>

      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />
      <h4>Keterangan Lanjutan</h4>
      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

      <div style={{ margin: '5px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Cash</p>
          <p>Rp. {numberWithCommas(content.detail.cash)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>E-Wallet</p>
          <p>Rp. {numberWithCommas(eWallet)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Card</p>
          <p>Rp. {numberWithCommas(card)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ textAlign: 'left' }}>Setor Tunai</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ textAlign: 'left', fontSize: '9px', fontStyle: 'italic' }}>(diharapkan)</p>
          <p>Rp. {numberWithCommas(content.detail.cash + content.cashIn + eWallet + card - cashOut)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ textAlign: 'left', fontSize: '9px', fontStyle: 'italic' }}>(realisasi)</p>
          <p>Rp. {numberWithCommas(closeCashier?.amount || 0)}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Selisih</p>
          <p>
            Rp.{' '}
            {numberWithCommas(
              closeCashier?.amount
                ? content?.difference || 0
                : -(content.detail.cash + content.cashIn + eWallet + card) - cashOut
            )}
          </p>
        </div>

        {content.notes && (
          <div style={{ textAlign: 'left', fontSize: '9px', fontStyle: 'italic' }}>
            <p>*Catatan:</p>
            <p>{content.notes}</p>
          </div>
        )}
      </div>

      <div style={{ borderBottom: '1.7px dashed #000000', margin: '10px auto' }} />

      <p className="powered">Powered by EvePOS</p>
    </div>
  );
});

export default CashCashierPrint;

CashCashierPrint.propTypes = {
  content: PropTypes.object,
  items: PropTypes.array,
};
