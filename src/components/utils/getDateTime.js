export function getTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});;
}
export function getDateTime(unix) {
    return new Date(unix * 1000).toLocaleDateString("de-DE");
}
