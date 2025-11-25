// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var TriggerController = /** @class */ (function () {
    function TriggerController() {
    }
    TriggerController.logTriggerIds = function () {
        this.currentTriggers.forEach(function (trigger) { return console.log(trigger.getUniqueId()); });
    };
    TriggerController.executeUpdateCalendarsOnEdit = function () {
        Logger.log('Executing updateCalendars from trigger');
        this.getCurrentTriggers();
        if (this.nonDailyUpdateCalendarTriggers.length > 1) {
            Logger.log('Multiple triggers detected, filtering to keep only the last one');
            this.filterTriggersForLast();
            return;
        }

        var isCurrentlyUpdating = this.onestop.checkIsBeingUpdated();
        Logger.log('Is currently updating: ' + isCurrentlyUpdating);

        if (!isCurrentlyUpdating) {
            Logger.log('Starting calendar update...');
            try {
                this.onestop.setIsBeingUpdated(true);
                OnestopCalendarController.updateAllMinistries();
                Logger.log('Calendar update completed successfully');
            } catch (error) {
                Logger.log('ERROR during calendar update: ' + error.message);
                throw error;
            } finally {
                // Always reset the updating flag, even if there was an error
                this.onestop.setIsBeingUpdated(false);
                Logger.log('Reset isUpdatingCell to false');
            }
        } else {
            Logger.log('Skipping update - another update is already in progress');
        }

        this.nonDailyUpdateCalendarTriggers.forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
        return;
    };
    TriggerController.filterTriggersForLast = function () {
        Logger.log('Deleting all updateCalendars triggers except the last one and the 3 am daily one');
        this.nonDailyUpdateCalendarTriggers.slice(0, -1).forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
    };
    TriggerController.createTrigger = function () {
        var now = new Date();
        var fiveMinutesFromNow = new Date(now.getTime() + 1 * 10 * 1000); // Add 10 seconds in milliseconds
        ScriptApp.newTrigger('executeOnEditCalendarUpdate')
            .timeBased()
            .at(fiveMinutesFromNow)
            .create();
        Logger.log("Created new trigger to update calendars at ".concat(fiveMinutesFromNow.toLocaleString()));
        return;
    };
    TriggerController.createAndDeleteTriggers = function () {
        this.nonDailyUpdateCalendarTriggers.forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
        this.createTrigger();
        return;
    };
    TriggerController.getCurrentTriggers = function () {
        this.currentTriggers = ScriptApp.getProjectTriggers();
        this.nonDailyUpdateCalendarTriggers = this.currentTriggers.filter(function (trigger) { return trigger.getHandlerFunction() === TriggerController.UPDATE_CALENDAR_FUNCTION && trigger.getUniqueId() !== TriggerController.DAILY_UPDATE_TRIGGER_ID; });
        Logger.log("There are ".concat(this.nonDailyUpdateCalendarTriggers.length, " non-daily update calendar triggers"));
    };
    var _a;
    _a = TriggerController;
    TriggerController.UPDATE_CALENDAR_FUNCTION = 'executeOnEditCalendarUpdate';
    TriggerController.DAILY_UPDATE_TRIGGER_ID = '284960250';
    //TriggerController.currentTriggers = ScriptApp.getProjectTriggers();
    //TriggerController.nonDailyUpdateCalendarTriggers = _a.currentTriggers.filter(function (trigger) { return trigger.getHandlerFunction() === _a.UPDATE_CALENDAR_FUNCTION && trigger.getUniqueId() !== _a.DAILY_UPDATE_TRIGGER_ID; });
    TriggerController.onestop = new Onestop();
    return TriggerController;
}());
