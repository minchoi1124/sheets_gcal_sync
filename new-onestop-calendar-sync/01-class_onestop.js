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
        return this.onestopSheet.getSheets().filter(function (sheet) { return !sheet.isSheetHidden(); }).filter(function (sheet) { return ONESTOP_WEEK_TAB_REGEX.test(sheet.getName()); });
    };
    Onestop.prototype.getEarliestDay = function () {
        var firstDayTimestamps = this.weeks.map(function (week) { return week.firstDay; }).map(function (firstDay) { return firstDay.getTime(); });
        return new Date(Math.min.apply(Math, firstDayTimestamps));
    };
    Onestop.prototype.getHashes = function () {
        //console.log('weeks?', this.weeks);
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
    return Onestop;
}());
