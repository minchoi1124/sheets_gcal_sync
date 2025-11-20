// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
const VERSION = "1.3";

var WEEKLY_CALENDAR_ID = 'c_f371064660a365369b3b63bcd16974a43a78dad35e1d657cfa6c19ca0a400fc0@group.calendar.google.com';

var IS_ALL_DAY = function (stringToCheck) { 
    return stringToCheck === "all day" || 
           stringToCheck === "All day" || 
           stringToCheck === "All Day" || 
           stringToCheck === "ALL DAY" ||
           stringToCheck === null ||
           stringToCheck === undefined ||
           stringToCheck === '';
};

// Updated regex to match your sheet naming: 7/26Sat-7/27Sun, 8/4Mon-8/10Sun, Mon10/6-Sun10/12, etc.
var ONESTOP_WEEK_TAB_REGEX = /^((\d{1,2}\/\d{1,2}|[A-Za-z]{3}\d{1,4})[A-Za-z]{3}-(\d{1,2}\/\d{1,2}|[A-Za-z]{3}\d{1,4})[A-Za-z]{3})(\s*\(WIP\))?$/;


// Column values for sheets WITH "MIN GROUP" column (Format 1)
var ONESTOP_COLUMN_VALUES_FORMAT1 = {
    MIN_GROUP: 1,
    START: 2,
    END: 3,
    WHAT: 4,
    LOCATION: 5,
    IN_CHARGE: 6,
    WHO_ELSE: 7,
    FOOD: 8,
    CHILDCARE: 9,
    NOTE: 10
};

// Column values for sheets WITHOUT "MIN GROUP" column (Format 2)
var ONESTOP_COLUMN_VALUES_FORMAT2 = {
    START: 1,
    END: 2,
    WHAT: 3,
    LOCATION: 4,
    IN_CHARGE: 5,
    WHO_ELSE: 6,
    FOOD: 7,
    NOTE: 8,
    CHILDCARE: 9
};

var ALL_DAY = "All day";
var NOON = "noon";
var MIDNIGHT = "midnight";