## Requirements

These are the behaviors required for basic functionality.
### General 
- [ ] The calendars shall update five minutes after the spreadsheet is updated.
- [x] The link is not bi-directional. Updating the calendars will not update the Onestop.
- [ ] After processing an update, the updating cell value should be set to false

### Time based conflicts
- [ ] A new update request cancels all pending updates on their five minute timer. This, in theory, prevents multiple updates being processed at the same time. If a new update request is made at 10:00.00 AM, and a second new update request is made at 10:00.01 AM, the first update request will be canceled. 
- [ ] A new update request is independent from an update request that is already being processed. So the current update will finish, and then 5 minutes later, the new update request will be processed. 

### Rows
- [ ] A date row will have a MM/DD in the "START TIME" column, and will optionally have text in the "WHAT" column.

There are only two cases in which an event row is considered valid and should be rendered
- [ ] If an event has a ministry, start time, end time, and what/title, then it is valid
- [ ] If an event has a ministry, no start time, no end time, and what/title, then it is valid
  
### Sheets
- [ ] If a sheet is marked has hidden, it should be completely ignored
- [ ] A sheet must be named with the format "MM/DD - MM/DD (WK[n])" or else it will not be processed