const chrono = require('chrono-node');

/**
 * Clean text by removing the matched date/time string
 */
function removeDateText(text, dateResult) {
    if (!dateResult) return text;
    
    const { index, text: matchText } = dateResult;
    // Remove the exact matched text
    const clean = text.slice(0, index) + text.slice(index + matchText.length);
    // clean up double spaces and trimming
    return clean.replace(/\s+/g, ' ').trim();
}

/**
 * Parse a scheduled task (Strict Date Only)
 * - Returns date formatted as YYYY-MM-DD
 * - Extracts title (cleaned text)
 * - Persists original text as details
 */
function parseScheduledTask(text, referenceDate = new Date()) {
    // 1. Configure chrono for strict (European) date parsing if needed
    // strictly use en-GB for DD/MM/YYYY interpretation
    const parsedResults = chrono.en.GB.parse(text, referenceDate, { forwardDate: true });
    
    if (!parsedResults || parsedResults.length === 0) {
        // Fallback: If no date found, return null date but keep text
        return {
            category: 'scheduled', // forced scheduled but no date found -> invalid? or just keep as scheduled without date? 
                                   // User said "Parse only the date", if none found, maybe it shouldn't be scheduled?
                                   // But if they used the "Scheduled" input, they expect a date.
                                   // For now we'll handle it gracefully, maybe they pick it later.
            parsed_datetime: null,
            clean_text: text.trim(), 
            original_text: text.trim()
        };
    }

    // Take the first result
    const result = parsedResults[0];
    const date = result.start.date();
    
    // Format to YYYY-MM-DD (ISO date part only)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;

    // Clean title
    const cleanTitle = removeDateText(text, result);

    return {
        category: 'scheduled',
        parsed_datetime: isoDate,
        clean_text: cleanTitle || "Untitled Event", // Fallback if entire text was a date
        original_text: text.trim()
    };
}

/**
 * Parse a chore (No parsing)
 */
function parseChore(text) {
    return {
        category: 'chore',
        parsed_datetime: null,
        clean_text: text.trim(),
        original_text: text.trim()
    };
}

/**
 * Main parser entry point
 */
function parseTask(text, type = 'chore', referenceDate = null) {
    if (type === 'scheduled') {
        return parseScheduledTask(text, referenceDate);
    } else {
        return parseChore(text);
    }
}

module.exports = {
  parseTask
};
