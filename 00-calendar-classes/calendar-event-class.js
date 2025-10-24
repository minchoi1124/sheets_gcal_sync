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
            this.eventStart = new CalendarDate(dateData.year, dateData.month, dateData.day, new Date(startTime).getHours(), new Date(startTime).getMinutes());
        }
    };
    CalendarEvent.prototype.setEventEnd = function (dateData, endTime) {
        if (IS_ALL_DAY(endTime)) {
            this.eventEnd = new CalendarDate(dateData.year, dateData.month, dateData.day);
            this.isAllDayEvent = true;
        }
        else {
            this.eventEnd = new CalendarDate(dateData.year, dateData.month, dateData.day, new Date(endTime).getHours(), new Date(endTime).getMinutes());
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
        if (this.isAllDayEvent) {
            var rowStartDate = this.eventStart.createDate(this.isAllDayEvent);
            var rowEndDate = this.eventEnd.createDate(this.isAllDayEvent);
            var eventEndDateToUse = this.eventStart.isSameDay(this.eventEnd) ? null : rowEndDate;

            // exponential back off to prevent overloading the calendar service
            var tries = 0;
            var maxTries = 5;
            var waitTime = 100;
            var scale = 1.5;
            try {
                this.gCalendarEvent = this.gCalendar.createAllDayEvent(this.eventTitle, rowStartDate, eventEndDateToUse, { description: this.getEventDescription() });
            } catch {
                while (tries < maxTries) {
                    try {
                        Utilities.sleep(waitTime);
                        this.gCalendarEvent = this.gCalendar.createAllDayEvent(this.eventTitle, rowStartDate, eventEndDateToUse, { description: this.getEventDescription() });
                        break;
                    } catch {
                        tries++;
                        waitTime = waitTime * scale;
                    }
                }
                if (tries >= maxTries) {
                    Logger.log("Failed to add all day event: ".concat(this.eventTitle));
                    return false;
                }  
            }          
        }
        else {
            // exponential back off to prevent overloading the calendar 
            var tries = 0;
            var maxTries = 5;
            var waitTime = 100;
            var scale = 1.5;
            try {
                this.gCalendarEvent = this.gCalendar.createEvent(this.eventTitle, this.eventStart.createDate(), this.eventEnd.createDate(), { description: this.getEventDescription() });
            } catch {
                while (tries < maxTries) {
                    try {
                        Utilities.sleep(waitTime);
                        this.gCalendarEvent = this.gCalendar.createEvent(this.eventTitle, this.eventStart.createDate(), this.eventEnd.createDate(), { description: this.getEventDescription() });
                        break;
                    } catch {
                        tries++;
                        waitTime = waitTime * scale;
                    }
                }
                if (tries >= maxTries) {
                    Logger.log("Failed to add timed event: ".concat(this.eventTitle));
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
