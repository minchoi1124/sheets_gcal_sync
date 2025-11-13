// Compiled using wl-onestop 1.0.0 (TypeScript 4.9.5)
var MINISTRIES = ['CPIs', 'Youth', 'Intl', 'Childcare', 'ALL', 'Joyland'];

var alt_tags = {
    'CPIs': ['Weekly CPI'],
    'Intl': ['Weekly Intl'],
    'ALL': ['Weekly']
};

var row_regex = [
    /^$/, // empty cell
    /^[A-Z][a-z]{2},\s\d{1,2}\/\d{1,2}$/, // date cell e.g., "Sun, 8/20"
    /^$/, // empty cell
    /^.*$/ // any text for event title, can be empty
]