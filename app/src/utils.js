export function formatSize(size) {
    let unit = 'B';
    if (size > 1024) {
        size /= 1024;
        unit = 'KB';
    }
    if (size > 1024) {
        size /= 1024;
        unit = 'MB';
    }
    if (size > 1024) {
        size /= 1024;
        unit = 'GB';
    }
    return `${size.toFixed(2)} ${unit}`;
};