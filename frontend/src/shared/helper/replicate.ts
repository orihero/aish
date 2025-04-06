export const toKebabCase = (str: string) =>
    str
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camelCase -> kebab-case
        .replace(/([a-zA-Z])([0-9]+)/g, "$1-$2") // so'zdan keyingi raqam -> `-raqam`
        .toLowerCase();
