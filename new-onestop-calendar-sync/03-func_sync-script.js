// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
function updateCalendars() {
    OnestopCalendarController.updateAllMinistries();
}
function onEdit() {
    TriggerController.createAndDeleteTriggers();
}
function checkUpdating() {
    var onestop = new Onestop();
    console.log("".concat(!!onestop.checkIsBeingUpdated()));
}
// Update executeOnEditCalendarUpdate variable in trigger controllers if changing this function name
function executeOnEditCalendarUpdate() {
    TriggerController.executeUpdateCalendarsOnEdit();
}
function getTriggerIds() {
    TriggerController.logTriggerIds();
}
