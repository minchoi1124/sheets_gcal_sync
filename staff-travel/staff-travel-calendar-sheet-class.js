// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var STAFF_TRAVEL_CALENDAR_COLUMN_VALUES = {
    START_DATE: 1,
    RETURN_DATE: 4,
    WHO: 8,
    LOCATION: 9
};
var StaffTravelCalendarSheet = /** @class */ (function (_super) {
    __extends(StaffTravelCalendarSheet, _super);
    function StaffTravelCalendarSheet() {
        return _super.call(this, 'Staff & Family Travel') || this;
    }
    StaffTravelCalendarSheet.prototype.cellBelongsInCalendar = function (row) {
        if (row < this.startingRow) {
            return false;
        }
        if (!this.isEmptyCell(row, STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.START_DATE)) {
            return true;
        }
        return false;
    };
    StaffTravelCalendarSheet.prototype.getRows = function () {
        var _this = this;
        var calendarDataWithRowNumbers = this.calendarData.map(function (rowInSheet, rowNumber) { return ({ rowInSheet: rowInSheet, rowNumber: rowNumber }); });
        var relevantRowData = calendarDataWithRowNumbers.filter(function (data) { return _this.cellBelongsInCalendar(data.rowNumber); });
        return relevantRowData.map(function (relevantData) { return new StaffTravelCalendarSheetRow(relevantData.rowInSheet, relevantData.rowNumber); });
    };
    StaffTravelCalendarSheet.prototype.updateCalendar = function () {
        var updatedRows = this.getRows();
        var calendar = new CalendarWrapper(STAFF_TRAVEL_CALENDAR_ID);
        calendar.updateCalendar(updatedRows);
    };
    return StaffTravelCalendarSheet;
}(CalendarSheet));
var StaffTravelCalendarSheetRow = /** @class */ (function () {
    function StaffTravelCalendarSheetRow(calendarRow, rowNumber) {
        this.location = calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.LOCATION];
        this.rowNumber = rowNumber;
        this.who = calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.WHO];
        this.startDate = this.parseCalendarDate(calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.START_DATE]);
        var useStartDateAsEndDate = calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.RETURN_DATE] === '';
        var endDateString = useStartDateAsEndDate ? calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.START_DATE] : calendarRow[STAFF_TRAVEL_CALENDAR_COLUMN_VALUES.RETURN_DATE];
        this.endDate = this.parseCalendarDate(endDateString);
        this.allDay = true;
        this.eventTitle = "".concat(this.who, " - ").concat(this.location);
    }
    StaffTravelCalendarSheetRow.prototype.parseCalendarDate = function (day) {
        var parsedDate = new Date(day);
        if (isNaN(parsedDate.getTime())) {
            console.error('Invalid date:', day);
            return null; // or handle this case as you see fit
        }
        return new CalendarDate(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    };
    return StaffTravelCalendarSheetRow;
}());
