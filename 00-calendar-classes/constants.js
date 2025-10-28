// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
const VERSION = "1.0";

var _a, _b;
var CHURCHWIDE_CALENDAR_ID = 'c_2f60136210a2f5edd3666b27c2d4dae4d2c80f8d879a2d4140e9013a3e17a4f6@group.calendar.google.com';
var INTL_CALENDAR_ID = 'c_389070cca9e2ceff2f8de338ffbef3420ea53a93c185ec1701a5de5fb8385d06@group.calendar.google.com';
var COLLEGE_CALENDAR_ID = 'c_ec861eac95dc475be498a1ed88c8036614aebd20acd8277b538cf037817fe93a@group.calendar.google.com';
var CHILDCARE_CALENDAR_ID = 'c_8e7fe09dca16bc299b1a41ad9ad74e37ecd641be0da415f5089fbe3864244a61@group.calendar.google.com';
var YOUTH_CALENDAR_ID = 'c_4bb8da6d790ee3e432174728e34a9af48c2286f0e3a330155fe9c41b4fa04a10@group.calendar.google.com';
var JOYLAND_CALENDAR_ID = 'c_978aa946f2a781552f4567c954f8d128c2cda12cb54aff678920b6710ace27b8@group.calendar.google.com';
var WEEKLY_CALENDAR_ID = 'c_01fe3393b0ad531984cd140bd46bf339aa5d2d9fdfd047a5135c13c8ae10e34d@group.calendar.google.com';
var IS_ALL_DAY = function (stringToCheck) { return stringToCheck === "all day" || stringToCheck === "All day" || stringToCheck === "All Day" || stringToCheck === "ALL DAY"; };
//var ONESTOP_WEEK_TAB_REGEX = /\d{1,2}\/\d{1,2}[A-Za-z]{3}-([A-Za-z]{3})?\d{1,2}\/\d{1,2}[A-Za-z]{3}(?:\(WIP\))?/;
var ONESTOP_WEEK_TAB_REGEX = /^(\d{1,2}\/\d{1,2})-(\d{1,2}\/\d{1,2})\s*\(WK(\d+)\)$/;
var ONESTOP_COLUMN_VALUES = {
    MINISTRY: 1,
    START: 2,
    END: 3,
    WHAT: 4,
    LOCATION: 5,
    IN_CHARGE: 6,
    WHO_ELSE: 7,
    FOOD: 8,
    TECH: 9,
    CHILD: 10,
    NOTE: 11
};
var ALL_DAY = "All day";
var NOON = "noon";
var MIDNIGHT = "midnight";
var UPCOMING_CALENDAR_COLUMN_VALUES = {
    START_DATE: 0,
    START_TIME: 1,
    END_DATE: 2,
    END_TIME: 3,
    COLLEGE: 4,
    INTERNATIONAL: 5,
    YOUTH: 6,
    LOCATION: 7,
    IN_CHARGE: 8,
    ADDITIONAL_ASSIGNMENTS: 9
};
var STAFF_TRAVEL_CALENDAR_ID = 'c_709a95501c57d29926c497f0b0041ba0d81bcc960a441bb4fcd9d812072278b2@group.calendar.google.com';
var UPCOMING_CALENDAR_ID_COLLEGE = 'c_030f81e08344d1ea8b01e8ef1cc7ae3032bfb7ded3a6560ef8eb249351b0acc6@group.calendar.google.com';
var UPCOMING_CALENDAR_ID_INTERNATIONAL = 'c_7f99341a6b2084cf792ce4e0bca4480f35f28e3166572c164bd8a19d7d01eba3@group.calendar.google.com';
var UPCOMING_CALENDAR_ID_YOUTH = 'c_3043515e1abec4e6e3e70957256c78c477ebb178094a852999100ad1e0e7b25d@group.calendar.google.com';
var COLLEGE = 'college';
var INTERNATIONAL = 'international';
var YOUTH = 'youth';
var ALL_DAY_EVENT_TYPE = 'all_day';
var MULTI_DAY_EVENT_TYPE = 'multi_day';
var NORMAL_EVENT_TYPE = 'normal';
var CALENDAR_ID_BY_TYPE = (_a = {},
    _a[COLLEGE] = UPCOMING_CALENDAR_ID_COLLEGE,
    _a[INTERNATIONAL] = UPCOMING_CALENDAR_ID_INTERNATIONAL,
    _a[YOUTH] = UPCOMING_CALENDAR_ID_YOUTH,
    _a);
var UPCOMING_CALENDAR_COLUMN_BY_TYPE = (_b = {},
    _b[COLLEGE] = UPCOMING_CALENDAR_COLUMN_VALUES.COLLEGE,
    _b[INTERNATIONAL] = UPCOMING_CALENDAR_COLUMN_VALUES.INTERNATIONAL,
    _b[YOUTH] = UPCOMING_CALENDAR_COLUMN_VALUES.YOUTH,
    _b);
