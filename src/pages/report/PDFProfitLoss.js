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
    const tSales = (data?.sales || 0) - (data?.discount || 0) - (data?.refund || 0);
    const tGross = tSales - (data?.productionCost || 0);
    const tOtherCost = (data?.tax || 0) + (data?.expenses?.code1 || 0) + (data?.expenses?.code2 || 0)
        + (data?.expenses?.code3 || 0) + (data?.expenses?.code4 || 0) + (data?.expenses?.code5 || 0)
        + (data?.expenses?.code6 || 0) + (data?.expenses?.code7 || 0) + (data?.expenses?.code8 || 0);
    const tOperational = tGross - tOtherCost;
    const tOtherIncome = (data?.serviceCharge || 0) + (data?.deliveryPrice || 0);
    const tNet = tOperational + tOtherIncome;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <Text>LAPORAN LABA-RUGI</Text>
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
                        <View style={styles.title}>
                            <Text>Pendapatan</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Penjualan</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.sales || 0))}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text>Diskon Penjualan</Text>
                            <Text>(Rp. {numberWithCommas(fDecimal(data?.discount || 0))})</Text>
                        </View>
                        <View style={styles.content}>
                            <Text>Pengembalian Dana (Refund)</Text>
                            <Text>(Rp. {numberWithCommas(fDecimal(data?.refund || 0))})</Text>
                        </View>
                        <View style={styles.content}>
                            <Text>Total Pendapatan</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(tSales))}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text>Biaya Produksi</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Total Biaya Produksi</Text>
                            <Text>(Rp. {numberWithCommas(fDecimal(data?.productionCost || 0))})</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>A. Laba (Rugi) Kotor</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tGross))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text>Beban</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Beban Pajak</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.tax || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Beban Gaji</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code1 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Beban Sewa Gedung</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code2 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Beban Listrik dan Telepon</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code3 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Beban Lain-lain</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code4 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Pembelian</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code5 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Potongan Pembelian</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code6 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Retur Pembelian dan Pengurangan Harga</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code7 || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Pengeluaran Outlet</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.expenses?.code8 || 0))}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>B. Total Beban</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tOtherCost))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>C. Laba (Rugi) Operasional (A-B)</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tOperational))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text>Pendapatan Lain-lain</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Biaya Jasa</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.serviceCharge || 0))}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text>Biaya Pengiriman</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.deliveryPrice || 0))}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>D. Total Pendapatan Lain-lain</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(tOtherIncome))}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text>E. Laba (Rugi) Bersih (C+D)</Text>
                    <Text>Rp. {numberWithCommas(fDecimal(tNet))}</Text>
                </View>
            </Page>
        </Document>
    )
};