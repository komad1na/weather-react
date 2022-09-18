export function getTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString("de-DE");
}
export function getDateTime(unix) {
    return new Date(unix * 1000).toLocaleDateString("de-DE");
}
