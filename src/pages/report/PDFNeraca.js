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
    const liabilitas = data?.tax || 0;
    const capitalAmount = (data?.prevSales || 0) - (data?.sales || 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <Text>LAPORAN NERACA</Text>
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
                            <Text>Aset</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>(1-10001) Kas</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.cashIn || 0))}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <Text>Total Aset</Text>
                        <Text>Rp. {numberWithCommas(fDecimal(data?.cashIn || 0))}</Text>
                    </View>
                </View>
                <View style={styles.divider}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text>Liabilitas dan Modal</Text>
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <View style={styles.section}>
                            <View style={styles.content}>
                                <Text>(2-20500) PPN Keluaran</Text>
                                <Text>Rp. {numberWithCommas(fDecimal(data?.tax || 0))}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <View style={styles.section}>
                            <View style={styles.content}>
                                <Text>Total Liabilitas</Text>
                                <Text>Rp. {numberWithCommas(fDecimal(liabilitas))}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Modal Pemilik</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Pendapatan Periode Lalu</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(data?.prevSales || 0))}</Text>
                        </View>
                    </View>
                    <View style={styles.divider}>
                        <View style={styles.section}>
                            <View style={styles.content}>
                                <Text>Pendapatan Periode Ini</Text>
                                <Text>(Rp. {numberWithCommas(fDecimal(data?.sales || 0))})</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.content}>
                            <Text>Total Modal Pemilik</Text>
                            <Text>Rp. {numberWithCommas(fDecimal(capitalAmount))}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text>Total Liabilitas dan Modal</Text>
                    <Text>Rp. {numberWithCommas(fDecimal(liabilitas + capitalAmount))}</Text>
                </View>
            </Page>
        </Document>
    )
};