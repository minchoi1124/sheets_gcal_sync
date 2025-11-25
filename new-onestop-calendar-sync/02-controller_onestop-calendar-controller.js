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
        Logger.log("Creating events for week: ".concat(weekSheet.sheetName));
        Logger.log("Number of day sections: ".concat(weekSheet.dailyData.length));
        var totalEventsCreated = 0;
        weekSheet.dailyData.forEach(function (daySection) {
            Logger.log("Creating events for ".concat(daySection.dateData.month + 1, "/").concat(daySection.dateData.day, " - ").concat(daySection.eventsData.length, " events"));
            daySection.eventsData.forEach(function (event) {
                var calendar = _this.ministryCalendars[event.ministry];
                if (!calendar) {
                    Logger.log("ERROR: No calendar found for ministry: ".concat(event.ministry));
                    return;
                }
                var success = calendar.addEventToCalendar(daySection.dateData, event, { week: weekSheet.sheetName });
                if (success) {
                    totalEventsCreated++;
                    Logger.log("✓ Added event: ".concat(event.what));
                } else {
                    Logger.log("✗ Failed to add: ".concat(event.what));
                }
            });
        });
        Logger.log("Total events created for ".concat(weekSheet.sheetName, ": ").concat(totalEventsCreated));
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
        Logger.log("=== Starting updateAllMinistries ===");
        var weeks = this.onestop.weeks;
        Logger.log("Total weeks loaded: ".concat(weeks.length));
        Logger.log("All weeks: ".concat(weeks.map(function (week) { return week.sheetName; }).join(', ')));

        var weeksAndMinistriesThatNeedSync = this.onestop.weekNamesAndMinistriesThatNeedSync();
        Logger.log("Weeks that need sync: ".concat(weeksAndMinistriesThatNeedSync.length));
        Logger.log("Sync details: ".concat(JSON.stringify(weeksAndMinistriesThatNeedSync.map(function (needsSync) { return ({ week: needsSync.week, ministries: needsSync.ministries }); }))));

        if (weeksAndMinistriesThatNeedSync.length === 0) {
            Logger.log("No weeks need syncing - all sheets are up to date");
            return;
        }

        var clearedEarliest = [];
        weeksAndMinistriesThatNeedSync.forEach(function (needsSync) {
            Logger.log("Processing week: ".concat(needsSync.week));
            var weekToSync = weeks.find(function (week) { return week.sheetName == needsSync.week || week.sheetName == "".concat(needsSync.week, " (WIP)"); });

            if (!weekToSync) {
                Logger.log("ERROR: Could not find week sheet: ".concat(needsSync.week));
                return;
            }

            Logger.log("Syncing ministries: ".concat(JSON.stringify(needsSync.ministries)));
            needsSync.ministries.forEach(function (ministry) {
                Logger.log("Processing ministry: ".concat(ministry));
                if (!clearedEarliest.includes(ministry)) {
                    Logger.log("Clearing events before earliest date for ministry: ".concat(ministry));
                    OnestopCalendarController.deleteEventsBeforeEarliestOnestopDateByMinistry(ministry);
                    clearedEarliest.push(ministry);
                }
                Logger.log("Deleting events in week for ministry: ".concat(ministry));
                OnestopCalendarController.deleteEventsInWeekByMinistry(weekToSync, ministry);
                Logger.log("Creating events for ministry: ".concat(ministry));
                OnestopCalendarController.createEventsForWeekByMinistry(weekToSync, ministry);
            });
        });

        Logger.log("Saving new hashes...");
        var newOnestop = new Onestop();
        newOnestop.saveHashes();

        Logger.log("Total events in system: ".concat(this.onestop.countEvents()));
        Logger.log("=== Finished updateAllMinistries ===");
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