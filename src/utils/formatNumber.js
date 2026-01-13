import numeral from "numeral";

// ----------------------------------------------------------------------

// load a locale
numeral.register("locale", "id", {
    delimiters: {
        thousands: ",",
        decimal: "."
    },
    abbreviations: {
        thousand: "rb",
        million: "jt",
        billion: "m",
        trillion: "t"
    },
    currency: {
        symbol: "Rp. "
    }
});

// switch between locales
numeral.locale("id");

export function fCurrency(number) {
    return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export function fPercent(number) {
    return numeral(number / 100).format("0.0%");
}

export function fNumber(number) {
    // return numeral(number).format();
    return numeral(number).format('0,0.[00]');
}

export function fShortenNumber(number) {
    return numeral(number).format("0.00a").replace(".00", "");
}

export function fData(number) {
    return numeral(number).format("0.0 b");
}

export function fDecimal(number, decimal = 2) {
    return Number(number).toFixed(decimal);
}