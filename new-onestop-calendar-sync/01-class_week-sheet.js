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
        // All events are "Weekly" ministry
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
        this.numEvents = 0;
        
        // Detect which format this sheet uses
        this.detectFormat();
        
        // Parse dates from sheet name BEFORE loading data
        this.parseDatesFromSheetName();
        
        this.setWeekData();
    }
    
    // Static method to parse dates from sheet name without creating full object
    WeekSheet.parseDatesFromName = function(sheetName) {
        var name = sheetName.replace(/\s*\(WIP\)\s*$/, '').trim();
        var dateMatch = name.match(/([0-9]{1,2}\/[0-9]{1,2}).*?-.*?([0-9]{1,2}\/[0-9]{1,2})/);
        
        if (dateMatch && dateMatch.length >= 3) {
            var startNum = dateMatch[1];
            var endNum = dateMatch[2];
            
            var startMonth, startDay, endMonth, endDay;
            
            if (startNum.length <= 3) {
                startMonth = parseInt(startNum[0]);
                startDay = parseInt(startNum.substring(2));
            } else if (startNum.length === 4) {
                if (startNum[1] !== '/') {
                    startMonth = parseInt(startNum.substring(0, 2));
                    startDay = parseInt(startNum[3]);
                } else {
                    startMonth = parseInt(startNum[0]);
                    startDay = parseInt(startNum.substring(2));
                }
            } else {
                startMonth = parseInt(startNum.substring(0, 2));
                startDay = parseInt(startNum.substring(3));
            }
            
            if (endNum.length <= 3) {
                endMonth = parseInt(endNum[0]);
                endDay = parseInt(endNum.substring(2));
            } else if (endNum.length === 4) {
                if (endNum[1] !== '/') {
                    endMonth = parseInt(endNum.substring(0, 2));
                    endDay = parseInt(endNum[3]);
                } else {
                    endMonth = parseInt(endNum[0]);
                    endDay = parseInt(endNum.substring(2));
                }
            } else {
                endMonth = parseInt(endNum.substring(0, 2));
                endDay = parseInt(endNum.substring(3));
            }
            
            var currentYear = new Date().getFullYear();
            var currentMonth = new Date().getMonth() + 1;
            
            var startYear = currentYear;
            var endYear = currentYear;
            
            if (currentMonth >= 11 && startMonth <= 2) {
                startYear = currentYear + 1;
                endYear = currentYear + 1;
            } else if (currentMonth <= 2 && startMonth >= 11) {
                startYear = currentYear - 1;
                endYear = currentYear;
            }
            
            if (endMonth < startMonth) {
                endYear = startYear + 1;
            }
            
            return {
                firstDay: new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0),
                lastDay: new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)
            };
        }
        
        return null;
    };
    
    WeekSheet.prototype.detectFormat = function () {
        // Check first row to see if it has "MIN GROUP" column
        var firstCell = this.gSheet.getRange(1, 1).getValue();
        if (firstCell === 'MIN GROUP') {
            this.columnValues = ONESTOP_COLUMN_VALUES_FORMAT1;
            this.hasMinGroupColumn = true;
        } else {
            this.columnValues = ONESTOP_COLUMN_VALUES_FORMAT2;
            this.hasMinGroupColumn = false;
        }
        Logger.log("Sheet ".concat(this.sheetName, " uses format ").concat(this.hasMinGroupColumn ? '1 (with MIN GROUP)' : '2 (without MIN GROUP)'));
    };
    
    WeekSheet.prototype.parseDatesFromSheetName = function () {
        Logger.log("In parseDatesFromSheetName")
        var dates = WeekSheet.parseDatesFromName(this.sheetName);
        
        if (dates) {
            this.firstDay = dates.firstDay;
            this.lastDay = dates.lastDay;
        } else {
            Logger.log("Warning: Could not parse dates from sheet name: " + this.sheetName);
            var today = new Date();
            this.firstDay = new Date(today);
            this.firstDay.setHours(0, 0, 0, 0);
            
            this.lastDay = new Date(today);
            this.lastDay.setDate(today.getDate() + 6);
            this.lastDay.setHours(23, 59, 59, 999);
        }
        
        Logger.log("Week ".concat(this.sheetName, ": ").concat(this.firstDay.toDateString(), " to ").concat(this.lastDay.toDateString()));
    };
    
    WeekSheet.prototype.eventDataFromRow = function (row) {
        var cols = this.columnValues;
        var eventRange = this.gSheet.getRange(row, 1, 1, 10);
        
        return {
            row: row,
            ministry: 'Weekly', // All events are Weekly
            startTimeDate: new Date(eventRange.getCell(1, cols.START).getValue()),
            endTimeDate: new Date(eventRange.getCell(1, cols.END).getValue()),
            startTime: eventRange.getCell(1, cols.START).getValue(),
            endTime: eventRange.getCell(1, cols.END).getValue(),
            what: eventRange.getCell(1, cols.WHAT).getValue(),
            location: eventRange.getCell(1, cols.LOCATION).getValue(),
            inCharge: eventRange.getCell(1, cols.IN_CHARGE).getValue(),
            whoElse: eventRange.getCell(1, cols.WHO_ELSE).getValue(),
            food: eventRange.getCell(1, cols.FOOD).getValue(),
            childcare: eventRange.getCell(1, cols.CHILDCARE).getValue(),
            note: eventRange.getCell(1, cols.NOTE).getValue(),
            struckThrough: eventRange.getCell(1, cols.WHAT).getFontLine() === 'line-through',
            allDayEvent: IS_ALL_DAY(eventRange.getCell(1, cols.START).getValue()) && IS_ALL_DAY(eventRange.getCell(1, cols.END).getValue())
        };
    };
    
    WeekSheet.prototype.isRowDate = function (row) {
        // Date rows have a datetime object in the first column (MIN GROUP or START TIME column)
        var firstCell = row[0][0];
        
        // Check if it's a Date object
        if (firstCell instanceof Date || Object.prototype.toString.call(firstCell) === '[object Date]') {
            return true;
        }
        
        // Also check if the cell contains a date string that can be parsed
        if (typeof firstCell === 'string') {
            var dateTest = new Date(firstCell);
            if (!isNaN(dateTest.getTime()) && firstCell.match(/\d{1,2}\/\d{1,2}/)) {
                return true;
            }
        }
        
        return false;
    };
    
    WeekSheet.prototype.getRowType = function (row, isDate) {
        if (isDate) {
            return 3; // Date row
        }
        
        var cols = this.columnValues;
        var startTime = String(row[0][cols.START - 1]);
        var endTime = String(row[0][cols.END - 1]);
        var what = String(row[0][cols.WHAT - 1]);
        
        var hasStartTime = (startTime !== "" && startTime !== "null" && startTime !== "undefined");
        var hasEndTime = (endTime !== "" && endTime !== "null" && endTime !== "undefined");
        var hasWhat = (what !== "" && what !== "null" && what !== "undefined");
        
        // Valid event: has WHAT and either times or is all-day
        if (hasWhat && (!hasStartTime && !hasEndTime)) {
            return 1; // All-day event
        }
        if (hasWhat && hasStartTime) {
            return 2; // Timed event
        }
        
        return 0; // Invalid row
    };
    
    WeekSheet.prototype.setWeekData = function () {
        var numRows = this.gSheet.getMaxRows();
        this.numEvents = 0;
        
        for (var i = 2; i <= numRows; i++) {
            var row = this.gSheet.getRange(i, 1, 1, 10).getValues();
            
            var isDate = this.isRowDate(row);
            var rowType = this.getRowType(row, isDate);
            
            if (rowType === 0) {
                continue; // Skip invalid rows
            }
            
            if (rowType === 3) {
                // Date row
                var dateCell = row[0][0];
                var possibleDate = new Date(dateCell);
                
                if (!isNaN(possibleDate.getTime())) {
                    this.dailyData.push(new DaySection(
                        possibleDate.getFullYear(), 
                        possibleDate.getMonth(), 
                        possibleDate.getDate()
                    ));
                }
            } else {
                // Event row
                if (this.dailyData.length === 0) {
                    // No date section yet, skip this event
                    continue;
                }
                
                var eventData = this.eventDataFromRow(i);
                
                if (rowType === 1) {
                    eventData.allDayEvent = true;
                } else {
                    eventData.allDayEvent = false;
                }
                
                if (eventData.what && !eventData.struckThrough) {
                    var mostRecentDay = this.dailyData[this.dailyData.length - 1];
                    
                    // Set the date for start and end times
                    if (!eventData.allDayEvent) {
                        eventData.startTimeDate.setFullYear(mostRecentDay.dateData.year);
                        eventData.startTimeDate.setMonth(mostRecentDay.dateData.month);
                        eventData.startTimeDate.setDate(mostRecentDay.dateData.day);
                        
                        eventData.endTimeDate.setFullYear(mostRecentDay.dateData.year);
                        eventData.endTimeDate.setMonth(mostRecentDay.dateData.month);
                        eventData.endTimeDate.setDate(mostRecentDay.dateData.day);
                    }
                    
                    eventData.year = mostRecentDay.dateData.year;
                    eventData.month = mostRecentDay.dateData.month;
                    eventData.day = mostRecentDay.dateData.day;
                    
                    mostRecentDay.addEventData(eventData);
                    this.numEvents += 1;
                }
            }
        }
        
        Logger.log("Events added for week sheet ".concat(this.sheetName, ": ").concat(this.numEvents));
    };
    
    return WeekSheet;
}());