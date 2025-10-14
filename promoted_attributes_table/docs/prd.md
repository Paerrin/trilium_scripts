# Product Requirements Document
# Trilium Promoted Attributes Table Script

**Version:** 1.0
**Date:** 2025-10-13
**Status:** Draft
**Product Manager:** [TBD]
**Stakeholders:** Trilium power users, script maintainers

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-13 | PM | Initial PRD draft |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas](#user-personas)
4. [User Stories](#user-stories)
5. [Functional Requirements](#functional-requirements)
6. [Technical Requirements](#technical-requirements)
7. [User Interface Requirements](#user-interface-requirements)
8. [Performance Requirements](#performance-requirements)
9. [Security and Privacy](#security-and-privacy)
10. [Success Metrics](#success-metrics)
11. [Release Criteria](#release-criteria)
12. [Future Enhancements](#future-enhancements)
13. [Dependencies and Risks](#dependencies-and-risks)
14. [Appendix](#appendix)

---

## Executive Summary

### Product Vision

Create a lightweight, efficient Trilium script that generates a comprehensive table of all promoted attributes across a user's note database, displayed in a dedicated note for easy reference and attribute management.

### Problem Statement

Trilium Notes users who extensively use promoted attributes for organization lack a centralized view of their attribute taxonomy. Users must manually navigate individual notes to discover what attributes exist, leading to:
- Wasted time searching for attribute names
- Inconsistent attribute naming conventions
- Difficulty onboarding new users to shared databases
- Poor visibility into metadata schema as databases grow

### Solution Overview

A JavaScript backend script that:
1. Queries the Trilium database for all promoted attribute definitions
2. Collects all attribute instances across notes
3. Generates a formatted HTML table with attribute names, values, and source notes
4. Creates/updates a dedicated note displaying the results
5. Can be executed manually or on a schedule

### Success Criteria

- ✅ Script executes in < 5 seconds for databases with 10,000 notes
- ✅ 100% accuracy in capturing promoted attributes
- ✅ < 1% error rate during execution
- ✅ Readable, well-formatted table output
- ✅ Clear documentation for installation and usage

---

## Product Overview

### Product Description

**Trilium Promoted Attributes Table Script** is a single-file JavaScript backend script that integrates seamlessly into Trilium Notes. It provides power users with instant visibility into their promoted attributes taxonomy by generating an always-up-to-date table view.

### Key Features (MVP)

1. **Promoted Attribute Discovery**
   - Identifies all promoted attributes by querying attribute definitions
   - Distinguishes promoted attributes from regular labels

2. **Comprehensive Data Collection**
   - Collects all instances of promoted attributes across the database
   - Captures attribute name, value, and source note information
   - Filters out deleted/archived notes (configurable)

3. **HTML Table Generation**
   - Creates well-formatted HTML table with sortable columns
   - Includes clickable note links for easy navigation
   - Groups by attribute name for clarity
   - Shows attribute value and associated note title

4. **Dedicated Output Note**
   - Creates/updates a dedicated note for displaying results
   - Preserves note location and structure between runs
   - Includes timestamp of last generation
   - Optionally includes summary statistics

5. **Execution Modes**
   - Manual execution via script button
   - Scheduled execution (hourly, daily)
   - Frontend startup execution (optional)

6. **Error Handling**
   - Graceful handling of database query failures
   - Clear error messages logged to Trilium console
   - Validation of API availability
   - Recovery from partial failures

### Out of Scope (MVP)

- ❌ Attribute editing from table view
- ❌ Filtering/searching within the table
- ❌ Attribute usage statistics and charts
- ❌ Export to external formats (CSV, JSON)
- ❌ Historical change tracking
- ❌ Attribute renaming/merging tools
- ❌ Interactive frontend widget
- ❌ Custom styling options

### Target Release

**MVP Target:** 2-4 weeks from PRD approval

---

## User Personas

### Primary Persona: Alex - The Organized Power User

**Demographics:**
- Age: 30-50
- Occupation: Knowledge worker, developer, researcher, or project manager
- Technical skill: Comfortable with Trilium scripting and configuration

**Trilium Usage:**
- 500-5,000 notes in database
- Uses 10-30 different promoted attributes
- Creates 5-20 new notes weekly
- Maintains strict organizational structure

**Goals:**
- Maintain consistent attribute taxonomy across all notes
- Quickly reference available attributes when creating notes
- Ensure team members use correct attribute names in shared databases
- Audit attribute usage periodically

**Pain Points:**
- Can't remember all attribute names in use
- Discovers duplicate/similar attributes (e.g., "priority" vs "prio")
- Time-consuming to manually check attribute usage
- No way to see attribute coverage across note tree

**Motivations:**
- Values organization and systematic approaches
- Wants to maximize Trilium's metadata capabilities
- Enjoys optimizing workflows
- Shares knowledge base with team

**How This Product Helps:**
- One-click access to complete attribute taxonomy
- Visual confirmation of attribute consistency
- Quick reference when creating new notes
- Foundation for attribute cleanup/consolidation

### Secondary Persona: Jordan - The Trilium Administrator

**Demographics:**
- Age: 25-45
- Occupation: IT administrator, system architect, or team lead
- Technical skill: Advanced Trilium user, comfortable with APIs

**Trilium Usage:**
- Manages shared Trilium instance for team (5-50 users)
- Oversees 10,000+ notes across team databases
- Defines attribute standards and best practices
- Troubleshoots user issues

**Goals:**
- Enforce attribute naming conventions
- Monitor attribute usage across team
- Document available attributes for new users
- Identify and cleanup redundant attributes

**Pain Points:**
- No visibility into how team uses attributes
- Difficult to enforce standards without visibility
- Can't identify attribute proliferation until it's a problem
- Manual attribute auditing is impractical at scale

**Motivations:**
- Maintain clean, organized shared knowledge base
- Enable team productivity through good information architecture
- Prevent technical debt in metadata layer
- Provide self-service documentation for users

**How This Product Helps:**
- Regular automated reports of attribute usage
- Scheduled generation for continuous monitoring
- Foundation for building attribute governance tools
- Documentation artifact for onboarding

---

## User Stories

### Epic 1: Attribute Discovery and Viewing

#### US-1.1: View All Promoted Attributes
**As a** Trilium power user
**I want to** see all promoted attributes in my database in one place
**So that** I can quickly reference available attributes when creating notes

**Acceptance Criteria:**
- ✅ Script identifies all attribute definitions (labels starting with `label:`)
- ✅ Script queries all instances of identified promoted attributes
- ✅ Output includes attribute name, value, and source note
- ✅ Table displays in a dedicated note titled "Promoted Attributes Table"
- ✅ Results are ordered alphabetically by attribute name, then by note title

**Priority:** P0 (Must Have)
**Story Points:** 5

#### US-1.2: Navigate to Source Notes
**As a** user viewing the attributes table
**I want to** click on note titles to navigate to source notes
**So that** I can quickly access notes using specific attributes

**Acceptance Criteria:**
- ✅ Note titles in table are rendered as Trilium note links
- ✅ Clicking a note link navigates to that note
- ✅ Links work correctly even if note title contains special characters
- ✅ Deleted notes are excluded or marked as [deleted]

**Priority:** P0 (Must Have)
**Story Points:** 2

#### US-1.3: See Attribute Grouping
**As a** user viewing the attributes table
**I want to** see attributes grouped by name
**So that** I can easily see all uses of a specific attribute

**Acceptance Criteria:**
- ✅ Table groups rows by attribute name
- ✅ Visual separation between different attribute groups (e.g., background color, borders)
- ✅ Attribute names are clearly labeled
- ✅ Count of uses shown for each attribute (e.g., "priority (15 uses)")

**Priority:** P1 (Should Have)
**Story Points:** 3

### Epic 2: Script Execution and Management

#### US-2.1: Execute Script Manually
**As a** Trilium user
**I want to** manually execute the script when needed
**So that** I can generate an updated attributes table on demand

**Acceptance Criteria:**
- ✅ Script can be executed by opening the script note and running it
- ✅ Execution completes within 5 seconds for databases < 10,000 notes
- ✅ Success message appears in Trilium log after execution
- ✅ Output note is created/updated upon successful execution
- ✅ Previous output is overwritten (not duplicated)

**Priority:** P0 (Must Have)
**Story Points:** 3

#### US-2.2: Schedule Automatic Execution
**As a** Trilium administrator
**I want to** schedule the script to run automatically
**So that** the attributes table stays up-to-date without manual intervention

**Acceptance Criteria:**
- ✅ Script supports `#run=hourly` label for hourly execution
- ✅ Script supports `#run=daily` label for daily execution
- ✅ Script supports `#run=frontendStartup` for execution on Trilium startup
- ✅ Scheduled execution logs timestamp and result to Trilium log
- ✅ Execution failures don't crash Trilium

**Priority:** P1 (Should Have)
**Story Points:** 2

#### US-2.3: See Execution Metadata
**As a** user viewing the attributes table
**I want to** see when the table was last generated
**So that** I know if the data is current

**Acceptance Criteria:**
- ✅ Output note includes "Last updated: [timestamp]" at top
- ✅ Timestamp uses human-readable format (e.g., "2025-10-13 14:30:15")
- ✅ Timestamp reflects actual generation time, not note modification time
- ✅ Summary statistics shown (e.g., "15 promoted attributes across 234 notes")

**Priority:** P1 (Should Have)
**Story Points:** 1

### Epic 3: Error Handling and Reliability

#### US-3.1: Handle Database Query Failures
**As a** Trilium user
**I want to** see clear error messages if the script fails
**So that** I can troubleshoot or report issues

**Acceptance Criteria:**
- ✅ SQL query failures are caught and logged
- ✅ Error messages include specific failure reason (e.g., "Database locked", "Permission denied")
- ✅ Partial failures allow script to continue (e.g., skip inaccessible notes)
- ✅ Error count is displayed in output note if any errors occurred
- ✅ Script doesn't crash Trilium on failure

**Priority:** P0 (Must Have)
**Story Points:** 3

#### US-3.2: Validate API Availability
**As a** Trilium user
**I want to** be notified if the script is incompatible with my Trilium version
**So that** I don't waste time troubleshooting version issues

**Acceptance Criteria:**
- ✅ Script checks for required API methods on startup
- ✅ Clear error message if `api.sql` is unavailable
- ✅ Clear error message if required note/attribute methods are missing
- ✅ Minimum Trilium version documented in script comments
- ✅ Version check completes in < 100ms

**Priority:** P1 (Should Have)
**Story Points:** 2

### Epic 4: Documentation and Installation

#### US-4.1: Install Script Easily
**As a** new user
**I want to** install the script with minimal steps
**So that** I can start using it quickly

**Acceptance Criteria:**
- ✅ Installation instructions in README.md
- ✅ Single .js file can be imported directly into Trilium
- ✅ No external dependencies required
- ✅ Works immediately after import without configuration
- ✅ Installation takes < 5 minutes for new users

**Priority:** P0 (Must Have)
**Story Points:** 2

#### US-4.2: Understand Script Usage
**As a** user
**I want to** clear documentation on how to use the script
**So that** I can leverage all features effectively

**Acceptance Criteria:**
- ✅ README includes overview of what the script does
- ✅ Documentation covers manual execution steps
- ✅ Documentation covers scheduling options
- ✅ Examples of output table format shown
- ✅ Troubleshooting section for common issues
- ✅ FAQ section answers common questions

**Priority:** P0 (Must Have)
**Story Points:** 3

---

## Functional Requirements

### FR-1: Promoted Attribute Detection

**Requirement ID:** FR-1
**Priority:** P0 (Must Have)

**Description:**
The script must correctly identify all promoted attributes in the Trilium database by querying for attribute definitions.

**Details:**
- Query database for all labels with names matching pattern `label:*`
- Query database for all relations with names matching pattern `relation:*`
- Extract base attribute names by removing `label:` or `relation:` prefix
- Store list of promoted attribute names for subsequent queries
- Handle edge cases: empty results, malformed definitions, special characters in names

**Inputs:**
- Trilium database via `api.sql`

**Outputs:**
- Array of promoted attribute names (strings)

**Validation:**
- Verify at least one definition found (warn if zero)
- Validate all names are non-empty strings
- Log count of definitions discovered

**Test Cases:**
- TC-FR-1.1: Detect single label definition
- TC-FR-1.2: Detect multiple label definitions
- TC-FR-1.3: Detect relation definitions
- TC-FR-1.4: Handle database with no definitions (graceful failure)
- TC-FR-1.5: Handle definitions with special characters (#, @, spaces)

---

### FR-2: Attribute Data Collection

**Requirement ID:** FR-2
**Priority:** P0 (Must Have)

**Description:**
The script must collect all instances of promoted attributes across the database, including attribute values and source note information.

**Details:**
- For each promoted attribute name, query all matching attributes
- Join with notes table to get note title and metadata
- Filter out deleted notes (`isDeleted = 0`)
- Filter out system notes (configurable)
- Collect: attribute name, attribute value, note ID, note title
- Handle inherited attributes (include or exclude based on config)
- Sort results by attribute name, then note title

**Inputs:**
- Array of promoted attribute names (from FR-1)
- Trilium database via `api.sql`

**Outputs:**
- Array of attribute data objects: `{name, value, type, noteId, noteTitle}`

**Validation:**
- Verify data types of returned fields
- Handle null/empty values gracefully
- Ensure note titles are properly escaped
- Log total count of attributes collected

**Configuration Options:**
- `includeInheritedAttributes`: boolean (default: true)
- `includeArchivedNotes`: boolean (default: false)
- `excludeSystemNotes`: boolean (default: true)

**Test Cases:**
- TC-FR-2.1: Collect attributes from single note
- TC-FR-2.2: Collect attributes from multiple notes
- TC-FR-2.3: Handle notes with multiple attributes
- TC-FR-2.4: Exclude deleted notes
- TC-FR-2.5: Handle empty attribute values
- TC-FR-2.6: Handle notes with special characters in title
- TC-FR-2.7: Handle very long attribute values (>1000 chars)

---

### FR-3: HTML Table Generation

**Requirement ID:** FR-3
**Priority:** P0 (Must Have)

**Description:**
The script must generate a well-formatted HTML table from collected attribute data, suitable for display in a Trilium note.

**Details:**
- Create HTML table with columns: Attribute Name, Value, Note
- Group rows by attribute name with visual separation
- Render note titles as Trilium note links using format: `<a href="#root/noteId">Title</a>`
- Escape HTML special characters in values and titles
- Add table styling: borders, alternating row colors, header styling
- Include header with metadata: timestamp, count statistics
- Handle empty results (display "No promoted attributes found" message)
- Support very wide tables (responsive design or scroll)

**Inputs:**
- Array of attribute data objects (from FR-2)
- Metadata: execution timestamp, error count

**Outputs:**
- HTML string ready for insertion into Trilium note

**HTML Structure:**
```html
<div class="promoted-attributes-table">
  <h3>Promoted Attributes Table</h3>
  <p>Last updated: [timestamp]</p>
  <p>Summary: [X] promoted attributes found across [Y] notes</p>

  <table>
    <thead>
      <tr><th>Attribute</th><th>Value</th><th>Note</th></tr>
    </thead>
    <tbody>
      <!-- Grouped by attribute name -->
      <tr class="attr-group-header"><td colspan="3"><strong>priority</strong> (5 uses)</td></tr>
      <tr><td>priority</td><td>high</td><td><a href="#root/...">Project X Tasks</a></td></tr>
      ...
    </tbody>
  </table>
</div>
```

**Styling Requirements:**
- Use Trilium's default note styling (no external CSS)
- Table borders: 1px solid #ccc
- Header background: light gray (#f5f5f5)
- Alternating row colors for readability
- Hover effect on rows
- Responsive design for wide tables

**Test Cases:**
- TC-FR-3.1: Generate table with single attribute
- TC-FR-3.2: Generate table with multiple attributes and notes
- TC-FR-3.3: Handle empty results (no attributes)
- TC-FR-3.4: Escape HTML in attribute values (e.g., `<script>`)
- TC-FR-3.5: Escape HTML in note titles
- TC-FR-3.6: Generate correct note links
- TC-FR-3.7: Display proper timestamp format
- TC-FR-3.8: Handle very long attribute values (truncate or wrap)

---

### FR-4: Output Note Management

**Requirement ID:** FR-4
**Priority:** P0 (Must Have)

**Description:**
The script must create or update a dedicated output note to display the generated table.

**Details:**
- Check if output note already exists (identified by label `#promotedAttributesTable`)
- If not exists: create new note with appropriate title and location
- If exists: update content of existing note
- Set note type to "text" (HTML content)
- Add identifying label to output note for future detection
- Log note ID of output note for debugging
- Preserve note's position in tree between runs
- Update note's dateModified timestamp

**Inputs:**
- HTML table content (from FR-3)

**Outputs:**
- Created or updated Trilium note

**Configuration Options:**
- `outputNoteTitle`: string (default: "Promoted Attributes Table")
- `outputNoteParent`: string (default: "root" or first level)
- `outputNoteLabel`: string (default: "promotedAttributesTable")

**Note Creation Behavior:**
- **On first run:** Create note under root (or configured parent)
- **On subsequent runs:** Update existing note in place
- **If multiple output notes exist:** Log warning and update first found

**Test Cases:**
- TC-FR-4.1: Create output note on first run
- TC-FR-4.2: Update existing output note on subsequent runs
- TC-FR-4.3: Preserve note location in tree
- TC-FR-4.4: Handle missing parent note (create under root)
- TC-FR-4.5: Handle permission errors (read-only note)
- TC-FR-4.6: Verify note label is set correctly

---

### FR-5: Error Handling and Logging

**Requirement ID:** FR-5
**Priority:** P0 (Must Have)

**Description:**
The script must gracefully handle errors and provide clear logging for debugging and monitoring.

**Details:**
- Wrap all major operations in try-catch blocks
- Log execution start/end to Trilium console
- Log count of attributes discovered and processed
- Log any errors with context (operation being performed)
- Display errors in output note if generation fails
- Continue processing when possible (skip individual failures)
- Provide actionable error messages (not just stack traces)
- Include error count in summary statistics

**Error Scenarios to Handle:**
1. Database query failures (locked, permissions)
2. API method not available (version incompatibility)
3. Invalid attribute data (malformed, null values)
4. Note creation/update failures (permissions, space)
5. Unexpected data types or structure

**Logging Levels:**
- **INFO:** Execution start, success, summary statistics
- **WARN:** Partial failures, skipped items, version warnings
- **ERROR:** Fatal errors, complete failures

**Error Message Format:**
```
[Promoted Attributes Script] ERROR: {operation} failed - {reason}
Details: {context}
Suggestion: {remediation}
```

**Test Cases:**
- TC-FR-5.1: Log successful execution
- TC-FR-5.2: Handle SQL query failure gracefully
- TC-FR-5.3: Display clear error in output note on failure
- TC-FR-5.4: Continue after skipping malformed attribute
- TC-FR-5.5: Log warning for missing API method
- TC-FR-5.6: Include error count in summary

---

### FR-6: Configuration and Customization

**Requirement ID:** FR-6
**Priority:** P1 (Should Have)

**Description:**
The script should support basic configuration options to customize behavior without code modification.

**Details:**
- Configuration defined in script header as constant object
- Support for all configurable options listed in FR-2 and FR-4
- Configuration validated on script startup
- Invalid configuration values trigger warnings (fall back to defaults)
- Configuration documented in comments

**Configuration Object:**
```javascript
const CONFIG = {
  // Output settings
  outputNoteTitle: "Promoted Attributes Table",
  outputNoteParent: "root",
  outputNoteLabel: "promotedAttributesTable",

  // Query settings
  includeInheritedAttributes: true,
  includeArchivedNotes: false,
  excludeSystemNotes: true,

  // Display settings
  groupByAttribute: true,
  showUsageCount: true,
  maxValueLength: 200, // truncate long values

  // Performance settings
  maxResults: 10000, // safety limit
  queryTimeout: 30000 // 30 seconds
};
```

**Validation Rules:**
- All boolean options: must be true/false
- String options: non-empty strings
- Numeric options: positive integers within reasonable ranges

**Test Cases:**
- TC-FR-6.1: Load default configuration
- TC-FR-6.2: Override configuration values
- TC-FR-6.3: Validate configuration on startup
- TC-FR-6.4: Handle invalid configuration (fall back to defaults)
- TC-FR-6.5: Apply configuration to query behavior
- TC-FR-6.6: Apply configuration to output format

---

## Technical Requirements

### TR-1: Technology Stack

**Requirement ID:** TR-1
**Priority:** P0 (Must Have)

**Technology Specifications:**
- **Language:** JavaScript (ECMAScript 2020+)
- **Runtime:** Trilium Backend Script environment (Node.js-based)
- **Database:** Trilium SQLite database via `api.sql`
- **APIs Used:**
  - `api.sql.getRows()` - Database queries
  - `api.createTextNote()` or `api.createNote()` - Note creation
  - `api.getNote()` - Note retrieval
  - `api.getNoteWithLabel()` - Find output note
  - `note.setContent()` - Update note content
  - `note.setLabel()` - Set identifying label
  - `api.log()` - Logging

**Dependencies:**
- No external npm packages
- No external libraries
- Trilium version 0.50+ (or specify minimum based on API requirements)

**Browser/Platform Compatibility:**
- Must work on Trilium Desktop (Windows, macOS, Linux)
- Must work on Trilium Server
- No browser-specific APIs (backend script only)

---

### TR-2: Database Schema Requirements

**Requirement ID:** TR-2
**Priority:** P0 (Must Have)

**Database Tables Used:**

**`attributes` table:**
```sql
-- Expected columns:
- attributeId: TEXT PRIMARY KEY
- noteId: TEXT
- type: TEXT ('label' or 'relation')
- name: TEXT
- value: TEXT
- isInheritable: INTEGER (0 or 1)
- position: INTEGER
- isDeleted: INTEGER (0 or 1)
- utcDateModified: TEXT
```

**`notes` table:**
```sql
-- Expected columns:
- noteId: TEXT PRIMARY KEY
- title: TEXT
- type: TEXT
- isDeleted: INTEGER (0 or 1)
- dateCreated: TEXT
- dateModified: TEXT
```

**SQL Query Requirements:**
- Support for `SELECT` with `JOIN`
- Support for `WHERE` with `IN` subqueries
- Support for `LIKE` pattern matching
- Support for parameterized queries (SQL injection prevention)
- Support for `ORDER BY`

**Performance Considerations:**
- Queries must use indexes where available
- Avoid full table scans when possible
- Use parameterized queries (not string concatenation)
- Limit result sets if necessary

---

### TR-3: Performance Requirements

**Requirement ID:** TR-3
**Priority:** P0 (Must Have)

**Execution Time Targets:**

| Database Size | Target Time | Maximum Time |
|---------------|-------------|--------------|
| < 1,000 notes | < 1 second | 2 seconds |
| 1,000 - 5,000 notes | < 2 seconds | 5 seconds |
| 5,000 - 10,000 notes | < 3 seconds | 5 seconds |
| 10,000+ notes | < 5 seconds | 10 seconds |

**Memory Requirements:**
- Peak memory usage: < 100 MB for databases with 10,000 notes
- No memory leaks (memory released after execution)
- Efficient data structures (avoid duplicating large datasets)

**Scalability:**
- Must handle databases with 50,000+ notes (graceful degradation)
- Must handle 100+ distinct promoted attributes
- Must handle attributes with 10,000+ characters in value
- Must handle notes with 50+ attributes each

**Optimization Techniques:**
- Use SQL JOINs instead of multiple queries where possible
- Process results in streaming fashion (avoid loading entire dataset at once)
- Limit HTML generation to reasonable result sets
- Implement query timeout (default: 30 seconds)

**Performance Monitoring:**
- Log execution time in console
- Display execution time in output note header
- Warn if execution exceeds 5 seconds
- Error if execution exceeds 30 seconds (timeout)

---

### TR-4: Code Quality and Maintainability

**Requirement ID:** TR-4
**Priority:** P0 (Must Have)

**Code Standards:**
- Follow JavaScript ES6+ best practices
- Use meaningful variable and function names
- Include JSDoc comments for all functions
- Group related functionality into separate functions
- Maximum function length: 50 lines
- Maximum file length: 500 lines

**Code Structure:**
```javascript
// Configuration
const CONFIG = { ... };

// Main execution function
async function generatePromotedAttributesTable() { ... }

// Helper functions
function findPromotedAttributeDefinitions() { ... }
function collectAttributeData(attributeNames) { ... }
function generateHtmlTable(attributeData) { ... }
function createOrUpdateOutputNote(htmlContent) { ... }
function logError(message, error) { ... }

// Execute
generatePromotedAttributesTable();
```

**Error Handling Pattern:**
```javascript
try {
  // Operation
} catch (error) {
  api.log(`ERROR: Operation failed - ${error.message}`);
  // Handle or rethrow
}
```

**Commenting Requirements:**
- File header: Purpose, version, author, license
- Function comments: Purpose, parameters, return value, throws
- Inline comments for complex logic
- Configuration options explained in comments

**Testing Considerations:**
- Code should be testable (pure functions where possible)
- Separate business logic from API calls
- Mock-friendly function signatures

---

### TR-5: Security and Safety

**Requirement ID:** TR-5
**Priority:** P0 (Must Have)

**Security Requirements:**

1. **SQL Injection Prevention:**
   - Use parameterized queries (NOT string concatenation)
   - Example: `api.sql.getRows(query, [param1, param2])`
   - Never construct SQL from user input

2. **XSS Prevention in Output:**
   - Escape all HTML special characters in attribute values
   - Escape all HTML special characters in note titles
   - Use proper HTML encoding: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`, `"` → `&quot;`, `'` → `&#39;`

3. **Read-Only Operation:**
   - Script should NOT modify source notes
   - Script should NOT delete notes or attributes
   - Script should ONLY create/update the output note
   - No write operations to database except via Trilium API

4. **Permission Handling:**
   - Check for API availability before use
   - Handle permission errors gracefully
   - Don't expose sensitive data in error messages

5. **Resource Limits:**
   - Implement query timeout to prevent infinite execution
   - Limit result set size (configurable max: 10,000 results)
   - Don't load entire database into memory

**Safety Mechanisms:**
- Dry-run mode (log what would happen without executing)
- Backup reminder in documentation
- Clear warnings about beta status

**Data Privacy:**
- No external network calls
- No data transmission outside Trilium
- No logging of sensitive attribute values
- No telemetry or analytics

---

## User Interface Requirements

### UI-1: Output Note Appearance

**Requirement ID:** UI-1
**Priority:** P0 (Must Have)

**Visual Design:**

**Header Section:**
```
┌─────────────────────────────────────────────┐
│  Promoted Attributes Table                  │
│  Last updated: 2025-10-13 14:30:15          │
│  15 promoted attributes across 234 notes    │
└─────────────────────────────────────────────┘
```

**Table Design:**
```
┌─────────────┬──────────────┬───────────────────┐
│ Attribute   │ Value        │ Note              │
├─────────────┼──────────────┼───────────────────┤
│ priority (5 uses)                             │
├─────────────┼──────────────┼───────────────────┤
│ priority    │ high         │ [Project X Tasks] │
│ priority    │ high         │ [Sprint Planning] │
│ priority    │ medium       │ [Documentation]   │
│ priority    │ low          │ [Future Ideas]    │
│ priority    │ low          │ [Backlog Items]   │
├─────────────┼──────────────┼───────────────────┤
│ status (8 uses)                               │
├─────────────┼──────────────┼───────────────────┤
│ status      │ active       │ [Current Work]    │
│ status      │ completed    │ [Finished Tasks]  │
...
└─────────────┴──────────────┴───────────────────┘
```

**Color Scheme:**
- Header background: Light blue (#e3f2fd)
- Group headers: Light gray (#f5f5f5)
- Table borders: Medium gray (#ccc)
- Alternating rows: White and very light gray (#fafafa)
- Hover effect: Light yellow (#fff9c4)
- Links: Trilium default link color (blue)

**Typography:**
- Header: Bold, 18px
- Metadata: Regular, 12px, gray
- Table headers: Bold, 14px
- Table content: Regular, 13px
- Group headers: Bold, 13px

**Responsive Design:**
- Table scrolls horizontally if too wide
- Minimum column widths maintained
- Works on small screens (1024px width minimum)

---

### UI-2: Empty State

**Requirement ID:** UI-2
**Priority:** P1 (Should Have)

**When No Attributes Found:**
```
┌─────────────────────────────────────────────┐
│  Promoted Attributes Table                  │
│  Last updated: 2025-10-13 14:30:15          │
│                                             │
│  🔍 No promoted attributes found            │
│                                             │
│  This means either:                         │
│  • No attribute definitions exist yet      │
│  • No notes use promoted attributes        │
│                                             │
│  To create promoted attributes:            │
│  1. Create a label definition note          │
│  2. Add #label:attributeName                │
│  3. Mark as inheritable                     │
│                                             │
│  Learn more: [Promoted Attributes Docs]     │
└─────────────────────────────────────────────┘
```

**Tone:** Helpful, educational, not alarming

---

### UI-3: Error State

**Requirement ID:** UI-3
**Priority:** P0 (Must Have)

**When Execution Fails:**
```
┌─────────────────────────────────────────────┐
│  Promoted Attributes Table                  │
│  Last updated: 2025-10-13 14:30:15          │
│                                             │
│  ⚠️ Script execution encountered errors     │
│                                             │
│  Errors:                                    │
│  • Database query failed: [reason]          │
│  • 3 notes were skipped due to errors       │
│                                             │
│  Partial results shown below (may be        │
│  incomplete).                               │
│                                             │
│  Check Trilium log for details.             │
└─────────────────────────────────────────────┘

[Partial table if any data collected]
```

**Error Display Principles:**
- Show errors prominently but not alarmingly
- Provide actionable next steps
- Display partial results if available
- Link to troubleshooting docs

---

## Performance Requirements

*(Detailed requirements covered in TR-3, summarized here for quick reference)*

### Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Execution time (< 1K notes) | 1s | 2s |
| Execution time (< 10K notes) | 3s | 5s |
| Memory usage | 50 MB | 100 MB |
| Output note size | < 1 MB | < 5 MB |
| Startup time | < 100ms | 500ms |

### Performance Testing Scenarios

1. **Small Database Test:**
   - 500 notes, 5 promoted attributes, 50 attribute instances
   - Expected: < 1 second

2. **Medium Database Test:**
   - 5,000 notes, 20 promoted attributes, 500 attribute instances
   - Expected: < 2 seconds

3. **Large Database Test:**
   - 10,000 notes, 50 promoted attributes, 2,000 attribute instances
   - Expected: < 5 seconds

4. **Stress Test:**
   - 50,000 notes, 100 promoted attributes, 10,000 attribute instances
   - Expected: Complete without crash, warn if > 10 seconds

---

## Security and Privacy

### Security Posture

**Threat Model:**
- **Low Risk:** Single-user or trusted team environment
- **No Network:** Script operates entirely within Trilium (no external calls)
- **Limited Scope:** Read-only queries + single note write

**Security Measures:**

1. **Input Validation:**
   - Validate all configuration values
   - Sanitize all user-provided data (attribute values, note titles)
   - Use parameterized SQL queries

2. **Output Sanitization:**
   - HTML-escape all dynamic content
   - Prevent XSS through proper encoding
   - Validate note IDs before generating links

3. **Access Control:**
   - Respect Trilium's permission model
   - Don't bypass encryption or protection
   - Handle permission errors gracefully

4. **Data Protection:**
   - No external data transmission
   - No logging of sensitive values
   - No persistent storage outside Trilium

### Privacy Considerations

**Data Handled:**
- Attribute names (metadata)
- Attribute values (potentially sensitive)
- Note titles (potentially sensitive)
- Note IDs (non-sensitive)

**Privacy Principles:**
- Treat all attribute values as potentially sensitive
- Don't log attribute values in console (only counts/names)
- Respect Trilium's protection flags
- No analytics or telemetry

**Compliance:**
- GDPR: No personal data leaves Trilium instance
- No data retention beyond output note
- User has full control over generated output

---

## Success Metrics

### Launch Metrics (First 30 Days)

| Metric | Target | Method |
|--------|--------|--------|
| Installation rate | 50 installs | GitHub downloads, community feedback |
| Successful executions | 90% success rate | Error logs analysis |
| Average execution time | < 3 seconds | Performance logging |
| User satisfaction | 4/5 stars | User surveys, feedback |

### Usage Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Daily active users | 20+ users | (Self-reported, no telemetry) |
| Executions per user | 3-5 per week | Expected behavior |
| Script failures | < 1% error rate | Error analysis |

### Quality Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Attribute accuracy | 100% | Automated tests |
| Code coverage | > 80% | Unit tests (future) |
| Documentation completeness | 100% | Review checklist |
| Bug reports | < 5 critical bugs | Issue tracker |

### Business Impact Metrics

| Metric | Target | Impact |
|--------|--------|--------|
| Time saved per user | 5-10 min/week | User surveys |
| Attribute consistency improvement | 50% reduction in duplicates | User reports |
| User confidence in attributes | 4/5 satisfaction | Feedback |

---

## Release Criteria

### MVP Release Requirements

**Code Completeness:**
- ✅ All P0 functional requirements implemented
- ✅ All P0 technical requirements met
- ✅ All P0 user stories completed with acceptance criteria met
- ✅ Error handling covers all critical paths
- ✅ Configuration system working

**Testing:**
- ✅ Manual testing on 3 different Trilium databases (small, medium, large)
- ✅ Edge case testing (empty DB, no attributes, special characters)
- ✅ Performance testing meets targets for databases < 10,000 notes
- ✅ Cross-platform testing (Windows, macOS, Linux)
- ✅ No critical bugs (P0 severity)

**Documentation:**
- ✅ README.md complete with installation and usage instructions
- ✅ Code comments and JSDoc complete
- ✅ Troubleshooting guide included
- ✅ FAQ section covers common questions
- ✅ Example output shown in documentation

**Performance:**
- ✅ Execution time < 5 seconds for 10,000 note database
- ✅ Memory usage < 100 MB
- ✅ No crashes or hangs during testing

**Security:**
- ✅ SQL injection testing passed
- ✅ XSS prevention verified
- ✅ No unintended data modification

**User Acceptance:**
- ✅ Beta testing with 5-10 users
- ✅ Positive feedback from at least 3 beta testers
- ✅ All critical user feedback addressed

### Release Checklist

**Pre-Release:**
- [ ] Code review completed
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Version number set (1.0.0)
- [ ] Changelog updated
- [ ] Known issues documented

**Release:**
- [ ] Tag release in version control
- [ ] Publish to GitHub (or distribution method)
- [ ] Update README with latest info
- [ ] Announce in Trilium community
- [ ] Monitor for immediate issues

**Post-Release:**
- [ ] Monitor error reports (first 48 hours)
- [ ] Respond to user questions
- [ ] Document common issues in FAQ
- [ ] Plan next iteration based on feedback

---

## Future Enhancements

### Phase 2: Enhanced Viewing (Post-MVP)

**Priority:** P2
**Estimated Effort:** 2-3 weeks

**Features:**
1. **Filtering and Search:**
   - Search box to filter table by attribute name or value
   - Filter by attribute type (label vs relation)
   - Show/hide specific attributes

2. **Sorting Options:**
   - Sort by attribute name, value, or note title
   - Ascending/descending sort
   - Remember sort preferences

3. **Statistics and Analytics:**
   - Count of notes using each attribute
   - Histogram of attribute value distribution
   - Most/least used attributes
   - Unused attribute definitions

4. **Visual Improvements:**
   - Collapsible attribute groups
   - Color coding by attribute type
   - Icons for attribute types
   - Export table to CSV/JSON

**User Stories:**
- US-P2-1: Filter table by attribute name
- US-P2-2: Sort table by any column
- US-P2-3: View attribute usage statistics
- US-P2-4: Collapse/expand attribute groups
- US-P2-5: Export table to CSV

---

### Phase 3: Interactive Management (Future)

**Priority:** P3
**Estimated Effort:** 4-6 weeks

**Features:**
1. **Inline Editing:**
   - Edit attribute values directly in table
   - Delete attributes from table view
   - Add new attributes to notes

2. **Bulk Operations:**
   - Rename attributes across multiple notes
   - Merge duplicate attributes
   - Delete unused attribute definitions
   - Batch update attribute values

3. **Attribute Definition Management:**
   - View attribute definition properties
   - Edit attribute definitions
   - Create new attribute definitions
   - See definition inheritance tree

4. **Advanced Features:**
   - Attribute relationship mapping
   - Visualization of attribute usage across note tree
   - Attribute templates and presets
   - Automated attribute cleanup suggestions

**User Stories:**
- US-P3-1: Edit attribute value in table
- US-P3-2: Rename attribute across all notes
- US-P3-3: Merge duplicate attributes
- US-P3-4: View attribute definition details
- US-P3-5: See visual map of attribute relationships

---

### Phase 4: Widget and Integration (Long-term)

**Priority:** P4
**Estimated Effort:** 6-8 weeks

**Features:**
1. **Frontend Widget:**
   - Convert to interactive frontend widget
   - Real-time updates as attributes change
   - Embeddable in sidebar
   - Keyboard shortcuts

2. **API Extensions:**
   - Provide reusable attribute query API
   - Helper functions for other scripts
   - Event hooks for attribute changes

3. **Integration:**
   - Link to attribute definition notes
   - Integration with search functionality
   - Highlight notes in tree with specific attributes
   - Attribute-based note dashboards

**User Stories:**
- US-P4-1: View attributes in sidebar widget
- US-P4-2: See real-time attribute updates
- US-P4-3: Use attribute API in custom scripts
- US-P4-4: Navigate to attribute definitions from table

---

## Dependencies and Risks

### Dependencies

**External Dependencies:**

| Dependency | Type | Risk Level | Mitigation |
|------------|------|------------|------------|
| Trilium Notes API | Critical | Medium | Version compatibility checks, fallback methods |
| Trilium SQL access | Critical | Low | Well-established API, unlikely to change |
| SQLite database | Critical | Low | Standard Trilium database, stable schema |
| JavaScript runtime | Critical | Low | Built into Trilium, no external runtime needed |

**Internal Dependencies:**

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Project Brief | Document | Mary (Analyst) | ✅ Complete |
| Research Findings | Document | Mary (Analyst) | ✅ Complete |
| Development Environment | Infrastructure | Developer | Pending |

---

### Risks and Mitigation

**Technical Risks:**

**Risk 1: API Compatibility**
- **Description:** Trilium API changes in future versions break script
- **Probability:** Medium
- **Impact:** High
- **Mitigation:**
  - Document minimum Trilium version
  - Version detection on startup
  - Graceful degradation for missing APIs
  - Active monitoring of Trilium releases
- **Contingency:** Provide legacy versions for older Trilium releases

**Risk 2: Performance at Scale**
- **Description:** Script too slow for very large databases (50,000+ notes)
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Performance testing with large databases
  - Query optimization
  - Result pagination option
  - Configurable limits
- **Contingency:** Add "lite mode" with sampling instead of full query

**Risk 3: SQL Schema Changes**
- **Description:** Trilium changes database schema, breaking SQL queries
- **Probability:** Low
- **Impact:** High
- **Mitigation:**
  - Use high-level API methods where possible
  - Document schema assumptions
  - Schema version detection
  - Test with Trilium beta releases
- **Contingency:** Quick update and patch release

---

**Adoption Risks:**

**Risk 4: Low User Adoption**
- **Description:** Users don't discover or use the script
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Clear documentation and examples
  - Promotion in Trilium community
  - Video tutorial or demo
  - Easy installation process
- **Contingency:** Gather feedback, iterate on UX

**Risk 5: Complex Installation**
- **Description:** Users struggle to install or configure script
- **Probability:** Low
- **Impact:** Medium
- **Mitigation:**
  - One-file installation (no dependencies)
  - Step-by-step installation guide
  - Video walkthrough
  - Default configuration works out-of-box
- **Contingency:** Create installation helper script

---

**Maintenance Risks:**

**Risk 6: Maintenance Burden**
- **Description:** Script requires frequent updates and support
- **Probability:** Low
- **Impact:** Low
- **Mitigation:**
  - Clean, maintainable code
  - Comprehensive documentation
  - Active community support
  - Automated testing (future)
- **Contingency:** Open source for community contributions

**Risk 7: Feature Creep**
- **Description:** Scope expands beyond MVP, delaying release
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Strict MVP scope adherence
  - Defer enhancements to Phase 2
  - Regular scope reviews
  - Clear priority labels (P0, P1, P2)
- **Contingency:** Cut P1 features if timeline at risk

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Promoted Attribute** | An attribute (label or relation) that appears in the main note UI, defined by an attribute definition |
| **Attribute Definition** | A special label (e.g., `#label:priority`) that defines how an attribute should behave |
| **Label** | A key-value pair attribute on a note (e.g., `#priority=high`) |
| **Relation** | A named relationship between two notes (e.g., `~authoredBy=NoteId`) |
| **Backend Script** | JavaScript code that runs on the Trilium server/backend |
| **Frontend Script** | JavaScript code that runs in the browser UI |
| **Becca** | Trilium's in-memory object graph for notes and attributes |
| **Note Tree** | Hierarchical structure of notes in Trilium |

---

### B. API Reference Summary

**Key Trilium API Methods Used:**

```javascript
// Database queries
api.sql.getRows(query, params)

// Note operations
api.getNote(noteId)
api.getNoteWithLabel(labelName, labelValue)
api.createTextNote(parentNoteId, title, content)
api.createNote(options)

// Note methods
note.setContent(content)
note.setLabel(name, value)
note.getOwnedAttributes()
note.getLabelValue(name)

// Logging
api.log(message)
```

**SQL Schema (Relevant Tables):**

```sql
-- Attributes table
SELECT attributeId, noteId, type, name, value, isDeleted
FROM attributes
WHERE name LIKE 'label:%' OR name = 'specificAttribute'

-- Notes table
SELECT noteId, title, type, isDeleted
FROM notes
WHERE noteId = '...'

-- Join for full data
SELECT a.name, a.value, n.noteId, n.title
FROM attributes a
JOIN notes n ON a.noteId = n.noteId
WHERE a.type = 'label' AND a.isDeleted = 0 AND n.isDeleted = 0
```

---

### C. Configuration Reference

**Default Configuration:**

```javascript
const CONFIG = {
  // Output settings
  outputNoteTitle: "Promoted Attributes Table",
  outputNoteParent: "root",
  outputNoteLabel: "promotedAttributesTable",

  // Query settings
  includeInheritedAttributes: true,
  includeArchivedNotes: false,
  excludeSystemNotes: true,
  maxResults: 10000,
  queryTimeout: 30000, // ms

  // Display settings
  groupByAttribute: true,
  showUsageCount: true,
  maxValueLength: 200,
  timestampFormat: "YYYY-MM-DD HH:mm:ss",

  // Debugging
  verboseLogging: false,
  dryRun: false
};
```

**Configuration Instructions:**
1. Open script note in Trilium
2. Edit CONFIG object at top of script
3. Save and re-run script
4. Changes take effect immediately

---

### D. SQL Query Templates

**Query 1: Find Promoted Attribute Definitions**
```sql
SELECT DISTINCT name, value
FROM attributes
WHERE (name LIKE 'label:%' OR name LIKE 'relation:%')
  AND isDeleted = 0
ORDER BY name
```

**Query 2: Collect Attribute Data**
```sql
SELECT
  a.name AS attributeName,
  a.value AS attributeValue,
  a.type AS attributeType,
  n.noteId AS noteId,
  n.title AS noteTitle
FROM attributes a
JOIN notes n ON a.noteId = n.noteId
WHERE a.name = ?
  AND a.isDeleted = 0
  AND n.isDeleted = 0
ORDER BY n.title
```

**Query 3: Complete Query (All Promoted Attributes)**
```sql
SELECT
  a.name AS attributeName,
  a.value AS attributeValue,
  a.type AS attributeType,
  n.noteId AS noteId,
  n.title AS noteTitle
FROM attributes a
JOIN notes n ON a.noteId = n.noteId
WHERE a.type = 'label'
  AND a.name IN (
    SELECT DISTINCT SUBSTR(name, 7)
    FROM attributes
    WHERE name LIKE 'label:%' AND isDeleted = 0
  )
  AND a.isDeleted = 0
  AND n.isDeleted = 0
ORDER BY a.name, n.title
```

---

### E. Testing Scenarios

**Test Database Profiles:**

**Profile 1: Minimal**
- 10 notes
- 2 promoted attributes (priority, status)
- 5 attribute instances
- Purpose: Basic functionality testing

**Profile 2: Small**
- 500 notes
- 10 promoted attributes
- 50 attribute instances
- Purpose: Typical personal use case

**Profile 3: Medium**
- 5,000 notes
- 30 promoted attributes
- 500 attribute instances
- Purpose: Power user scenario

**Profile 4: Large**
- 10,000 notes
- 50 promoted attributes
- 2,000 attribute instances
- Purpose: Performance target validation

**Profile 5: Stress**
- 50,000 notes
- 100 promoted attributes
- 10,000 attribute instances
- Purpose: Scalability and stability testing

---

### F. HTML Output Template

**Complete HTML Structure:**

```html
<div class="promoted-attributes-report" style="font-family: system-ui, -apple-system, sans-serif;">

  <!-- Header -->
  <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 10px 0; color: #1976d2;">Promoted Attributes Table</h2>
    <p style="margin: 5px 0; color: #666; font-size: 13px;">
      <strong>Last updated:</strong> 2025-10-13 14:30:15<br>
      <strong>Summary:</strong> 15 promoted attributes found across 234 notes<br>
      <strong>Execution time:</strong> 2.34 seconds
    </p>
  </div>

  <!-- Table -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
    <thead>
      <tr style="background: #f5f5f5; border-bottom: 2px solid #ccc;">
        <th style="padding: 10px; text-align: left; border-right: 1px solid #ccc;">Attribute</th>
        <th style="padding: 10px; text-align: left; border-right: 1px solid #ccc;">Value</th>
        <th style="padding: 10px; text-align: left;">Note</th>
      </tr>
    </thead>
    <tbody>
      <!-- Group: priority -->
      <tr style="background: #f9f9f9; font-weight: bold;">
        <td colspan="3" style="padding: 8px; border-bottom: 1px solid #ccc;">
          priority <span style="color: #666; font-weight: normal;">(5 uses)</span>
        </td>
      </tr>
      <tr style="background: #fff;">
        <td style="padding: 8px; border-right: 1px solid #eee;">priority</td>
        <td style="padding: 8px; border-right: 1px solid #eee;">high</td>
        <td style="padding: 8px;"><a href="#root/xyz123">Project X Tasks</a></td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 8px; border-right: 1px solid #eee;">priority</td>
        <td style="padding: 8px; border-right: 1px solid #eee;">medium</td>
        <td style="padding: 8px;"><a href="#root/abc456">Sprint Planning</a></td>
      </tr>
      <!-- More rows... -->
    </tbody>
  </table>

  <!-- Footer -->
  <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 12px; color: #666;">
    <p style="margin: 5px 0;">
      Generated by <strong>Promoted Attributes Table Script v1.0</strong><br>
      <a href="#root/script-note-id">View script configuration</a>
    </p>
  </div>

</div>
```

---

### G. Error Messages Reference

**Error Code Reference:**

| Code | Message | Cause | Resolution |
|------|---------|-------|------------|
| E001 | Database query failed | SQL error, locked DB | Check DB integrity, try again |
| E002 | API method not available | Wrong Trilium version | Update Trilium or use older script |
| E003 | Permission denied | Read-only mode, encrypted note | Check note permissions |
| E004 | Note creation failed | Storage full, permission issue | Check disk space, permissions |
| E005 | Timeout exceeded | Query too slow | Reduce database size or increase timeout |
| E006 | Invalid configuration | Bad config value | Fix CONFIG object values |
| E007 | No output note found | Output note deleted | Script will create new note |
| E008 | Malformed attribute data | Database corruption | Check DB integrity |

---

### H. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | TBD | Initial MVP release | [Developer] |
| 0.9.0 | TBD | Beta release for testing | [Developer] |
| 0.5.0 | TBD | Alpha release (internal) | [Developer] |
| 0.1.0 | TBD | Proof of concept | [Developer] |

---

### I. References

**Internal Documents:**
- Project Brief: `docs/brief.md`
- Research Findings: `docs/research-findings.md`
- Project Overview: `docs/project_overview.md`

**External References:**
- Trilium Notes: https://github.com/zadam/trilium
- Trilium API Documentation: https://triliumnext.github.io/Docs/
- Trilium Wiki - Attributes: https://github.com/zadam/trilium/wiki/Attributes
- Trilium Wiki - Promoted Attributes: https://github.com/zadam/trilium/wiki/Promoted-Attributes

**Technical References:**
- Trilium Backend Script API: `reference/api_md/Backend_Script_API.Api.md`
- BNote Class: `reference/api_md/Backend_Script_API.BNote.md`
- BAttribute Class: `reference/api_md/Backend_Script_API.BAttribute.md`

---

## Approval and Sign-off

**Document Status:** Draft for Review

**Reviewers:**

| Role | Name | Status | Date | Signature |
|------|------|--------|------|-----------|
| Product Manager | [TBD] | Pending | - | - |
| Tech Lead | [TBD] | Pending | - | - |
| Business Analyst | Mary | Approved | 2025-10-13 | ✅ |
| Stakeholder | [TBD] | Pending | - | - |

**Approval Criteria:**
- ✅ All requirements clearly defined and measurable
- ✅ Technical feasibility confirmed (Research phase complete)
- ✅ Success metrics defined
- ✅ Risks identified and mitigation planned
- ✅ MVP scope reasonable for timeline
- ✅ Documentation sufficient for development

**Next Steps After Approval:**
1. Development kickoff meeting
2. Set up development environment
3. Create technical architecture document
4. Begin MVP implementation
5. Set up testing infrastructure

---

**Document End**

---

**PRD Version:** 1.0
**Last Updated:** 2025-10-13
**Total Pages:** [Generated Document Length]
**Word Count:** ~8,500 words
**Review Cycle:** 1 week
**Expiration:** PRD remains valid until major scope change or v2.0
