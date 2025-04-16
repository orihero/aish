export const toKebabCase = (str: string) =>
    str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])([0-9]+)/g, "$1-$2")
        .toLowerCase();

export const toKebabCase2 = (str: string) =>
    str
        .replace(/\s+/g, "-") // Bo'sh joylarni - bilan almashtirish
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // Kichik va katta harflar orasida - qo'shish
        .replace(/([a-zA-Z])([0-9]+)/g, "$1-$2") // Harf va raqam orasida - qo'shish
        .toLowerCase(); // Hammasini kichik harflarga aylantirish
