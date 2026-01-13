import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
// utils
import { numberWithCommas } from "../../utils/getData";
import { fDecimal } from "../../utils/formatNumber";

MyPDF.propTypes = {
    period: PropTypes.string,
    data: PropTypes.object
};

// Create styles
const styles = StyleSheet.create({
    page: {
        fontSize: '12px',
        padding: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#80979F',
        color: '#FFFFFF',
        borderRadius: 8,
        padding: '10px',
        margin: '5px 0',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: "5px 10px",
    },
    section: {
        marginLeft: 20
    },
    divider: {
        borderBottom: '1px solid #80979F'
    }
});

export default function MyPDF({ period, data }) {
    const tCashIn = data?.cashIn || 0;
    const tCashOut = (data?.cashOt || 0) + (data?.refund || 0) + (data?.totalExpense || 0);
    const tSales = data?.sales || 0;
    const tCashFlow = tSales - tCashOut;
    const tAmount = tCashIn + tCashFlow;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <Text>LAPORAN ARUS KAS</Text>
                    <View style={{ margin: '10px 0px' }}>
                        <Text>Periode: {period}</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <Text>Keterangan</Text>
                    <Text>Jumlah</Text>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>A. Jumlah Awal</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tCashIn))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>B. Total Pendapatan</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tSales))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>C. Total Pengeluaran</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tCashOut))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>D. Arus Kas (B-C)</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tCashFlow))}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text>E. Jumlah Akhir (A+D)</Text>
                    <Text>Rp. {numberWithCommas(fDecimal(tAmount))}</Text>
                </View>
            </Page>
        </Document>
    )
};