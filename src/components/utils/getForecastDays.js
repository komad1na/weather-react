import { getDateTime } from "./getDateTime";

export function getForecastDays(data) {
    var eachDay = [];
    let tempArray = [data[0]];

    data.forEach((element, index) => {
        var date = getDateTime(element.dt);
        var day = date.split(".")[0];

        if (index != 0) {
            if (getDateTime(tempArray[0].dt).split(".")[0] === day) {
                tempArray.push(element);
            } else {
                eachDay.push(tempArray);
                tempArray = [element];
            }
        }
    });
    return eachDay;
}
