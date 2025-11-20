// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var MINISTRIES = ['Weekly'];

// All events go to Weekly calendar regardless of MIN GROUP value
var alt_tags = {
    'Weekly': []
};

// Row validation regex - for date rows we expect datetime object in first column
var row_regex = [
    /^.*$/, // any value in first column (could be MIN GROUP text or START TIME)
    /^.*$/, // START TIME or END TIME
    /^.*$/, // END TIME or WHAT
    /^.*$/  // WHAT or other content
]