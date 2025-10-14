# Quick Test Checklist

**5-Minute Quick Test** - Follow these steps to verify the script works:

## Prerequisites
- [ ] Trilium Notes is running
- [ ] You have Trilium version 0.50+ (check Help → About)

## Step-by-Step Testing

### 1. Create Test Data (2 minutes)

**Create an attribute definition note:**
1. Create a new note titled "My Attribute Definitions"
2. Add these labels to it:
   - `#label:priority`
   - `#label:status`
3. (Optional: Add `#archived` to hide from regular views)

**Create test notes with attributes:**
1. Create note "Task A" with labels:
   - `#priority=high`
   - `#status=active`

2. Create note "Task B" with labels:
   - `#priority=medium`
   - `#status=pending`

3. Create note "Task C" with labels:
   - `#priority=low`
   - `#status=completed`

### 2. Install Script (1 minute)

1. Create a new note titled "Promoted Attributes Script"
2. **IMPORTANT:** Change note type to **"JS Backend"** (click the note type dropdown)
3. Open the file `promoted-attributes-table.js` on your computer
4. Copy ALL the contents (Ctrl+A, Ctrl+C)
5. Paste into the Trilium note (Ctrl+V)
6. Save (Ctrl+S)

### 3. Run Script (1 minute)

1. With the script note open, press **`Ctrl+Enter`** (Windows/Linux) or **`Cmd+Enter`** (macOS)
2. Open the browser console: Press **`F12`**, click **"Console"** tab
3. Look for messages starting with `[Promoted Attributes]`

**Expected Console Output:**
```
[Promoted Attributes] Starting execution...
[Promoted Attributes] Found 2 attribute definitions
[Promoted Attributes] Collected 6 attribute instances
[Promoted Attributes] ✓ Success! Generated table with 6 attribute instances from 2 definitions across 3 notes in 0.45s
[Promoted Attributes] Output note ID: [some-id]
```

### 4. View Results (1 minute)

1. Look for a new note in your tree: **"Promoted Attributes Table"**
2. Open it
3. You should see a formatted table with:
   - Header showing timestamp and statistics
   - Two attribute groups: "priority" and "status"
   - Six total rows (3 notes × 2 attributes each)
   - Clickable note titles

### 5. Test Links (30 seconds)

1. Click on one of the note titles (e.g., "Task A")
2. Verify Trilium navigates to that note
3. Go back and click another note title
4. Verify it works too

### 6. Test Re-run (30 seconds)

1. Go back to the script note
2. Press `Ctrl+Enter` again
3. Go to the "Promoted Attributes Table" note
4. Verify the timestamp updated
5. Verify you still only have ONE output note (no duplicates)

---

## ✅ Success Criteria

If you see all of these, the script works perfectly:

- [x] Console shows success message
- [x] Output note "Promoted Attributes Table" exists
- [x] Table shows your test attributes
- [x] Note links work when clicked
- [x] Re-running updates (doesn't duplicate)
- [x] No error messages in console

---

## ❌ Troubleshooting

### Nothing happens when I press Ctrl+Enter

**Solution:** Check note type is "JS Backend" (not "JS Frontend" or "Code")

### Error: "api.sql is not available"

**Solution:** Update Trilium to version 0.50 or later

### Error: "Cannot read property 'getRows' of undefined"

**Solution:** Make sure note type is "JS Backend"

### Script runs but says "No promoted attributes found"

**Solutions:**
1. Make sure you created the attribute definition note with `#label:priority` and `#label:status`
2. Make sure your test notes have the matching attributes `#priority=...` and `#status=...`
3. Try creating the definition and attributes again

### Table looks like plain text (not formatted)

**Solution:** Make sure you're viewing the output note inside Trilium (not as exported HTML)

---

## 🎉 What's Next?

If the quick test passed:

1. **Try with your real data:** The script will find all your existing promoted attributes
2. **Configure it:** Edit the `CONFIG` object in the script to customize behavior
3. **Schedule it:** Add `#run=hourly` or `#run=daily` to the script note for automatic updates
4. **Read the full docs:** Check out `README.md` for all features and options

If the test failed:
1. See `TESTING.md` for detailed troubleshooting
2. Check the console (F12) for error messages
3. Verify Trilium version is 0.50+
4. Make sure the script was completely copied

---

## Example of What You Should See

**In the console (F12):**
```
[Promoted Attributes] Starting execution...
[Promoted Attributes] Found 2 attribute definitions
[Promoted Attributes] Collected 6 attribute instances
[Promoted Attributes] ✓ Success! Generated table with 6 attribute instances
from 2 definitions across 3 notes in 0.45s
[Promoted Attributes] Output note ID: abc123xyz
```

**In the output note:**
```
┌──────────────────────────────────────────────┐
│ Promoted Attributes Table                    │
│ Last updated: 2025-10-13 15:45:30            │
│ 2 promoted attributes across 3 notes         │
│ Total instances: 6                           │
│ Execution time: 0.45 seconds                 │
└──────────────────────────────────────────────┘

╔═══════════╦═══════════╦═══════════════════╗
║ Attribute ║ Value     ║ Note              ║
╠═══════════╬═══════════╬═══════════════════╣
║ priority (3 uses)                          ║
╠═══════════╬═══════════╬═══════════════════╣
║ priority  ║ high      ║ Task A            ║
║ priority  ║ medium    ║ Task B            ║
║ priority  ║ low       ║ Task C            ║
╠═══════════╬═══════════╬═══════════════════╣
║ status (3 uses)                            ║
╠═══════════╬═══════════╬═══════════════════╣
║ status    ║ active    ║ Task A            ║
║ status    ║ pending   ║ Task B            ║
║ status    ║ completed ║ Task C            ║
╚═══════════╩═══════════╩═══════════════════╝
```

*(Note: Actual table will be HTML-formatted with colors and clickable links)*

---

**Total Time:** ~5 minutes
**Difficulty:** Easy
**Prerequisites:** Trilium 0.50+

Good luck! 🚀
