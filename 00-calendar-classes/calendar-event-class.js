// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var CalendarEvent = /** @class */ (function () {
    function CalendarEvent(gCalendar, dateData, eventData, tags) {
        this.isAllDayEvent = eventData.allDayEvent;
        this.gCalendar = gCalendar;
        this.eventTitle = eventData.what;
        this.setTimes(dateData, eventData.startTimeDate, eventData.endTimeDate);
        this.inCharge = eventData.inCharge;
        this.location = eventData.location;
        this.additionalAssigments = eventData.whoElse;
        this.tags = tags;
    }
    CalendarEvent.prototype.setTimes = function (dateData, startTime, endTime) {
        if (!startTime && !endTime) {
            this.isAllDayEvent = true;
        }
        this.setEventStart(dateData, startTime);
        this.setEventEnd(dateData, endTime);
    };
    CalendarEvent.prototype.setEventStart = function (dateData, startTime) {
        if (IS_ALL_DAY(startTime)) {
            this.eventStart = new CalendarDate(dateData.year, dateData.month, dateData.day);
            this.isAllDayEvent = true;
        }
        else {
            // Extract hours and minutes avoiding timezone issues with 1899 dates
            // Get the time portion by using the date's time components
            var timeDate = new Date(startTime);
            // Use UTC methods to avoid historical timezone offsets from 1899
            var hours = timeDate.getUTCHours();
            var minutes = timeDate.getUTCMinutes();

            Logger.log("setEventStart: original time=".concat(startTime, ", extracted UTC hours=").concat(hours, ", minutes=").concat(minutes));

            this.eventStart = new CalendarDate(dateData.year, dateData.month, dateData.day, hours, minutes);
        }
    };
    CalendarEvent.prototype.setEventEnd = function (dateData, endTime) {
        if (IS_ALL_DAY(endTime)) {
            this.eventEnd = new CalendarDate(dateData.year, dateData.month, dateData.day);
            this.isAllDayEvent = true;
        }
        else {
            // Extract hours and minutes avoiding timezone issues with 1899 dates
            var timeDate = new Date(endTime);
            // Use UTC methods to avoid historical timezone offsets from 1899
            var hours = timeDate.getUTCHours();
            var minutes = timeDate.getUTCMinutes();

            Logger.log("setEventEnd: original time=".concat(endTime, ", extracted UTC hours=").concat(hours, ", minutes=").concat(minutes));

            this.eventEnd = new CalendarDate(dateData.year, dateData.month, dateData.day, hours, minutes);
        }
    };
    CalendarEvent.prototype.addErrorEventToCalendar = function () {
        var errorTimes = this.eventStart.createErrorTimes();
        this.gCalendarEvent = this.gCalendar.createEvent("THERE WAS AN ERROR WITH THIS EVENT: ".concat(this.eventTitle), errorTimes.startTime, errorTimes.endTime);
    };
    /**
     * 
     * @returns integer
     *      true if event failed to add
     *      false if event added successfully
     */
    CalendarEvent.prototype.addToCalendar = function () {
        Logger.log("📅 Adding event to calendar: ".concat(this.eventTitle));
        Logger.log("   Type: ".concat(this.isAllDayEvent ? "All-day" : "Timed"));

        if (this.isAllDayEvent) {
            var rowStartDate = this.eventStart.createDate(this.isAllDayEvent);
            var rowEndDate = this.eventEnd.createDate(this.isAllDayEvent);
            var eventEndDateToUse = this.eventStart.isSameDay(this.eventEnd) ? null : rowEndDate;

            Logger.log("   Start date: ".concat(rowStartDate.toDateString()));
            if (eventEndDateToUse) {
                Logger.log("   End date: ".concat(eventEndDateToUse.toDateString()));
            } else {
                Logger.log("   End date: same as start (single day)");
            }

            // exponential back off to prevent overloading the calendar service
            var tries = 0;
            var maxTries = 5;
            var waitTime = 100;
            var scale = 1.5;
            try {
                Logger.log("   Calling createAllDayEvent...");
                this.gCalendarEvent = this.gCalendar.createAllDayEvent(this.eventTitle, rowStartDate, eventEndDateToUse, { description: this.getEventDescription() });
                Logger.log("   ✓ All-day event created successfully!");
            } catch (error) {
                Logger.log("   ⚠ Error on first try: ".concat(error.message));
                while (tries < maxTries) {
                    try {
                        Utilities.sleep(waitTime);
                        this.gCalendarEvent = this.gCalendar.createAllDayEvent(this.eventTitle, rowStartDate, eventEndDateToUse, { description: this.getEventDescription() });
                        Logger.log("   ✓ All-day event created on retry ".concat(tries + 1));
                        break;
                    } catch (retryError) {
                        tries++;
                        waitTime = waitTime * scale;
                        Logger.log("   ⚠ Retry ".concat(tries, " failed: ").concat(retryError.message));
                    }
                }
                if (tries >= maxTries) {
                    Logger.log("   ✗ Failed to add all day event after ".concat(maxTries, " tries: ").concat(this.eventTitle));
                    return false;
                }
            }
        }
        else {
            var startDate = this.eventStart.createDate();
            var endDate = this.eventEnd.createDate();

            Logger.log("   Start: ".concat(startDate.toLocaleString()));
            Logger.log("   End: ".concat(endDate.toLocaleString()));

            // exponential back off to prevent overloading the calendar
            var tries = 0;
            var maxTries = 5;
            var waitTime = 100;
            var scale = 1.5;
            try {
                Logger.log("   Calling createEvent...");
                this.gCalendarEvent = this.gCalendar.createEvent(this.eventTitle, startDate, endDate, { description: this.getEventDescription() });
                Logger.log("   ✓ Timed event created successfully!");
            } catch (error) {
                Logger.log("   ⚠ Error on first try: ".concat(error.message));
                while (tries < maxTries) {
                    try {
                        Utilities.sleep(waitTime);
                        this.gCalendarEvent = this.gCalendar.createEvent(this.eventTitle, startDate, endDate, { description: this.getEventDescription() });
                        Logger.log("   ✓ Timed event created on retry ".concat(tries + 1));
                        break;
                    } catch (retryError) {
                        tries++;
                        waitTime = waitTime * scale;
                        Logger.log("   ⚠ Retry ".concat(tries, " failed: ").concat(retryError.message));
                    }
                }
                if (tries >= maxTries) {
                    Logger.log("   ✗ Failed to add timed event after ".concat(maxTries, " tries: ").concat(this.eventTitle));
                    return false;
                }
            }
        }
        return true;
    };
    CalendarEvent.prototype.getEventDescription = function () {
        return "\n    Location: ".concat(this.location, " \n    In Charge (w/in the city): ").concat(this.inCharge, "\n    Additional Assignments: ").concat(this.additionalAssigments, "\n    ");
    };
    CalendarEvent.prototype.setTags = function () {
        var _this = this;
        if (!this.gCalendarEvent) {
            throw new Error('gCalendar event must be created before adding any tags');
        }
        Object.keys(this.tags).forEach(function (tagKey) {
            _this.gCalendarEvent.setTag(tagKey, _this.tags[tagKey]);
        });
    };
    CalendarEvent.prototype.tryAddingToCalendar = function () {
        var addWasSuccessful;
        try {
            addWasSuccessful = this.addToCalendar();
        }
        catch (error) {
            Logger.log("Error adding event to calendar: ".concat(this.eventTitle));
            console.error(error);
            this.addErrorEventToCalendar();
            this.gCalendarEvent.setDescription(error.message);
            addWasSuccessful = false;
        }
        if (addWasSuccessful) {
            this.setTags();
        }
        return addWasSuccessful;
    };
    return CalendarEvent;
}());
