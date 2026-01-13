import React, { useContext } from "react";
import PropTypes from "prop-types";
// context
import { mainContext } from "../../../../contexts/MainContext";
import { headerPrint } from "../../../../_mock/headerPrint";
import "../pos/PrintReceipt.scss";


// ----------------------------------------------------------------------

const QrdataPrint = React.forwardRef(({ content }, ref) => {

    const ctm = useContext(mainContext);

    const { qrKey, tableName, pax, image } = content;

    return (
        <div ref={ref} className="no-break">
            <p style={{ textTransform: "uppercase" }}>{ctm.receiptHeader?.name || headerPrint.name}</p>
            {/* <p>
                {ctm.receiptHeader.address ? `${ctm.receiptHeader.address},` : `${headerPrint.address},`}
                <br />
                {ctm.receiptHeader.region ? `${ctm.receiptHeader.region}, ` : `${headerPrint.region}, `}
                {ctm.receiptHeader.city ? `${ctm.receiptHeader.city}, ` : `${headerPrint.city}, `}
                {ctm.receiptHeader.province ? `${ctm.receiptHeader.province} ` : `${headerPrint.province} `}
                {ctm.receiptHeader?.zipCode || headerPrint.zipCode}
                <br />
                {ctm.receiptHeader?.phone || headerPrint.phone}
            </p> */}

            <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "auto" }}>
                <p>
                    Table : {tableName}
                </p>
                <p>
                    Pax : {pax}
                </p>
            </div>

            <img alt={qrKey} src={image} style={{ width: "150px", height: "150px" }} />

            {/* <p>{qrKey}</p> */}

            <p>
                SCAN ME TO ORDER
            </p>
            <br />

            <p>
                This QR is linked to your table orders,<br />please do not share this QR to external parties.
            </p>

            <div style={{ borderBottom: "1.7px dashed #000000", margin: "10px auto" }} />

            <p className="powered">Powered by EvePOS</p>
        </div>
    );
});

export default QrdataPrint;

QrdataPrint.propTypes = {
    content: PropTypes.object,
};
