export default function getDirection(deg) {
    var dir = "";
    if ((deg > 348.75 && deg <= 360.0) || (deg >= 0 && deg < 11.25)) {
        dir = "N";
    } else if (deg > 11.25 && deg <= 33.75) {
        dir = "NNE";
    } else if (deg > 33.75 && deg <= 56.25) {
        dir = "NE";
    } else if (deg > 56.25 && deg <= 78.75) {
        dir = "ENE";
    } else if (deg > 78.75 && deg <= 101.25) {
        dir = "E";
    } else if (deg > 101.25 && deg <= 123.75) {
        dir = "ESE";
    } else if (deg > 123.75 && deg <= 146.25) {
        dir = "SE";
    } else if (deg > 146.25 && deg <= 168.75) {
        dir = "SSE";
    } else if (deg > 168.75 && deg <= 191.25) {
        dir = "S";
    } else if (deg > 191.25 && deg <= 213.75) {
        dir = "SSW";
    } else if (deg > 213.75 && deg <= 236.35) {
        dir = "SW";
    } else if (deg > 236.25 && deg <= 258.75) {
        dir = "WSW";
    } else if (deg > 258.75 && deg <= 281.25) {
        dir = "W";
    } else if (deg > 281.25 && deg <= 303.75) {
        dir = "WNW";
    } else if (deg > 303.75 && deg <= 326.25) {
        dir = "NW";
    } else if (deg > 326.25 && deg <= 348.75) {
        dir = "NNW";
    }

    return dir;
}
