// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var CalendarSheet = /** @class */ (function () {
    function CalendarSheet(tabName) {
        this.calendarTab = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
        this.calendarData = this.calendarTab.getDataRange().getValues();
        this.setStartingRow();
    }
    CalendarSheet.prototype.isEmptyCell = function (row, column) {
        var cellValue = this.calendarData[row][column];
        return cellValue == null || cellValue === '';
    };
    CalendarSheet.prototype.setStartingRow = function () {
        var maxRows = this.calendarTab.getMaxRows();
        var foundHiddenRow = false;
        for (var i = 1; i <= maxRows; i++) {
            // Start with the first row after the hidden rows. First few rows are headers/other things, and we don't want the hidden rows
            var foundStartingRow = !this.calendarTab.isRowHiddenByUser(i) && foundHiddenRow;
            if (foundStartingRow) {
                this.startingRow = i;
                return;
            }
            else if (this.calendarTab.isRowHiddenByUser(i)) {
                foundHiddenRow = true;
            }
        }
        Logger.log("No visible rows found");
        throw new Error("No visible rows found in sheet \"Upcoming Calendar\"");
    };
    CalendarSheet.prototype.getRowData = function (row) {
        return this.calendarData[row];
    };
    return CalendarSheet;
}());
