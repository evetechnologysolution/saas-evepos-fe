export default function splitName(fullName = "") {
    const parts = fullName.trim().split(" ");
    return {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
    };
}