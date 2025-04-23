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

export function formatDateSmart(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    const diffInMs = now.getTime() - date.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (diffInMs < oneDayInMs) {
        // HH:mm format (24 soatdan kam bo‘lsa)
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `yest`;
    }

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const currentYear = now.getFullYear();

    if (year === currentYear) {
        return `${day} ${month}`;
    } else {
        return `${day} ${month} ${year}`;
    }
}

export function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}
