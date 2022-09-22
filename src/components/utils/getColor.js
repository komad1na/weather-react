// Functions to return AQI color and Text for no2, pm10, o3, pm2.5 data that is returned from API
// More about scale can be found at https://en.wikipedia.org/wiki/Air_quality_index#CAQI
export function no2(number) {
    if (number === 0) {
        return { color: "", text: "---" };
    } else if (number > 0 && number < 50) {
        return { color: "#79bc6a", text: "Very low" };
    } else if (number >= 50 && number < 100) {
        return { color: "#bbcf4c", text: "Low" };
    } else if (number >= 100 && number < 200) {
        return { color: "#eec20b", text: "Medium" };
    } else if (number >= 200 && number < 400) {
        return { color: "#f29305", text: "High" };
    } else if (number >= 400) {
        return { color: "#e8416f", text: "Very high" };
    }
}

export function pm10(number) {
    if (number === 0) {
        return { color: "", text: "---" };
    } else if (number >= 0 && number < 25) {
        return { color: "#79bc6a", text: "Very low" };
    } else if (number >= 25 && number < 50) {
        return { color: "#bbcf4c", text: "Low" };
    } else if (number >= 50 && number < 90) {
        return { color: "#eec20b", text: "Medium" };
    } else if (number >= 90 && number < 180) {
        return { color: "#f29305", text: "High" };
    } else if (number >= 180) {
        return { color: "#e8416f", text: "Very high" };
    }
}

export function o3(number) {
    if (number === 0) {
        return { color: "", text: "---" };
    } else if (number >= 0 && number < 60) {
        return { color: "#79bc6a", text: "Very low" };
    } else if (number >= 60 && number < 120) {
        return { color: "#bbcf4c", text: "Low" };
    } else if (number >= 120 && number < 180) {
        return { color: "#eec20b", text: "Medium" };
    } else if (number >= 180 && number < 240) {
        return { color: "#f29305", text: "High" };
    } else if (number >= 240) {
        return { color: "#e8416f", text: "Very high" };
    }
}

export function pm25(number) {
    if (number === 0) {
        return { color: "", text: "---" };
    } else if (number >= 0 && number < 15) {
        return { color: "#79bc6a", text: "Very low" };
    } else if (number >= 15 && number < 30) {
        return { color: "#bbcf4c", text: "Low" };
    } else if (number >= 30 && number < 55) {
        return { color: "#eec20b", text: "Medium" };
    } else if (number >= 55 && number < 110) {
        return { color: "#f29305", text: "High" };
    } else if (number >= 110) {
        return { color: "#e8416f", text: "Very high" };
    }
}
