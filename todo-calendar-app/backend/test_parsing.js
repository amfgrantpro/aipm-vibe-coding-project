const { parseTask } = require('./taskParser');

// Mock strict date parsing for "Europe/London" or general European
// Note: build environment might be UTC, so we test relative dates or specific formats

const today = new Date('2023-10-27T10:00:00Z'); // Fixed reference date

console.log("--- Testing Scheduled Parsing ---");

const tests = [
    { input: "Dentist at 3pm Friday", expectedCategory: 'scheduled' },
    { input: "Buy Milk", expectedCategory: 'chore' }, // Should be chore if passed as scheduled? Wait, parser forces scheduled?
    // If we pass type='scheduled', it forces scheduled but might return null date.
    { input: "Meeting 25/12/2023", expectedCategory: 'scheduled', expectedDate: '2023-12-25' },
    { input: "Project due 10/05/2024", expectedCategory: 'scheduled', expectedDate: '2024-05-10' } // DD/MM/YYYY
];

tests.forEach(t => {
    // We simulate the server call: parseTask(text, type, referenceDate)
    // Case 1: passing 'scheduled'
    if (t.expectedCategory === 'scheduled') {
        const result = parseTask(t.input, 'scheduled', today);
        console.log(`Input: "${t.input}" -> Date: ${result.parsed_datetime}, Clean: "${result.clean_text}"`);

        if (t.expectedDate && result.parsed_datetime !== t.expectedDate) {
            console.error(`FAIL: Expected date ${t.expectedDate}, got ${result.parsed_datetime}`);
        }
    }
});

console.log("\n--- Testing Chore Parsing ---");
const chore = parseTask("Buy Milk", 'chore');
console.log(`Input: "Buy Milk" -> Category: ${chore.category}, Date: ${chore.parsed_datetime}`);
