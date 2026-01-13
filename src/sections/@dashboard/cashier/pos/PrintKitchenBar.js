import React from "react";
import PropTypes from 'prop-types';
// utils
import { formatDate2 } from "../../../../utils/getData";

import "./PrintReceipt.scss";


// ----------------------------------------------------------------------

const PrintKitchenBar = React.forwardRef(({ bill, tableName, orderDate }, ref) => {

    const date = orderDate || new Date();

    const kitchenData = [];
    const barData = [];

    return (
        <div ref={ref} key="PrintKitchenBar">
            {bill.forEach((item, i) => {
                if (item.promotionType !== 2) {
                    if (item.section.toLowerCase() === 'kitchen') {
                        for (let n = 0; n < item.qty; n += 1) {
                            kitchenData.push(
                                <div key={`${i}-${n}`}>
                                    <p style={{ textAlign: "left" }}>{item.name}</p>
                                    {item.variant && (
                                        item.variant.map((variant, index) =>
                                            <p key={`kitchen-variant-${index}`} style={{ textAlign: "left" }}>{`${variant.name} : ${variant.option}`}</p>
                                        )
                                    )}
                                    <br />
                                </div>
                            );
                        }
                    }
                    if (item.section.toLowerCase() === 'bar') {
                        for (let n = 0; n < item.qty; n += 1) {
                            barData.push(
                                <div key={`${i}-${n}`}>
                                    <p style={{ textAlign: "left" }}>{item.name}</p>
                                    {item.variant && (
                                        item.variant.map((variant, index) =>
                                            <p key={`bar-variant-${index}`} style={{ textAlign: "left" }}>{`${variant.name} : ${variant.option}`}</p>
                                        )
                                    )}
                                    <br />
                                </div>
                            );
                        }
                    }
                } else {
                    item.products.filter((data) => data.section.toLowerCase() === 'kitchen').forEach((row) => {
                        for (let n = 0; n < item.qty; n += 1) {
                            kitchenData.push(
                                <div key={`${i}-${n}`}>
                                    <p style={{ textAlign: "left" }}>{row.name}</p>
                                    {row.selectedVariant && (
                                        row.selectedVariant.map((variant, index) =>
                                            <p key={`kitchen-variant-${index}`} style={{ textAlign: "left" }}>{`${variant.name} : ${variant.option}`}</p>
                                        )
                                    )}
                                    <br />
                                </div>
                            );
                        }
                    })

                    item.products.filter((data) => data.section.toLowerCase() === 'bar').forEach((row) => {
                        for (let n = 0; n < item.qty; n += 1) {
                            barData.push(
                                <div key={`${i}-${n}`}>
                                    <p style={{ textAlign: "left" }}>{row.name}</p>
                                    {row.selectedVariant && (
                                        row.selectedVariant.map((variant, index) =>
                                            <p key={`bar-variant-${index}`} style={{ textAlign: "left" }}>{`${variant.name} : ${variant.option}`}</p>
                                        )
                                    )}
                                    <br />
                                </div>
                            );
                        }
                    })
                }
            })}

            {kitchenData.length > 0 && (
                <div className="kitchen">
                    <h4>KITCHEN</h4>
                    <h4>Table : {tableName || "-"}</h4>
                    <h4>{formatDate2(date)}</h4>
                    <br />
                    {kitchenData}
                </div>
            )}

            {barData.length > 0 && (
                <>
                    {kitchenData.length > 0 && (
                        <>
                            <div className="page-break" />
                            <br />
                        </>
                    )}

                    <div className="bar">
                        <h4>BAR</h4>
                        <h4>Table : {tableName || "-"}</h4>
                        <h4>{formatDate2(date)}</h4>
                        <br />
                        {barData}
                    </div>
                </>
            )}

        </div >
    );
});

export default PrintKitchenBar;

PrintKitchenBar.propTypes = {
    bill: PropTypes.array,
    tableName: PropTypes.string,
    orderDate: PropTypes.string,
};
