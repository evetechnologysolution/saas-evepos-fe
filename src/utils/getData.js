import { useEffect, useState } from "react";
import { setHours, setMinutes, setSeconds } from "date-fns";
import moment from "moment";
import "moment/locale/id";

moment.locale("ID");

export const numberWithCommas = (x) => (
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
);

export const cardNumberFormat = (x) => (
    x.toString().replace(/[^\dA-Z]/g, "").replace(/(.{4})/g, "$1 ").trim()
);

export const resetCardNumberFormat = (x) => (
    x.toString().replace(/[^\dA-Z]/g, "").replace(/(.{4})/g, "$1").trim()
);

export const cardNumberFormat2 = (val) => String(val).replace(/(?<!\..*)(\d)(?=(?:\d{4})+(?:\.|$))/g, "$1 ");

export const removeSpaces = (val) => val.toString().replace(/\s/g, "");

export const sortByName = (x) => (
    x.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    })
);

export const sortByUsername = (x) => (
    x.sort((a, b) => {
        if (a.username < b.username) {
            return -1;
        }
        if (a.username > b.username) {
            return 1;
        }
        return 0;
    })
);

export const sortByFullname = (x) => (
    x.sort((a, b) => {
        if (a.fullname < b.fullname) {
            return -1;
        }
        if (a.fullname > b.fullname) {
            return 1;
        }
        return 0;
    })
);

export const sortByDate = (x) => (
    x.sort((a, b) => (
        new Date(b.date) - new Date(a.date)
    ))
);

export const cancelSortByDate = (x) => (
    x.sort((a, b) => (
        new Date(a.date) - new Date(b.date)
    ))
);

export const sortByProductionDate = (x) => (
    x.sort((a, b) => (
        new Date(a.productionDate) - new Date(b.productionDate)
    ))
);

export const formatQDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Hasil: yyyy-mm-dd
};

export const formatTime = (x) => {
    const newTimes = new Date(x);
    return moment(newTimes).fromNow();
};

export const formatDay = (dateStr, locale = 'id-ID') => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(locale, options);
};

export const formatDate = (x) => (
    new Date(x).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    })
);

export const formatOnlyDate = (x) => (
    new Date(x).toLocaleDateString("id-ID", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    })
);

export const formatOnlyTime = (x) => (
    new Date(x).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    })
);

export const formatFullTime = (x) => (
    new Date(x).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
);

export const formatDate2 = (x) => (
    new Date(x).toLocaleDateString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "short",
        // year: "2-digit",
        // month: "2-digit",
        day: "2-digit",
    })
);

export const combinedDateTime = (d) => {
    const currentTime = new Date();
    const selectedDate = new Date(d);
    const combinedDate = setSeconds(
        setMinutes(
            setHours(selectedDate, currentTime.getHours()),
            currentTime.getMinutes()
        ),
        currentTime.getSeconds()
    );
    return combinedDate;
};

export const dailyChart = (x) => (
    x.filter((branch) => (
        new Date(branch.date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
        }) ===
        new Date(Date.now()).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
        })
    ))
);

export const todayChartFormat = (x) => (
    x.filter((branch) => (
        new Date(branch.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        }) ===
        new Date(Date.now()).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
        })
    ))
);

export const dailyChartFormat = (transaction) => {
    const sumedUpDates = [];
    const prices = [];

    function isDateSumedUp(date) {
        return sumedUpDates.indexOf(date.substring(0, 7)) !== -1;
    }

    function sumUpDate(date) {
        let sum = 0;
        let month = "";
        let year = "";
        let day = "";

        transaction.forEach((t) => {
            if (t.date.substring(0, 10) === date.substring(0, 10)) {
                sum += parseInt(t.totalPrice, 10);
            }
        });

        year = date.substring(0, 4);
        month = date.substring(5, 7) - 1;
        day = date.substring(8, 10);

        sumedUpDates.push(
            new Date(year, month, day).toLocaleDateString("id-ID", {
                year: "2-digit",
                month: "short",
                day: "2-digit",
            })
        );
        prices.push(sum);
    }

    transaction.forEach((t) => {
        if (!isDateSumedUp(t.date)) {
            sumUpDate(t.date);
        }
    });

    const obj = {};

    sumedUpDates.forEach((d, i) => { (obj[d] = prices[i]) });
    return obj;
};

export const monthlyChart = (transaction) => {
    const sumedUpDates = [];
    const prices = [];

    function isDateSumedUp(date) {
        return sumedUpDates.indexOf(date.substring(0, 7)) !== -1;
    }

    function sumUpDate(date) {
        let sum = 0;
        let month = "";
        let year = "";

        transaction.forEach((t) => {
            if (t.date.substring(0, 7) === date.substring(0, 7)) {
                sum += parseInt(t.totalPrice, 10);
            }
        });

        year = date.substring(0, 4);
        month = date.substring(5, 7) - 1;

        sumedUpDates.push(
            new Date(year, month).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
            })
        );
        prices.push(sum);
    }

    transaction.forEach((t) => {
        if (!isDateSumedUp(t.date)) {
            sumUpDate(t.date);
        }
    });

    const obj = {};

    sumedUpDates.forEach((d, i) => { (obj[d] = prices[i]) });
    return obj;
};

export const transactionMonthly = (obj) => {
    const newObj = [];
    Object.entries(obj).forEach(([key, value]) => (
        newObj.push({
            name: key,
            "Total Price": value,
        })
    ));
    return newObj;
};

export const transactionDaily = (obj) => {
    const newObj = [];
    Object.entries(obj).forEach(([key, value]) => (
        newObj.push({
            name: key,
            "Total Price": value,
        })
    ));
    return newObj;
};

function getStorageValue(key, defaultValue) {
    // getting stored value
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved);
    return initial || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => (
        getStorageValue(key, defaultValue)
    ));

    useEffect(() => {
        // storing input name
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export const randomCustomer = () => {
    return `CUS${formatFullTime(new Date()).replace(/\./g, "")}`;
}
