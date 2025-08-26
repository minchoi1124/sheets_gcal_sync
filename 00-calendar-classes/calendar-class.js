// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var CalendarWrapper = /** @class */ (function () {
    function CalendarWrapper(calendarId) {
        this.gCalendar = CalendarApp.getCalendarById(calendarId);
    }
    CalendarWrapper.prototype.clearEventsBetweenDates = function (start, end) {
        var events = this.gCalendar.getEvents(start, end);
        events.forEach(function (event) {
            event.deleteEvent();
        });
    };
    CalendarWrapper.prototype.clearEventsOnCalendar = function () {
        var getEventsFromDate = new Date('1970-01-01');
        var getEventsUntilDate = new Date();
        getEventsUntilDate.setFullYear(getEventsUntilDate.getFullYear() + 200);
        var eventsToRemove = this.gCalendar.getEvents(getEventsFromDate, getEventsUntilDate);
        Logger.log("Deleting ".concat(eventsToRemove.length, " events from calendar"));
        for (var _i = 0, eventsToRemove_1 = eventsToRemove; _i < eventsToRemove_1.length; _i++) {
            var event = eventsToRemove_1[_i];
            event.deleteEvent();
        }
    };
    CalendarWrapper.prototype.addEventToCalendar = function (dateData, eventData, tags) {
        if (tags === void 0) { tags = {}; }
        var calendarEvent = new CalendarEvent(this.gCalendar, dateData, eventData, tags);
        return calendarEvent.tryAddingToCalendar();
    };
    return CalendarWrapper;
}());
0;
