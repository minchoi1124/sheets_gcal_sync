// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Onestop = /** @class */ (function () {
    function Onestop() {
        Logger.log('Onestop GCal Sync v'.concat(VERSION));
        this.onestopSheet = SpreadsheetApp.getActiveSpreadsheet();

        var sheets = this.getWeekSheets();
        sheets.forEach(sheet => {
            Logger.log(sheet.getName());
        })
        this.weeks = this.getWeekSheets().map(function (weekSheet) { Logger.log(weekSheet.getName()); return new WeekSheet(weekSheet); });
        this.scheduleHashesRange = this.onestopSheet.getSheetByName('SyncHashes').getRange(1, 1);
        this.isUpdatingCell = this.onestopSheet.getSheetByName('SyncHashes').getRange(2, 2, 1, 1).getCell(1, 1);
        Logger.log("Updating cell value is " + this.isUpdatingCell.getValue());
    }
    Onestop.prototype.getWeekSheets = function () {
        var today = new Date();
        var allWeekSheets = this.onestopSheet.getSheets()
            .filter(function (sheet) { return !sheet.isSheetHidden(); })
            // .filter(function (sheet) { return ONESTOP_WEEK_TAB_REGEX.test(sheet.getName()); });
        
        Logger.log(allWeekSheets.map(s => s.getName()).join("\n"));

        // Find current week and next week
        var relevantSheets = [];
        var foundCurrent = false;
        var foundNext = false;
        var currentWeekSheet = null;
        
        // First pass: find current week
        allWeekSheets.forEach(function(sheet) {
            var sheetName = sheet.getName();
            var dates = WeekSheet.parseDatesFromName(sheetName);
            
            if (!dates) {
                Logger.log("Skipping sheet with unparseable dates: " + sheetName);
                return;
            }
            
            // Check if this week contains today (current week)
            if (!foundCurrent && dates.firstDay <= today && today <= dates.lastDay) {
                Logger.log("✓ Current week: " + sheetName);
                relevantSheets.push(sheet);
                currentWeekSheet = { sheet: sheet, dates: dates };
                foundCurrent = true;
            }
        });
        
        // Second pass: find the next week (immediately after current week)
        if (currentWeekSheet) {
            var currentWeekEnd = currentWeekSheet.dates.lastDay;
            var nextWeekCandidate = null;
            var smallestGap = null;
            
            allWeekSheets.forEach(function(sheet) {
                var sheetName = sheet.getName();
                var dates = WeekSheet.parseDatesFromName(sheetName);
                
                if (!dates) return;
                
                // Check if this sheet starts after current week ends
                if (dates.firstDay > currentWeekEnd) {
                    var gap = dates.firstDay - currentWeekEnd;
                    
                    // Find the sheet that starts soonest after current week
                    if (smallestGap === null || gap < smallestGap) {
                        smallestGap = gap;
                        nextWeekCandidate = sheet;
                    }
                }
            });
            
            if (nextWeekCandidate) {
                Logger.log("✓ Next week: " + nextWeekCandidate.getName());
                relevantSheets.push(nextWeekCandidate);
                foundNext = true;
            }
        }
        
        if (!foundCurrent) {
            Logger.log("⚠ Warning: No current week sheet found! " + today);
        }
        if (!foundNext) {
            Logger.log("⚠ Warning: No next week sheet found!");
        }
        
        Logger.log("Syncing " + relevantSheets.length + " sheets (current week + next week)");
        return relevantSheets;
    };
    Onestop.prototype.getEarliestDay = function () {
        var firstDayTimestamps = this.weeks.map(function (week) { return week.firstDay; }).map(function (firstDay) { return firstDay.getTime(); });
        return new Date(Math.min.apply(Math, firstDayTimestamps));
    };
    Onestop.prototype.getHashes = function () {
        return this.weeks.reduce(function (weekHashData, week) {
            var _a;
            var hashWeekName = week.sheetName.replace(/\(WIP\)$/, '').trim();
            var ministriesHashDictionary = MINISTRIES.reduce(function (hashedMinistries, ministry) {
                var _a;
                var eventsArray = week.dailyData.map(function (daySection) { return ({
                    dateData: daySection.dateData,
                    eventData: daySection.getEventDataByMinistry(ministry)
                }); });
                var ministryEventsHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(eventsArray));
                return __assign(__assign({}, hashedMinistries), (_a = {}, _a[ministry] = ministryEventsHash.map(function (byte) { return ('0' + (byte & 0xFF).toString(16)).slice(-2); }).join(''), _a));
            }, {});
            return __assign(__assign({}, weekHashData), (_a = {}, _a[hashWeekName] = ministriesHashDictionary, _a));
        }, {});
    };
    Onestop.prototype.saveHashes = function () {
        var syncHashes = this.getHashes();
        console.log('saving hashes', syncHashes);
        this.scheduleHashesRange.setValue(JSON.stringify(syncHashes));
    };
    Onestop.prototype.clearHashes = function () {
        this.scheduleHashesRange.clear();
    };
    Onestop.prototype.weekNamesAndMinistriesThatNeedSync = function () {
        var savedHashes = JSON.parse(this.onestopSheet.getSheetByName('SyncHashes').getRange(1, 1).getValue() || {});
        var currentHashes = this.getHashes();
        console.log('current hashes? ', currentHashes);
        return Object.keys(currentHashes).map(function (weekName) {
            var ministriesToHash = currentHashes[weekName];
            return {
                week: weekName,
                ministries: Object
                    .keys(ministriesToHash)
                    .filter(function (ministry) {
                        var _a, _b;
                        var hasSavedHash = !!((_a = savedHashes === null || savedHashes === void 0 ? void 0 : savedHashes[weekName]) === null || _a === void 0 ? void 0 : _a[ministry]);
                        return !hasSavedHash || ministriesToHash[ministry] !== ((_b = savedHashes === null || savedHashes === void 0 ? void 0 : savedHashes[weekName]) === null || _b === void 0 ? void 0 : _b[ministry]);
                    })
            };
        }).filter(function (needsSync) { return needsSync.ministries.length !== 0; });
    };
    Onestop.prototype.checkIsBeingUpdated = function () {
        return this.isUpdatingCell.getValue();
    };
    Onestop.prototype.setIsBeingUpdated = function (isBeingUpdated) {
        this.isUpdatingCell.setValue(isBeingUpdated);
        Logger.log("Set updating cell to ".concat(isBeingUpdated));
    };
    Onestop.prototype.countEvents = function () {
        var total = 0;
        this.weeks.forEach(function(week) {
            Logger.log("Week ".concat(week.sheetName, " has ").concat(week.numEvents, " events."));
            total += week.numEvents;
        });
        return total;
    }
    return Onestop;
}());