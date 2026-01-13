export const masked = (visible = false, dynamic = true, val = 0, unit = "") => {
    if (visible) {
        if (unit === "currency") {
            const format = new Intl.NumberFormat("id-ID");
            return `Rp. ${format.format(Number(val))}`;
        }
        return `${val} ${unit}`;
    }

    if (!dynamic) {
        return "***";
    }

    const maskedValue = "*".repeat(val.toString().length);

    return maskedValue;
}

export const maskedPhone = (visible = false, val = 0, show = 3) => {
    if (visible) {
        return val;
    }

    const valStr = val.toString();
    const showDigits = show ? valStr.slice(-show) : "";
    // const maskedValue = "*".repeat(valStr.length - show) + showDigits;
    const maskedValue = "*".repeat(10) + showDigits;

    return maskedValue;
}