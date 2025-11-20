// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var OnestopCalendarController = /** @class */ (function () {
    function OnestopCalendarController() {
    }
    OnestopCalendarController.deleteEventsInWeek = function (weekSheet) {
        var _this = this;
        Object.keys(this.ministryCalendars).forEach(function (ministry) {
            var calendar = _this.ministryCalendars[ministry];
            calendar.clearEventsBetweenDates(weekSheet.firstDay, weekSheet.lastDay);
        });
    };
    OnestopCalendarController.deleteEventsInWeekByMinistry = function (weekSheet, ministry) {
        var calendar = this.ministryCalendars[ministry];
        calendar.clearEventsBetweenDates(weekSheet.firstDay, weekSheet.lastDay);
    };
    OnestopCalendarController.deleteEventsBeforeEarliestOnestopDateByMinistry = function (ministry) {
        var calendar = this.ministryCalendars[ministry];
        var theBeginningOfTime = new Date('1970-01-01');
        var earliestDayInOnestop = this.onestop.getEarliestDay();
        calendar.clearEventsBetweenDates(theBeginningOfTime, earliestDayInOnestop);
    };
    OnestopCalendarController.createEventsForWeek = function (weekSheet) {
        var _this = this;
        Logger.log("weekSheet.dailyData\n: ".concat(JSON.stringify(weekSheet.dailyData)));
        weekSheet.dailyData.forEach(function (daySection) {
            Logger.log("Creating events for ".concat(daySection.dateData.month, "/").concat(daySection.dateData.day));
            daySection.eventsData.forEach(function (event) {
                var calendar = _this.ministryCalendars[event.ministry];
                var success = calendar.addEventToCalendar(daySection.dateData, event, { week: weekSheet.sheetName });
                if (!success) {
                    Logger.log("Failed to add: ".concat(JSON.stringify(event)));
                }
            });
        });
    };
    OnestopCalendarController.createEventsForWeekByMinistry = function (weekSheet, ministry) {
        var calendar = this.ministryCalendars[ministry];
        weekSheet.dailyData.forEach(function (daySection) {
            daySection.getEventDataByMinistry(ministry).forEach(function (event) {
                var eventWasSuccessfullyAdded = calendar.addEventToCalendar(daySection.dateData, event, { week: weekSheet.sheetName });
                if (!eventWasSuccessfullyAdded) {
                    Logger.log("Failed to add: ".concat(JSON.stringify(event)));
                }
            });
        });
    };
    OnestopCalendarController.updateAllMinistries = function () {
        var weeks = this.onestop.weeks;
        var weeksAndMinistriesThatNeedSync = this.onestop.weekNamesAndMinistriesThatNeedSync();
        var clearedEarliest = [];
        Logger.log("All weeks: ".concat(weeks.map(function (week) { return week.sheetName; }).join(', ')));
        Logger.log("Updating calendars: ".concat(JSON.stringify(weeksAndMinistriesThatNeedSync.map(function (needsSync) { return ({ week: needsSync.week, ministries: needsSync.ministries }); }))));
        weeksAndMinistriesThatNeedSync.forEach(function (needsSync) {
            var weekToSync = weeks.find(function (week) { return week.sheetName == needsSync.week || week.sheetName == "".concat(needsSync.week, "(WIP)"); });
            Logger.log("needsSync.ministries: ".concat(JSON.stringify(needsSync.ministries)));
            needsSync.ministries.forEach(function (ministry) {
                if (!clearedEarliest.includes(ministry)) {
                    OnestopCalendarController.deleteEventsBeforeEarliestOnestopDateByMinistry(ministry);
                    clearedEarliest.push(ministry);
                }
                OnestopCalendarController.deleteEventsInWeekByMinistry(weekToSync, ministry);
                OnestopCalendarController.createEventsForWeekByMinistry(weekToSync, ministry);
            });
        });
        var newOnestop = new Onestop();
        newOnestop.saveHashes();

        Logger.log("Total events added: ".concat(this.onestop.countEvents()));
    };
    OnestopCalendarController.grabCalendars = function () {
        Object.keys(this.caldendarIds).forEach(key => {
            OnestopCalendarController.ministryCalendars[key] = new CalendarWrapper(this.caldendarIds[key]);
        })
    }
    OnestopCalendarController.caldendarIds = {
        Weekly: WEEKLY_CALENDAR_ID
    }
    OnestopCalendarController.ministryCalendars = {};
    OnestopCalendarController.onestop = new Onestop();
    return OnestopCalendarController;
}());