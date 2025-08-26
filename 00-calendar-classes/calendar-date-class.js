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
var CalendarDate = /** @class */ (function () {
    function CalendarDate(year, month, day, hour, minute) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
    }
    CalendarDate.prototype.validateDate = function (isAllDay) {
        if (isAllDay === void 0) { isAllDay = false; }
        if (isNaN(this.year) || isNaN(this.month) || isNaN(this.day)) {
            throw new DateParseError("Part of the date was invalid.");
        }
        if (!isAllDay) {
            if (isNaN(this.hour) || isNaN(this.minute)) {
                throw new DateParseError("Part of the time was invalid.");
            }
        }
    };
    CalendarDate.prototype.createErrorTimes = function () {
        return {
            startTime: new Date(this.year, this.month, this.day, 5),
            endTime: new Date(this.year, this.month, this.day, 23, 59)
        };
    };
    CalendarDate.prototype.createDate = function (isAllDay) {
        if (isAllDay === void 0) { isAllDay = false; }
        this.validateDate(isAllDay);
        try {
            if (this.hour) {
                return new Date(this.year, this.month, this.day, this.hour, this.minute);
            }
            return new Date(this.year, this.month, this.day);
        }
        catch (error) {
            throw new DateParseError(error);
        }
    };
    CalendarDate.prototype.isSameDay = function (calendarDate) {
        return calendarDate.day === this.day
            && calendarDate.year === this.year
            && calendarDate.month === this.month;
    };
    return CalendarDate;
}());
var DateParseError = /** @class */ (function (_super) {
    __extends(DateParseError, _super);
    function DateParseError(error) {
        var _this = _super.call(this, error.message) || this;
        if (error.stack) {
            _this.stack = error.stack;
        }
        return _this;
    }
    return DateParseError;
}(Error));
