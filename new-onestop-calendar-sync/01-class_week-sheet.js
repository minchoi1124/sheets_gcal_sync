// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var DaySection = /** @class */ (function () {
    function DaySection(year, month, day) {
        this.dateData = { year: year, month: month, day: day };
        this.eventsData = [];
    }
    DaySection.prototype.addEventData = function (eventData) {
        this.eventsData.push(eventData);
    };
    DaySection.prototype.getEventDataByMinistry = function (ministry) {
        // Logger.log("Ministry: ", ministry);
        // Logger.log("EventsData: ", this.eventsData);

        return this.eventsData.filter(function (event) { return event.ministry === ministry; });
    };
    return DaySection;
}());
var WeekSheet = /** @class */ (function () {
    function WeekSheet(gSheet) {
        this.errorNote = '\n\nTHIS ROW IS CAUSING AN ERROR IN THE CALENDAR, IT\'S PROBABLY THE START OR END TIME\n\n';
        this.gSheet = gSheet;
        this.dailyData = [];
        this.sheetName = gSheet.getName();
        this.setWeekData();
        var startAndEndDateRegex = /\b\d{1,2}\/\d{1,2}(?=\D)/g;
        var _a = this.sheetName.match(startAndEndDateRegex), firstDayString = _a[0], lastDayString = _a[1];
        var firstDayYear = this.getYearForMonth(firstDayString.split('/')[0]);
        var lastDayYear = this.getYearForMonth(lastDayString.split('/')[0]);
        this.firstDay = new Date("".concat(firstDayString, "/").concat(firstDayYear));
        this.lastDay = new Date("".concat(lastDayString, "/").concat(lastDayYear));
        this.lastDay.setHours(23, 59, 59, 999);
    }
    WeekSheet.prototype.getYearForMonth = function (month) {
        if (new Date().getMonth() >= 10 && month <= 2) {
            return new Date().getFullYear() + 1;
        }
        return new Date().getFullYear();
    };
    WeekSheet.prototype.eventDataFromRow = function (row) {
        var eventRange = this.gSheet.getRange(row, 1, 1, 11);
        return {
            row: row,
            ministry: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.MINISTRY).getValue(),
            startTimeDate: new Date(eventRange.getCell(1, ONESTOP_COLUMN_VALUES.START).getValue()),
            endTimeDate: new Date(eventRange.getCell(1, ONESTOP_COLUMN_VALUES.END).getValue()),
            startTime: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.START).getValue(),
            endTime: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.END).getValue(),
            what: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.WHAT).getValue(),
            location: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.LOCATION).getValue(),
            inCharge: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.IN_CHARGE).getValue(),
            whoElse: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.WHO_ELSE).getValue(),
            food: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.FOOD).getValue(),
            childcare: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.CHILD).getValue(),
            //tech: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.TECH).getValue(),
            note: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.NOTE).getValue(),
            struckThrough: eventRange.getCell(1, ONESTOP_COLUMN_VALUES.WHAT).getFontLine() === 'line-through',
            allDayEvent: IS_ALL_DAY(eventRange.getCell(1, ONESTOP_COLUMN_VALUES.START).getValue()) && IS_ALL_DAY(eventRange.getCell(1, ONESTOP_COLUMN_VALUES.END).getValue())
        };
    };
    WeekSheet.prototype.isErroringRow = function (row) {
        var eventRange = this.gSheet.getRange(row, 1, 1, 11);
        var noteCell = eventRange.getCell(1, ONESTOP_COLUMN_VALUES.NOTE);
        if (noteCell.getValue().includes(this.errorNote)) {
            return true;
        }
        return false;
    };
    WeekSheet.prototype.makeErrorRowObvious = function (row) {
        Logger.log("Row ".concat(row, " in sheet ").concat(this.sheetName, " has an error, attempting to change the formatting to make it obvious"));
        var eventRange = this.gSheet.getRange(row, 1, 1, 11);
        var noteCell = eventRange.getCell(1, ONESTOP_COLUMN_VALUES.NOTE);
        if (!this.isErroringRow(row)) {
            noteCell.setValue("".concat(noteCell.getValue()).concat(this.errorNote));
        }
    };
    WeekSheet.prototype.restoreErrorRow = function (row) {
        Logger.log("Error for row ".concat(row, " in sheet ").concat(this.sheetName, " has been fixed, attempting to restore"));
        var eventRange = this.gSheet.getRange(row, 1, 1, 11);
        var noteCell = eventRange.getCell(1, ONESTOP_COLUMN_VALUES.NOTE);
        noteCell.setValue(noteCell.getValue().replace(this.errorNote, ''));
    };
    WeekSheet.prototype.setWeekData = function () {

        // var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('8/25-8/31 (WK1)');
        // var startTimes = sheet.getRange(1, 2, 10, 1).getValues();
        // Logger.log(startTimes);

        // startTimes.forEach(function(startTime) {
        //     Logger.log(String(startTime));     
        //     Logger.log(startTime);
        // })

        var numRows = this.gSheet.getMaxRows();
        // TODO: Right how this assumes that the event data starts from row 2. This is error prone because it might not, so we might need to fix this in the future.
        for (var i = 2; i <= numRows; i++) {
        //for (var i = 2; i <= 20; i++) {
            var row = this.gSheet.getRange(i, 1, 1, 11).getValues();
            //Logger.log(row);

            // Different error handling things
            var ministry = String(row[0][ONESTOP_COLUMN_VALUES.MINISTRY - 1]);
            var startTime = String(row[0][ONESTOP_COLUMN_VALUES.START - 1]);
            var endTime = String(row[0][ONESTOP_COLUMN_VALUES.END - 1]);
            var what = String(row[0][ONESTOP_COLUMN_VALUES.WHAT - 1]);
            
            var hasMinistry = (ministry !== "");
            var hasStartTime = (startTime !== "");
            var hasEndTime = (endTime !== "");
            var hasWhat = (what !== "");

            var isRowFull = hasMinistry && hasStartTime && hasEndTime && hasWhat;
            var isAllDayEvent = hasMinistry && !hasStartTime && !hasEndTime && hasWhat;

            var possibleDate = new Date(this.gSheet.getRange(i, 2).getCell(1, 1).getValue());
            var startTimeIsDate = !(possibleDate.getFullYear() == 1899) && hasStartTime && !hasEndTime;

            if (!isRowFull && !isAllDayEvent && !startTimeIsDate) {
                Logger.log("Row ".concat(i, " is an empty or incomplete row"));
                continue;
            }

            if (startTimeIsDate) {
                this.dailyData.push(new DaySection(possibleDate.getFullYear(), possibleDate.getMonth(), possibleDate.getDate()));
            }
            else {
                var eventData = this.eventDataFromRow(i);
                if (eventData.what && !eventData.struckThrough) {
                    var mostRecentDay = this.dailyData[this.dailyData.length - 1];
                    //Logger.log("mostRecentDay: ".concat(JSON.stringify(mostRecentDay.dateData)));

                    eventData.startTimeDate.setFullYear(mostRecentDay.dateData.year);
                    eventData.startTimeDate.setMonth(mostRecentDay.dateData.month);
                    eventData.startTimeDate.setDate(mostRecentDay.dateData.day);
                    eventData.startTimeDate.setHours(eventData.startTimeDate.getHours() + 1);

                    eventData.endTimeDate.setFullYear(mostRecentDay.dateData.year);
                    eventData.endTimeDate.setMonth(mostRecentDay.dateData.month);
                    eventData.endTimeDate.setDate(mostRecentDay.dateData.day);
                    eventData.endTimeDate.setHours(eventData.endTimeDate.getHours() + 1);


                    //Logger.log(eventData);
                    eventData.year = mostRecentDay.dateData.year;
                    eventData.month = mostRecentDay.dateData.month;
                    eventData.day = mostRecentDay.dateData.day;
                    mostRecentDay.addEventData(eventData);
                }
            }
        }
        //Logger.log(mostRecentDay);
    };
    return WeekSheet;
}());
