import PropTypes from "prop-types";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

QRPdfDocument.propTypes = {
    imgData: PropTypes.string,
    standId: PropTypes.string,
};

export default function QRPdfDocument({ imgData, standId }) {
    // 5cm → 5 * 28.346 px = ± 141.73 (PostScript points)
    const sizeCM = 5;
    const cmToPt = sizeCM * 28.346;

    const styles = StyleSheet.create({
        page: {
            width: cmToPt,
            height: cmToPt,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
        },
        image: {
            width: "80%",
        },
        text: {
            fontSize: 12,
            textAlign: "center",
        },
    });

    return (
        <Document>
            <Page size={{ width: cmToPt, height: cmToPt }} style={styles.page}>
                <Image style={styles.image} src={imgData} />
                {/* <Text style={styles.text}>{standId}</Text> */}
            </Page>
        </Document>
    );
};
