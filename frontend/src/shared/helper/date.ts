export function getDateDifference(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
        const monthStr =
            months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

        return [yearStr, monthStr].filter(Boolean).join(" ");
    } else {
        return "";
    }
}

// Misol:
console.log(getDateDifference("2018-09-01", "2022-06-30")); // 3 years 9 months
