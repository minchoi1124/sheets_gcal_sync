// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
function updateCalendars() {
    OnestopCalendarController.updateAllMinistries();
}
function handleEdit() {
    OnestopCalendarController.grabCalendars();
    TriggerController.getCurrentTriggers();
    TriggerController.createAndDeleteTriggers();
    return;
}
function checkUpdating() {
    var onestop = new Onestop();
    console.log("".concat(!!onestop.checkIsBeingUpdated()));
}
// Update executeOnEditCalendarUpdate variable in trigger controllers if changing this function name
function executeOnEditCalendarUpdate() {
    OnestopCalendarController.grabCalendars();
    TriggerController.executeUpdateCalendarsOnEdit();
    return;
}
function getTriggerIds() {
    TriggerController.logTriggerIds();
}

// run this once manually to install the trigger
function installOnEditTrigger() {
  ScriptApp.newTrigger("handleEdit")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}

// test function to experiment with the sheet
function testFunction() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('8/25-8/31 (WK1)');
    var startTimes = sheet.getRange(1, 2, 10, 2).getValues();
    Logger.log(startTimes);
}

// Helper function to manually reset the updating cell if it gets stuck
function resetUpdatingCell() {
    var onestop = new Onestop();
    var currentValue = onestop.checkIsBeingUpdated();
    Logger.log("Current isUpdatingCell value: " + currentValue);

    onestop.setIsBeingUpdated(false);
    Logger.log("Reset isUpdatingCell to false");

    var newValue = onestop.checkIsBeingUpdated();
    Logger.log("New isUpdatingCell value: " + newValue);
}

// Helper function to manually clear all hashes and force a full resync
function forceFullResync() {
    Logger.log("Clearing all saved hashes to force full resync...");
    var onestop = new Onestop();
    onestop.clearHashes();
    Logger.log("Hashes cleared. Next sync will update all sheets.");
}

// Test function to verify calendar connection and event creation
function testCalendarConnection() {
    Logger.log("=== Testing Calendar Connection ===");

    // Get the calendar ID from constants
    Logger.log("Calendar ID: " + WEEKLY_CALENDAR_ID);

    try {
        // Try to get the calendar
        var calendar = CalendarApp.getCalendarById(WEEKLY_CALENDAR_ID);

        if (!calendar) {
            Logger.log("❌ ERROR: Could not get calendar with ID: " + WEEKLY_CALENDAR_ID);
            Logger.log("Check that:");
            Logger.log("1. The calendar ID is correct");
            Logger.log("2. You have access to this calendar");
            Logger.log("3. The calendar hasn't been deleted");
            return;
        }

        Logger.log("✓ Successfully retrieved calendar: " + calendar.getName());

        // Create a test event for tomorrow
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        var endTime = new Date(tomorrow);
        endTime.setHours(11, 0, 0, 0);

        Logger.log("Creating test event for: " + tomorrow.toLocaleString());

        var testEvent = calendar.createEvent(
            "🧪 TEST EVENT - Calendar Sync Working!",
            tomorrow,
            endTime,
            { description: "This is a test event created by the sync script. You can delete this." }
        );

        Logger.log("✓ SUCCESS! Test event created with ID: " + testEvent.getId());
        Logger.log("✓ Event title: " + testEvent.getTitle());
        Logger.log("✓ Event time: " + testEvent.getStartTime().toLocaleString());
        Logger.log("");
        Logger.log("Check your calendar now - you should see the test event tomorrow at 10 AM!");
        Logger.log("If you see it, the calendar connection is working correctly.");

    } catch (error) {
        Logger.log("❌ ERROR: " + error.message);
        Logger.log("Stack trace: " + error.stack);
    }

    Logger.log("=== Test Complete ===");
}

// All-in-one function to fix everything and sync immediately
function fixAndSyncNow() {
    Logger.log("=== Starting fixAndSyncNow ===");

    // Step 1: Reset the updating cell
// All-in-one function to fix everything and sync immediately
function fixAndSyncNow() {
    Logger.log("=== Starting fixAndSyncNow ===");
    Logger.log("Step 1: Resetting updating cell...");
    var onestop = new Onestop();
    onestop.setIsBeingUpdated(false);
    Logger.log("✓ isUpdatingCell reset to false");

    // Step 2: Clear all hashes to force full resync
    Logger.log("Step 2: Clearing saved hashes...");
    onestop.clearHashes();
    Logger.log("✓ Hashes cleared");

    // Step 3: Initialize calendars
    Logger.log("Step 3: Grabbing calendars...");
    OnestopCalendarController.grabCalendars();
    Logger.log("✓ Calendars initialized");

    // Step 4: Run the sync
    Logger.log("Step 4: Running sync...");
    OnestopCalendarController.updateAllMinistries();
    Logger.log("✓ Sync completed!");

    Logger.log("Step 2: Clearing saved hashes...");
    onestop.clearHashes();
    Logger.log("✓ Hashes cleared");
    Logger.log("Step 3: Grabbing calendars...");
    OnestopCalendarController.grabCalendars();
    Logger.log("✓ Calendars initialized");
    Logger.log("Step 4: Running sync...");
    OnestopCalendarController.updateAllMinistries();
    Logger.log("✓ Sync completed!");
    Logger.log("=== Finished fixAndSyncNow ===");
    Logger.log("Check your calendar - events should now be there!");
}