export function no2(number) {
    if (number === 0) {
        return ["", "---"];
    } else if (number > 0 && number < 50) {
        return ["#79bc6a", "Very low"];
    } else if (number >= 50 && number < 100) {
        return ["#bbcf4c", "Low"];
    } else if (number >= 100 && number < 200) {
        return ["#eec20b", "Medium"];
    } else if (number >= 200 && number < 400) {
        return ["#f29305", "High"];
    } else if (number >= 400) {
        return ["#e8416f", "Very high"];
    }
}

export function pm10(number) {
    if (number === 0) {
        return ["", "---"];
    } else if (number >= 0 && number < 25) {
        return ["#79bc6a", "Very low"];
    } else if (number >= 25 && number < 50) {
        return ["#bbcf4c", "Low"];
    } else if (number >= 50 && number < 90) {
        return ["#eec20b", "Medium"];
    } else if (number >= 90 && number < 180) {
        return ["#f29305", "High"];
    } else if (number >= 180) {
        return ["#e8416f", "Very high"];
    }
}

export function o3(number) {
    if (number === 0) {
        return ["", "---"];
    } else if (number >= 0 && number < 60) {
        return ["#79bc6a", "Very low"];
    } else if (number >= 60 && number < 120) {
        return ["#bbcf4c", "Low"];
    } else if (number >= 120 && number < 180) {
        return ["#eec20b", "Medium"];
    } else if (number >= 180 && number < 240) {
        return ["#f29305", "High"];
    } else if (number >= 240) {
        return ["#e8416f", "Very high"];
    }
}

export function pm25(number) {
    if (number === 0) {
        return ["", "---"];
    } else if (number >= 0 && number < 15) {
        return ["#79bc6a", "Very low"];
    } else if (number >= 15 && number < 30) {
        return ["#bbcf4c", "Low"];
    } else if (number >= 30 && number < 55) {
        return ["#eec20b", "Medium"];
    } else if (number >= 55 && number < 110) {
        return ["#f29305", "High"];
    } else if (number >= 110) {
        return ["#e8416f", "Very high"];
    }
}
