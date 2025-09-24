/**
 * Formats salary numbers with space separators (1 000 000 format)
 * @param value - The numeric value to format
 * @param currency - The currency code (optional)
 * @returns Formatted salary string
 */
export const formatSalary = (value: number | string, currency?: string): string => {
    if (!value || value === 0) return '0';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0';
    
    // Format number with space separators (1 000 000 format)
    const formatted = numValue.toLocaleString('ru-RU').replace(/,/g, ' ');
    
    return currency ? `${formatted} ${currency}` : formatted;
};

/**
 * Formats salary range with space separators
 * @param min - Minimum salary value
 * @param max - Maximum salary value  
 * @param currency - The currency code
 * @returns Formatted salary range string
 */
export const formatSalaryRange = (min: number | string, max: number | string, currency: string): string => {
    const formattedMin = formatSalary(min);
    const formattedMax = formatSalary(max);
    
    if (formattedMin === '0' && formattedMax === '0') {
        return `0 ${currency}`;
    }
    
    if (formattedMin === formattedMax) {
        return `${formattedMin} ${currency}`;
    }
    
    return `${formattedMin}-${formattedMax} ${currency}`;
};

/**
 * Parses formatted salary string back to number
 * @param formattedValue - The formatted salary string (e.g., "1 000 000")
 * @returns Numeric value
 */
export const parseSalary = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    
    // Remove spaces and parse as number
    const cleaned = formattedValue.replace(/\s/g, '');
    const parsed = parseFloat(cleaned);
    
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Custom formatter for NumericFormat component
 * @param value - The input value
 * @returns Formatted value with spaces
 */
export const formatWithSpaces = (value: string): string => {
    if (!value) return '';
    
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Add spaces every 3 digits from right
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Custom parser for NumericFormat component
 * @param value - The formatted value with spaces
 * @returns Clean numeric string
 */
export const parseWithSpaces = (value: string): string => {
    if (!value) return '';
    
    // Remove all spaces
    return value.replace(/\s/g, '');
};
