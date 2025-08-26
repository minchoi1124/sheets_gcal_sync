// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var _a, _b;
var CHURCHWIDE_CALENDAR_ID = "c_2f60136210a2f5edd3666b27c2d4dae4d2c80f8d879a2d4140e9013a3e17a4f6@group.calendar.google.com";
var INTL_CALENDAR_ID = "c_ea57584db7ac69c249d244e83aef61f645a371b9657044b8cf8e256be281d18c@group.calendar.google.com";
var COLLEGE_CALENDAR_ID = "c_e3acab659301a264d9e0f2dbc8b594b3bca6a7a9b463a168492c0a8dd9139b42@group.calendar.google.com";
var CHILDCARE_CALENDAR_ID = "c_3854bf091e4ce2cbf91f85fef9eb5b76cbaaa20474bcb7fa3a9177856a15e372@group.calendar.google.com";
var YOUTH_CALENDAR_ID = "c_47254d47557076ba702ef01ea8010e3cd66c50d0231d08046c30f1478394f357@group.calendar.google.com";
var JOYLAND_CALENDAR_ID = "c_b1a7751fdf1d6ca4c8759fa5e75d295cc071bc230207454413e56b8c93dc29fd@group.calendar.google.com";
var IS_ALL_DAY = function (stringToCheck) { return stringToCheck === "all day" || stringToCheck === "All day" || stringToCheck === "All Day" || stringToCheck === "ALL DAY"; };
var ONESTOP_WEEK_TAB_REGEX = /\d{1,2}\/\d{1,2}[A-Za-z]{3}-([A-Za-z]{3})?\d{1,2}\/\d{1,2}[A-Za-z]{3}(?:\(WIP\))?/;
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
