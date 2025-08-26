// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var START_DATE_COLUMN_INDEX = 2;
var RETURN_DATE_COLUMN_INDEX = 5;
var WHO_COLUMN_INDEX = 9;
var LOCATION_COLUMN_INDEX = 10;
function syncStaffTravelCalendar() {
    var staffTravelSheet = new StaffTravelCalendarSheet();
    staffTravelSheet.updateCalendar();
}
