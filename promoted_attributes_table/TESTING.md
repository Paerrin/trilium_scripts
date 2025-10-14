# Testing Guide for Trilium Promoted Attributes Table Script

This guide will help you test the script thoroughly before using it in production.

---

## Pre-Testing Checklist

Before you begin testing, ensure:

- [ ] Trilium Notes is installed (version 0.50+ recommended)
- [ ] You have a backup of your Trilium database (just in case)
- [ ] You understand what promoted attributes are
- [ ] You have at least one promoted attribute in your database (or are ready to create one)

---

## Test Environment Setup

### Step 1: Create Test Promoted Attributes

If you don't have any promoted attributes yet, create some test data:

1. **Create an attribute definition note:**
   - Create a new note titled "Attribute Definitions"
   - Add these labels to the note:
     ```
     #label:priority
     #label:status
     #label:project
     ```
   - Mark the note with `#archived` to hide it from regular views

2. **Create test notes with attributes:**
   - Create a note titled "Test Note 1"
     - Add label: `#priority=high`
     - Add label: `#status=active`
   - Create a note titled "Test Note 2"
     - Add label: `#priority=medium`
     - Add label: `#project=Website Redesign`
   - Create a note titled "Test Note 3"
     - Add label: `#status=completed`
     - Add label: `#priority=low`

Now you have 3 promoted attributes (priority, status, project) with 6 total instances across 3 notes.

---

## Test Plan

### Test 1: Basic Installation and Execution

**Objective:** Verify the script installs and runs without errors

**Steps:**
1. Create a new note in Trilium
2. Change note type to "JS Backend" (important!)
3. Copy the contents of `promoted-attributes-table.js`
4. Paste into the note
5. Press `Ctrl+Enter` (or click Run if available)
6. Open Trilium console: `F12` → Console tab

**Expected Results:**
- ✅ Console shows: `[Promoted Attributes] Starting execution...`
- ✅ Console shows: `[Promoted Attributes] Found X attribute definitions`
- ✅ Console shows: `[Promoted Attributes] ✓ Success! Generated table...`
- ✅ A new note appears in your tree: "Promoted Attributes Table"
- ✅ No red error messages in console

**Troubleshooting:**
- If nothing happens: Check note type is "JS Backend"
- If "API not available": Update Trilium to 0.50+
- If "syntax error": Ensure entire script was copied correctly

---

### Test 2: Output Note Verification

**Objective:** Verify the output note is created correctly

**Steps:**
1. Find the "Promoted Attributes Table" note in your tree
2. Open it
3. Inspect the content

**Expected Results:**
- ✅ Note displays a formatted HTML table
- ✅ Header shows timestamp and statistics
- ✅ Table has three columns: Attribute, Value, Note
- ✅ Attributes are grouped by name (if you have multiple instances)
- ✅ Usage counts shown next to attribute names
- ✅ Note titles are clickable links

**Visual Check:**
```
Should look like:
┌──────────────────────────────────────────────┐
│ Promoted Attributes Table                    │
│ Last updated: [timestamp]                    │
│ [Statistics]                                 │
└──────────────────────────────────────────────┘

Attribute | Value    | Note
----------|----------|----------
priority (3 uses)
priority  | high     | [Test Note 1]
priority  | medium   | [Test Note 2]
priority  | low      | [Test Note 3]
```

---

### Test 3: Note Links Functionality

**Objective:** Verify clicking note links navigates correctly

**Steps:**
1. Open the "Promoted Attributes Table" note
2. Click on one of the note titles in the table
3. Observe what happens

**Expected Results:**
- ✅ Trilium navigates to the clicked note
- ✅ The note opens and displays correctly
- ✅ All links work (test at least 3 different links)

**Troubleshooting:**
- If links don't work: Ensure you're viewing in Trilium (not exported HTML)
- If wrong note opens: Check the note hasn't been deleted/moved

---

### Test 4: Re-execution (Update Existing Note)

**Objective:** Verify script updates existing note instead of creating duplicates

**Steps:**
1. Note the current content of "Promoted Attributes Table"
2. Go back to the script note
3. Run the script again (`Ctrl+Enter`)
4. Check the output note again

**Expected Results:**
- ✅ Output note is updated (check timestamp changed)
- ✅ No duplicate "Promoted Attributes Table" notes created
- ✅ Content reflects current database state
- ✅ Console shows: `Found existing output note`

---

### Test 5: Configuration Changes

**Objective:** Verify configuration options work correctly

**Test 5a: Disable Grouping**

1. Edit script: Set `groupByAttribute: false`
2. Run script
3. Check output

**Expected:** No group headers, just rows

**Test 5b: Change Max Value Length**

1. Create a note with a very long attribute value:
   - Add `#status=This is a very long status value that should be truncated when displayed in the table to prevent it from making the table too wide`
2. Edit script: Set `maxValueLength: 30`
3. Run script
4. Check output

**Expected:** Long value truncated to ~30 chars with "..."

**Test 5c: Enable Verbose Logging**

1. Edit script: Set `verboseLogging: true`
2. Run script
3. Check console

**Expected:** More detailed log messages showing each step

---

### Test 6: Empty State Handling

**Objective:** Verify script handles databases with no promoted attributes

**Steps:**
1. Temporarily remove all your promoted attributes (or create fresh Trilium database)
2. Run the script
3. Check output note

**Expected Results:**
- ✅ Script runs without errors
- ✅ Output note shows "No promoted attributes found" message
- ✅ Helpful instructions on how to create promoted attributes
- ✅ No error in console

---

### Test 7: Error Handling

**Objective:** Verify script handles errors gracefully

**Test 7a: Invalid Configuration**

1. Edit script: Set `maxResults: -1` (invalid)
2. Run script
3. Check console

**Expected:** Error message about invalid configuration

**Test 7b: Database Locked (Advanced)**

This is hard to test directly, but you can verify error handling structure exists:
1. Review the code for try-catch blocks
2. Check error logging functions are present

---

### Test 8: Performance Testing

**Objective:** Measure execution time with your database

**Steps:**
1. Note your database size (check Trilium settings or SQL: `SELECT COUNT(*) FROM notes`)
2. Run the script
3. Check the execution time in the output note header

**Expected Results:**

| Database Size | Expected Time |
|---------------|---------------|
| < 1,000 notes | < 2 seconds |
| 1,000-5,000 notes | < 5 seconds |
| 5,000-10,000 notes | < 5 seconds |
| > 10,000 notes | < 10 seconds |

**If slower than expected:**
- Check `maxResults` setting
- Enable `excludeSystemNotes`
- Consider database maintenance (vacuum, reindex)

---

### Test 9: Special Characters Handling

**Objective:** Verify HTML escaping and special character handling

**Steps:**
1. Create a note with special characters in title: `<Test> Note & "Special" 'Chars'`
2. Add attribute: `#priority=high`
3. Create another note with attribute value containing HTML: `#status=<script>alert('xss')</script>`
4. Run the script
5. Check output note

**Expected Results:**
- ✅ Special characters in note titles are escaped (display correctly)
- ✅ HTML in attribute values is escaped (not executed)
- ✅ No JavaScript execution or HTML injection
- ✅ Table displays all characters correctly

---

### Test 10: Dry Run Mode

**Objective:** Verify dry run mode works correctly

**Steps:**
1. Edit script: Set `dryRun: true`
2. Delete the existing "Promoted Attributes Table" note
3. Run the script
4. Check your note tree

**Expected Results:**
- ✅ Console shows: `DRY RUN MODE - No changes will be made`
- ✅ Console shows: `Would update output note`
- ✅ Console shows HTML length
- ✅ NO output note is created
- ✅ Script completes successfully

---

## Test Results Template

Use this template to document your test results:

```
## Test Results

**Date:** YYYY-MM-DD
**Trilium Version:** X.XX.X
**Database Size:** XXX notes
**Test Environment:** Desktop / Server, Windows / macOS / Linux

### Test 1: Basic Installation ✅ / ❌
Notes:

### Test 2: Output Verification ✅ / ❌
Notes:

### Test 3: Note Links ✅ / ❌
Notes:

### Test 4: Re-execution ✅ / ❌
Notes:

### Test 5: Configuration ✅ / ❌
Notes:

### Test 6: Empty State ✅ / ❌
Notes:

### Test 7: Error Handling ✅ / ❌
Notes:

### Test 8: Performance ✅ / ❌
Execution Time: X.XX seconds
Notes:

### Test 9: Special Characters ✅ / ❌
Notes:

### Test 10: Dry Run ✅ / ❌
Notes:

### Overall Result: PASS / FAIL

### Issues Found:
1.
2.
3.

### Recommendations:
1.
2.
```

---

## Post-Testing Actions

### If All Tests Pass ✅

1. **Enable scheduling** (if desired):
   - Add `#run=hourly` or `#run=daily` to script note

2. **Customize configuration** for your needs:
   - Adjust `maxValueLength`
   - Set preferred `outputNoteParent`
   - Configure filtering options

3. **Share feedback**:
   - Document what works well
   - Note any suggestions for improvement

### If Tests Fail ❌

1. **Document the failure**:
   - Which test failed?
   - What was the error message?
   - What were you doing when it failed?

2. **Check common issues**:
   - Trilium version (must be 0.50+)
   - Note type (must be "JS Backend")
   - Script completely copied (no truncation)

3. **Gather diagnostic info**:
   - Trilium version: Help → About
   - Console errors: F12 → Console
   - Script configuration: Check CONFIG object

4. **Report the issue**:
   - Include test results
   - Include error messages
   - Include Trilium version
   - Include database size

---

## Advanced Testing

### Load Testing (Optional)

Test with a large number of attributes:

1. Create a script to generate test data:
```javascript
// Create 1000 test notes with attributes
for (let i = 0; i < 1000; i++) {
    const {note} = await api.createTextNote('root', `Test Note ${i}`, 'Test content');
    await note.setLabel('testPriority', i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low');
    await note.setLabel('testStatus', i % 2 === 0 ? 'active' : 'completed');
}
```

2. Run the promoted attributes script
3. Measure performance
4. Clean up test notes when done

---

## Troubleshooting Guide

### Problem: Script doesn't run at all

**Symptoms:** Nothing happens, no console messages

**Solutions:**
1. Check note type is "JS Backend" (not "JS Frontend" or "Code")
2. Try F5 to refresh Trilium
3. Check browser console (F12) for JavaScript errors
4. Try creating a simple test script: `api.log('test');`

### Problem: "api.sql is not available"

**Symptoms:** Error about missing API

**Solutions:**
1. Update Trilium to 0.50 or later
2. Check you're running as backend script (not frontend)
3. Verify Trilium installation is complete

### Problem: Table looks broken/unstyled

**Symptoms:** Plain text instead of formatted table

**Solutions:**
1. Check note type of output note (should be "text")
2. View in Trilium (not exported HTML)
3. Check for JavaScript errors in console

### Problem: Performance is slow

**Symptoms:** Execution takes > 10 seconds

**Solutions:**
1. Reduce `maxResults` in CONFIG
2. Enable `excludeSystemNotes: true`
3. Check database size (how many notes total?)
4. Consider archiving old notes

### Problem: Attributes missing from table

**Symptoms:** Some attributes don't appear

**Solutions:**
1. Verify attributes are actually "promoted" (have definitions)
2. Check `excludeSystemNotes` setting
3. Check `maxResults` limit isn't too low
4. Verify notes aren't deleted or archived (if excluded)

---

## Success Criteria

The script is ready for production use when:

- ✅ All 10 tests pass
- ✅ Performance is acceptable for your database
- ✅ Output format meets your needs
- ✅ No errors in normal operation
- ✅ Configuration options work as expected

---

**Good luck with testing!** Report any issues you find so we can improve the script. 🧪✨
