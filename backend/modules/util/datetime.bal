import ballerina/time;

# converts 2015-02-23 time string to time:Date
#
# + sValue - String Date.
# + return - Date record.
public isolated function dateFromBasicString(string sValue) returns time:Date|error {
    string[] splittedValues = re `-`.split(sValue.trim());
    int year = check int:'fromString(splittedValues[0]);
    int month = check int:'fromString(splittedValues[1]);
    int day = check int:'fromString(splittedValues[2]);
    return {year, month, day};
}

# converts time:Date value to 2015-04-24 format.
#
# + dateValue - Date value.
# + return - string value.
public isolated function dateToBasicString(time:Date dateValue) returns string {
    string year = dateValue.year.toString();
    string month = dateValue.month < 10 ?
        string `0${dateValue.month}` : dateValue.month.toString();
    string date = dateValue.day < 10 ?
        string `0${dateValue.day}` : dateValue.day.toString();
    return string `${year}-${month}-${date}`;
}

# Converts 20220712T054235Z time string to time:Civil
#
# + sValue - ISO 8601 string time value.
# + return - Converted time:Civil record.
public isolated function civilFromIso8601(string sValue) returns time:Civil|error {
    string[] splittedValues = re `T`.split(sValue);
    time:ZoneOffset utcOffset;
    int year = check int:fromString(splittedValues[0].substring(0, 4));
    int month = check int:fromString(splittedValues[0].substring(4, 6));
    int day = check int:fromString(splittedValues[0].substring(6, 8));
    int hour = check int:fromString(splittedValues[1].substring(0, 2));
    int minute = check int:fromString(splittedValues[1].substring(2, 4));
    time:Seconds second = check decimal:fromString(splittedValues[1].substring(4, 6));
    string zoneString = splittedValues[1].substring(6, splittedValues[1].length());
    if (zoneString == "Z") {
        utcOffset = {
            hours: 0,
            minutes: 0
        };
    } else {
        int sign = zoneString.substring(0, 1) == "-" ? -1 : 1;
        utcOffset = {
            hours: sign * check int:fromString(zoneString.substring(1, 3)),
            minutes: sign * check int:fromString(zoneString.substring(3, 5))
        };
    }
    return {year, month, day, hour, minute, second, utcOffset};
}

# Converts time:Civil time to string 20220712T054235Z
#
# + time - time:Civil time record.
# + return - Converted ISO 8601 string.
public isolated function civilToIso8601(time:Civil time) returns string {
    string year = time.year.toString();
    string month = time.month < 10 ? string `0${time.month}` : time.month.toString();
    string day = time.day < 10 ? string `0${time.day}` : time.day.toString();
    string hour = time.hour < 10 ? string `0${time.hour}` : time.hour.toString();
    string minute = time.minute < 10 ?
        string `0${time.minute}` : time.minute.toString();
    decimal? seconds = time.second;
    string second = seconds is () ?
        "00" : (seconds < 10.0d ? string `0${seconds}` : seconds.toString());
    time:ZoneOffset? zoneOffset = time.utcOffset;
    string timeZone = "Z";
    if zoneOffset is time:ZoneOffset {
        if zoneOffset.hours == 0 && zoneOffset.minutes == 0 {
            timeZone = "Z";
        } else {
            string hours = zoneOffset.hours.abs() < 10 ?
                string `0${zoneOffset.hours.abs()}` :
                zoneOffset.hours.abs().toString();
            string minutes = zoneOffset.minutes.abs() < 10 ?
                string `0${zoneOffset.minutes.abs()}` :
                zoneOffset.minutes.abs().toString();
            timeZone = zoneOffset.hours < 0 ?
                string `-${hours}${minutes}` : string `+${hours}${minutes}`;
        }
    }
    return string `${year}${month}${day}T${hour}${minute}${second}${timeZone}`;
}
