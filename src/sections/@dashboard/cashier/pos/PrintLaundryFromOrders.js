import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import useAuth from '../../../../hooks/useAuth';
import { formatDate2 } from '../../../../utils/getData';
import './PrintReceipt.scss';

// ----------------------------------------------------------------------

const Divider = () => (
  <div style={{ borderBottom: '1.9px dashed #000', margin: '10px auto' }} />
);

const HeaderTable = ({ data, user, spkId }) => (
  <table style={{ width: '100%', textAlign: 'left' }}>
    <tbody>
      <tr>
        <td>Date</td>
        <td>: {formatDate2(new Date())}</td>
      </tr>
      <tr>
        <td>Order ID</td>
        <td>: {data?.orderId || ''}</td>
      </tr>

      {data?.customer?.name && (
        <tr>
          <td>Customer</td>
          <td>: {data.customer.name}</td>
        </tr>
      )}

      <tr>
        <td>Created by</td>
        <td>: {user?.fullname || 'Cashier'}</td>
      </tr>

      {spkId && (
        <tr>
          <td>SPK ID</td>
          <td>: {spkId}</td>
        </tr>
      )}
    </tbody>
  </table>
);

const ItemRow = ({ item }) => {
  const isKiloan = item?.category?.toLowerCase() === 'kiloan';

  return (
    <tr>
      <td style={{ width: '25%', verticalAlign: 'top' }}>
        {item?.qty}{' '}
        <em style={{ fontSize: '11px' }}>
          {isKiloan ? 'kg' : item?.unit}
        </em>
      </td>

      <td>
        <p>{item?.name}</p>

        {item?.variant?.map((v, i) => (
          <p key={i}>
            <em>
              {v?.name} : {v?.option}{' '}
              {v?.qty > 1 ? `(x${v.qty})` : ''}
            </em>
          </p>
        ))}

        {item?.notes && (
          <p>
            <em>Notes: {item.notes}</em>
          </p>
        )}
      </td>
    </tr>
  );
};

// ----------------------------------------------------------------------

const PrintLaundryFromOrders = React.forwardRef(({ data }, ref) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);

  const hasSpk = data?.listSpk?.length > 0;

  useEffect(() => {
    if (!data?.orderId) return;

    QRCode.toDataURL(data.orderId)
      .then(setImage)
      .catch(console.error);
  }, [data?.orderId]);

  return (
    <div ref={ref} className="no-break">
      <Divider />

      {/* ================= WITH SPK ================= */}
      {hasSpk ? (
        data.listSpk.map((item, i) => (
          <div key={i}>
            <HeaderTable data={data} user={user} spkId={item?.spkId} />

            <Divider />

            <table style={{ width: '100%' }}>
              <tbody>
                <ItemRow item={item} />
              </tbody>
            </table>

            <Divider />

            {image && <img alt="QR Code" src={image} width={100} />}

            <p className="powered">Powered by EvePOS</p>

            <Divider />
            <Divider />
          </div>
        ))
      ) : (
        <>
          <HeaderTable data={data} user={user} />

          <Divider />

          <table style={{ width: '100%' }}>
            <tbody>
              {data?.orders?.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </tbody>
          </table>

          <Divider />

          {image && <img alt="QR Code" src={image} width={100} />}

          <p className="powered">Powered by EvePOS</p>

          <Divider />
        </>
      )}

      {/* ================= LABEL ================= */}
      {data?.qtyLabel > 0
        ? Array.from({ length: data.qtyLabel }).map((_, i) => (
          <div key={i}>
            {!hasSpk && <Divider />}
            <HeaderTable data={data} user={user} />
            <Divider />
          </div>
        ))
        : !hasSpk && (
          <>
            <Divider />
            <br />
            <br />
          </>
        )}
    </div>
  );
});

// ----------------------------------------------------------------------

PrintLaundryFromOrders.propTypes = {
  data: PropTypes.object,
};

export default PrintLaundryFromOrders;