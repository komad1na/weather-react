export function getDateTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString("de-DE");
}
