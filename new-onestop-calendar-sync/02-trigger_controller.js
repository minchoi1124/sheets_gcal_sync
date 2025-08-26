// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var TriggerController = /** @class */ (function () {
    function TriggerController() {
    }
    TriggerController.logTriggerIds = function () {
        this.currentTriggers.forEach(function (trigger) { return console.log(trigger.getUniqueId()); });
    };
    TriggerController.executeUpdateCalendarsOnEdit = function () {
        if (this.nonDailyUpdateCalendarTriggers.length > 1) {
            this.filterTriggersForLast();
            return;
        }
        if (!this.onestop.checkIsBeingUpdated()) {
            this.onestop.setIsBeingUpdated(true);
            OnestopCalendarController.updateAllMinistries();
            this.onestop.setIsBeingUpdated(false);
        }
        this.nonDailyUpdateCalendarTriggers.forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
    };
    TriggerController.filterTriggersForLast = function () {
        Logger.log('Deleting all updateCalendars triggers except the last one and the 3 am daily one');
        this.nonDailyUpdateCalendarTriggers.slice(0, -1).forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
    };
    TriggerController.createTrigger = function () {
        var now = new Date();
        var fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000); // Add 5 minutes in milliseconds
        ScriptApp.newTrigger('executeOnEditCalendarUpdate')
            .timeBased()
            .at(fiveMinutesFromNow)
            .create();
    };
    TriggerController.createAndDeleteTriggers = function () {
        this.nonDailyUpdateCalendarTriggers.forEach(function (trigger) {
            ScriptApp.deleteTrigger(trigger);
        });
        this.createTrigger();
    };
    var _a;
    _a = TriggerController;
    TriggerController.UPDATE_CALENDAR_FUNCTION = 'executeOnEditCalendarUpdate';
    TriggerController.DAILY_UPDATE_TRIGGER_ID = '284960250';
    TriggerController.currentTriggers = ScriptApp.getProjectTriggers();
    TriggerController.nonDailyUpdateCalendarTriggers = _a.currentTriggers.filter(function (trigger) { return trigger.getHandlerFunction() === _a.UPDATE_CALENDAR_FUNCTION && trigger.getUniqueId() !== _a.DAILY_UPDATE_TRIGGER_ID; });
    TriggerController.onestop = new Onestop();
    return TriggerController;
}());
