import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
// hooks
import useAuth from "../../../../hooks/useAuth";
// context
import { mainContext } from "../../../../contexts/MainContext";
// utils
import { numberWithCommas, formatDate2 } from "../../../../utils/getData";
import newLineText from "../../../../utils/newLineText";
import "./PrintReceipt.scss";


// ----------------------------------------------------------------------

const Divider = () => {
    return <div style={{ borderBottom: "1.9px dashed #000000", margin: "10px auto" }} />
};

const PrintLaundryFromOrders = React.forwardRef(({ data }, ref) => {

    const { user } = useAuth();

    const ctm = useContext(mainContext);

    const [image, setImage] = useState(null);

    useEffect(() => {
        if (data?.orderId) {
            QRCode.toDataURL(data?.orderId)
                .then(url => {
                    setImage(url);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [data?.orderId]);

    return (
        <div ref={ref} className="no-break">
            <Divider />

            <table style={{ width: "100%", textAlign: "left" }}>
                <tbody>
                    <tr>
                        <td>Date</td>
                        <td>: {formatDate2(new Date())}</td>
                    </tr>
                    <tr>
                        <td>Order ID</td>
                        <td>: {data?.orderId || ""}</td>
                    </tr>
                    {data?.customer?.name && (
                        <tr>
                            <td>Customer</td>
                            <td>: {data?.customer?.name}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Created by</td>
                        <td>: {user?.fullname || "Cashier"}</td>
                    </tr>
                </tbody>
            </table>

            <Divider />

            <table style={{ width: "100%" }}>
                <tbody>
                    {data?.orders?.map((item, i) => (
                        <tr key={i}>
                            {/* Kolom Qty dan Unit */}
                            <td style={{
                                width: "25%",
                                verticalAlign: "top",
                                textAlign: "left"
                            }}>
                                <span>
                                    {item?.qty}{" "}
                                    <em style={{ fontSize: "11px" }}>
                                        {item?.category?.toLowerCase() === "kiloan" ? "kg" : item?.unit}
                                    </em>
                                </span>
                            </td>

                            {/* Kolom Nama + detail */}
                            <td style={{ textAlign: "left" }}>
                                <p>{item.name}</p>

                                {/* Variants */}
                                {item?.variant?.length > 0 && item.variant.map((field, v) => (
                                    <p key={v}>
                                        <em>{`${field?.name} : ${field?.option} ${field?.qty > 1 ? `(x${field?.qty})` : ""}`}</em>
                                    </p>
                                ))}

                                {/* Laundry Bag */}
                                {item?.isLaundryBag && (
                                    <p>
                                        <em>Laundry Bag Day</em>
                                    </p>
                                )}

                                {/* Notes */}
                                {item?.notes && (
                                    <p>
                                        <em>Notes: {item?.notes}</em>
                                    </p>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Divider />

            {image && (
                <img alt="QR Code" src={image} style={{ width: "100px" }} />
            )}
            <p className="powered">Powered by EvePOS</p>
            <br />
            <Divider />

            {data?.qtyLabel > 0 ?
                Array.from({ length: data.qtyLabel }).map((_, i) => (
                    <div key={i}>
                        <Divider />

                        <table style={{ width: "100%", textAlign: "left" }}>
                            <tbody>
                                <tr>
                                    <td>Date</td>
                                    <td>: {formatDate2(new Date())}</td>
                                </tr>
                                <tr>
                                    <td>Order ID</td>
                                    <td>: {data?.orderId || ""}</td>
                                </tr>
                                {data?.customer?.name && (
                                    <tr>
                                        <td>Customer</td>
                                        <td>: {data?.customer?.name}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td>Created by</td>
                                    <td>: {user?.fullname || "Cashier"}</td>
                                </tr>
                            </tbody>
                        </table>

                        <Divider />
                    </div>
                ))
                : (
                    <>
                        <Divider />
                        <br />
                        <br />
                    </>
                )}
        </div>
    );
});

export default PrintLaundryFromOrders;

PrintLaundryFromOrders.propTypes = {
    data: PropTypes.object,
};
