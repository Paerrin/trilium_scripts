// ============================================================================
// Trilium Promoted Attributes Table Script
// ============================================================================
// Version: 1.0.0
// Author: Winston (AI Architect)
// License: MIT
// Description: Generates a comprehensive table of all promoted attributes
//              in a Trilium Notes database, displayed in a dedicated note.
//
// Installation:
// 1. Create a new note in Trilium of type "JS Backend"
// 2. Copy this entire script into the note
// 3. Run the script manually or add scheduling labels:
//    - #run=hourly for hourly execution
//    - #run=daily for daily execution
//    - #run=frontendStartup for execution on Trilium startup
//
// Requirements:
// - Trilium Notes 0.50+ (0.60+ recommended)
// - Backend script execution environment
// ============================================================================

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------

const CONFIG = {
    // Output Settings
    outputNoteTitle: 'Promoted Attributes Table',
    outputNoteParent: 'root',
    outputNoteLabel: 'promotedAttributesTable',

    // Query Settings
    includeInheritedAttributes: true,
    includeArchivedNotes: false,
    excludeSystemNotes: true,
    scopeToParentNote: null,         // Set to noteId (e.g., 'abc123xyz') to limit search to that note and all its descendants
                                      // Set to null for global search across entire database
                                      // Example: 'root' to search all notes, 'yourNoteId' to limit to a subtree
    requireAttribute: 'hostName',     // Only include notes that have this attribute (null to include all notes)
    excludeAttributes: [              // Attribute names to exclude from the table (e.g., system attributes)
        'clipType',
        'pageUrl',
        'clipperSource',
        'hostName'                    // Exclude hostName from data columns since it's shown as the row label
    ],

    // Display Settings
    groupByAttribute: true,          // Legacy option - kept for backwards compatibility
    showUsageCount: true,            // Legacy option - kept for backwards compatibility
    maxValueLength: 200,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    tableFormat: 'pivoted',          // 'pivoted' (notes as rows) or 'grouped' (attributes as groups)
    maxTableHeight: 600,             // Maximum table height in pixels (null for unlimited, table will scroll vertically)
    columnOrder: [                   // Order of columns (attributes not listed will appear in any order after these)
        'ipAddress',
        'port',
        'MAC',
        'dockerHost',
        'docs',
        'OS',
        'OSversion',
        'deployedOn',
        'decommDate'
    ],

    // Performance Settings
    maxResults: 10000,
    queryTimeout: 30000,

    // Debugging
    verboseLogging: false,
    dryRun: false
};

// ----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
    if (text === null || text === undefined) {
        return '';
    }

    const str = String(text);
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

/**
 * Truncates text to maximum length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validates configuration object
 * @param {object} config - Configuration to validate
 * @returns {boolean} True if valid, throws error otherwise
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
    if (typeof config.outputNoteTitle !== 'string' || config.outputNoteTitle.length === 0) {
        throw new Error('CONFIG.outputNoteTitle must be a non-empty string');
    }

    if (typeof config.maxResults !== 'number' || config.maxResults < 1 || config.maxResults > 100000) {
        throw new Error('CONFIG.maxResults must be between 1 and 100000');
    }

    if (typeof config.maxValueLength !== 'number' || config.maxValueLength < 10) {
        throw new Error('CONFIG.maxValueLength must be at least 10');
    }

    if (typeof config.queryTimeout !== 'number' || config.queryTimeout < 1000) {
        throw new Error('CONFIG.queryTimeout must be at least 1000ms');
    }

    return true;
}

/**
 * Formats timestamp for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// ----------------------------------------------------------------------------
// API VALIDATION
// ----------------------------------------------------------------------------

/**
 * Checks if required Trilium APIs are available
 * @returns {{available: boolean, missing: string[]}} API availability status
 */
function checkApiAvailability() {
    const requiredApis = [
        'sql',
        'log',
        'getNote',
        'getNoteWithLabel',
        'createTextNote'
    ];

    const missing = [];

    for (const apiName of requiredApis) {
        if (typeof api[apiName] === 'undefined') {
            missing.push(`api.${apiName}`);
        }
    }

    // Special check for api.sql.getRows
    if (api.sql && typeof api.sql.getRows !== 'function') {
        missing.push('api.sql.getRows');
    }

    return {
        available: missing.length === 0,
        missing: missing
    };
}

// ----------------------------------------------------------------------------
// DATA DISCOVERY
// ----------------------------------------------------------------------------

/**
 * Gets all descendant note IDs for a given parent note
 * @param {string} parentNoteId - Parent note ID
 * @returns {Promise<Array<string>>} Array of descendant note IDs (including the parent)
 */
async function getDescendantNoteIds(parentNoteId) {
    if (!parentNoteId) {
        return null; // Return null to indicate "all notes"
    }

    try {
        // Use recursive CTE to get all descendants
        const query = `
            WITH RECURSIVE
            descendants(noteId) AS (
                VALUES(?)
                UNION
                SELECT branches.noteId
                FROM branches
                JOIN descendants ON branches.parentNoteId = descendants.noteId
                WHERE branches.isDeleted = 0
            )
            SELECT noteId FROM descendants
        `;

        const results = await api.sql.getRows(query, [parentNoteId]);
        const noteIds = results.map(row => row.noteId);

        if (CONFIG.verboseLogging) {
            api.log(`[Promoted Attributes] Found ${noteIds.length} descendant notes under ${parentNoteId}`);
        }

        return noteIds;
    } catch (error) {
        throw new Error(`Failed to get descendant notes: ${error.message}`);
    }
}

/**
 * Finds all promoted attribute definitions in the database
 * Promoted attributes are identified by labels with names like "label:priority"
 * @returns {Promise<Array<{name: string, type: string, baseName: string}>>}
 * @throws {Error} If database query fails
 */
async function findPromotedAttributeDefinitions() {
    const query = `
        SELECT DISTINCT name, type
        FROM attributes
        WHERE (name LIKE 'label:%' OR name LIKE 'relation:%')
          AND isDeleted = 0
        ORDER BY name
    `;

    try {
        const results = await api.sql.getRows(query);

        if (CONFIG.verboseLogging) {
            api.log(`[Promoted Attributes] Found ${results.length} attribute definitions`);
        }

        return results.map(row => ({
            name: row.name,
            type: row.type,
            baseName: row.name.replace(/^(label|relation):/, '')
        }));
    } catch (error) {
        throw new Error(`Failed to query attribute definitions: ${error.message}`);
    }
}

/**
 * Extracts base attribute names from definitions
 * @param {Array<{baseName: string}>} definitions - Attribute definitions
 * @returns {Array<string>} Base attribute names
 */
function extractAttributeNames(definitions) {
    return definitions.map(def => def.baseName);
}

// ----------------------------------------------------------------------------
// DATA COLLECTION
// ----------------------------------------------------------------------------

/**
 * Collects all instances of specified promoted attributes
 * Uses optimized single query with JOIN for best performance
 * @param {Array<string>} attributeNames - Names of attributes to query
 * @param {Array<string>|null} scopeNoteIds - Optional array of note IDs to limit scope
 * @returns {Promise<Array<{attributeName: string, attributeValue: string, attributeType: string, noteId: string, noteTitle: string}>>}
 * @throws {Error} If database query fails
 */
async function collectAttributeInstances(attributeNames, scopeNoteIds = null) {
    if (attributeNames.length === 0) {
        return [];
    }

    // Build scope filter if provided
    let scopeFilter = '';
    let params = [];
    if (scopeNoteIds && scopeNoteIds.length > 0) {
        const placeholders = scopeNoteIds.map(() => '?').join(',');
        scopeFilter = `AND n.noteId IN (${placeholders})`;
        params = [...scopeNoteIds];
    }

    // Build exclude filter if provided
    let excludeFilter = '';
    if (CONFIG.excludeAttributes && CONFIG.excludeAttributes.length > 0) {
        const excludePlaceholders = CONFIG.excludeAttributes.map(() => '?').join(',');
        excludeFilter = `AND a.name NOT IN (${excludePlaceholders})`;
        params = [...params, ...CONFIG.excludeAttributes];
    }

    // Build require attribute filter if provided
    let requireFilter = '';
    if (CONFIG.requireAttribute) {
        requireFilter = `
          AND n.noteId IN (
            SELECT noteId
            FROM attributes
            WHERE name = ?
              AND isDeleted = 0
          )
        `;
        params = [...params, CONFIG.requireAttribute];
    }

    // Optimized single query with subquery to find promoted attributes
    const query = `
        SELECT
            a.name AS attributeName,
            a.value AS attributeValue,
            a.type AS attributeType,
            n.noteId AS noteId,
            n.title AS noteTitle
        FROM attributes a
        INNER JOIN notes n ON a.noteId = n.noteId
        WHERE a.type = 'label'
          AND a.name IN (
            SELECT DISTINCT SUBSTR(name, 7)
            FROM attributes
            WHERE name LIKE 'label:%'
              AND isDeleted = 0
          )
          AND a.isDeleted = 0
          AND n.isDeleted = 0
          ${CONFIG.excludeSystemNotes ? "AND n.noteId NOT LIKE '_system%'" : ''}
          ${scopeFilter}
          ${excludeFilter}
          ${requireFilter}
        ORDER BY a.name ASC, n.title ASC
        ${CONFIG.maxResults > 0 ? `LIMIT ${CONFIG.maxResults}` : ''}
    `;

    try {
        const results = await api.sql.getRows(query, params);

        if (CONFIG.verboseLogging) {
            api.log(`[Promoted Attributes] Collected ${results.length} attribute instances`);
        }

        return results;
    } catch (error) {
        throw new Error(`Failed to collect attribute instances: ${error.message}`);
    }
}

/**
 * Filters attribute instances based on configuration
 * @param {Array} instances - Attribute instances
 * @returns {Array} Filtered instances
 */
function filterAttributesByConfig(instances) {
    let filtered = instances;

    // Additional filtering can be added here if needed
    // Currently, filtering is done in SQL for performance

    return filtered;
}

// ----------------------------------------------------------------------------
// DATA TRANSFORMATION
// ----------------------------------------------------------------------------

/**
 * Groups attribute instances by attribute name
 * @param {Array<{attributeName: string}>} instances - Attribute instances
 * @returns {Array<{attributeName: string, instances: Array, count: number}>}
 */
function groupAttributesByName(instances) {
    const groups = {};

    for (const instance of instances) {
        const name = instance.attributeName;

        if (!groups[name]) {
            groups[name] = {
                attributeName: name,
                instances: [],
                count: 0
            };
        }

        groups[name].instances.push(instance);
        groups[name].count++;
    }

    // Convert to array and sort by attribute name
    return Object.values(groups).sort((a, b) =>
        a.attributeName.localeCompare(b.attributeName)
    );
}

/**
 * Pivots data so notes are rows and attributes are columns
 * @param {Array<{attributeName: string, attributeValue: string, noteId: string, noteTitle: string}>} instances
 * @returns {{notes: Array, attributes: Array<string>}}
 */
function pivotDataByNote(instances) {
    // Build map of notes with their attributes
    const notesMap = {};
    const attributeSet = new Set();

    for (const instance of instances) {
        const noteId = instance.noteId;

        // Track all unique attributes
        attributeSet.add(instance.attributeName);

        // Initialize note entry if needed
        if (!notesMap[noteId]) {
            notesMap[noteId] = {
                noteId: noteId,
                noteTitle: instance.noteTitle || '(untitled)',
                attributes: {}
            };
        }

        // Store attribute value for this note
        notesMap[noteId].attributes[instance.attributeName] = instance.attributeValue || '';
    }

    // Convert to array and sort by note title
    const notes = Object.values(notesMap).sort((a, b) =>
        a.noteTitle.localeCompare(b.noteTitle)
    );

    // Get sorted list of attribute names according to columnOrder
    const allAttributes = Array.from(attributeSet);
    const orderedAttributes = [];
    const remainingAttributes = new Set(allAttributes);

    // First, add attributes in the specified order
    if (CONFIG.columnOrder && CONFIG.columnOrder.length > 0) {
        for (const attrName of CONFIG.columnOrder) {
            if (remainingAttributes.has(attrName)) {
                orderedAttributes.push(attrName);
                remainingAttributes.delete(attrName);
            }
        }
    }

    // Then add remaining attributes alphabetically
    const sortedRemaining = Array.from(remainingAttributes).sort();
    const attributes = [...orderedAttributes, ...sortedRemaining];

    return { notes, attributes };
}

/**
 * Calculates execution statistics and metadata
 * @param {Array} groups - Attribute groups
 * @param {number} executionTime - Execution time in milliseconds
 * @returns {{timestamp: string, executionTime: number, totalDefinitions: number, totalInstances: number, noteCount: number, errorCount: number}}
 */
function calculateStatistics(groups, executionTime) {
    const totalInstances = groups.reduce((sum, group) => sum + group.count, 0);

    // Count unique notes
    const uniqueNotes = new Set();
    for (const group of groups) {
        for (const instance of group.instances) {
            uniqueNotes.add(instance.noteId);
        }
    }

    return {
        timestamp: formatTimestamp(new Date()),
        executionTime: executionTime,
        totalDefinitions: groups.length,
        totalInstances: totalInstances,
        noteCount: uniqueNotes.size,
        errorCount: 0
    };
}

// ----------------------------------------------------------------------------
// HTML GENERATION
// ----------------------------------------------------------------------------

/**
 * Generates interactive configuration panel
 * @returns {string} HTML configuration panel
 */
function generateConfigPanel() {
    return `
    <div id="config-panel" style="background: #2d2d2d; padding: 12px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #404040;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: #61afef; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">TABLE CONFIGURATION</span>
            <button id="toggleAdvanced" style="padding: 4px 10px; background: transparent; color: #61afef; border: 1px solid #61afef; border-radius: 3px; font-size: 11px; cursor: pointer;">
                Show Advanced ▼
            </button>
        </div>

        <!-- Basic Settings (Always Visible) -->
        <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; margin-bottom: 12px;">
            <div style="flex: 1; min-width: 180px;">
                <label style="color: #61afef; font-weight: 600; font-size: 12px; display: block; margin-bottom: 4px;">
                    Required Attribute:
                </label>
                <input type="text" id="requireAttr" value="${CONFIG.requireAttribute || ''}"
                       placeholder="e.g., hostName"
                       style="width: 100%; padding: 4px 8px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 12px;">
            </div>
            <div style="flex: 0 0 120px;">
                <label style="color: #61afef; font-weight: 600; font-size: 12px; display: block; margin-bottom: 4px;">
                    Height (px):
                </label>
                <input type="number" id="tableHeight" value="${CONFIG.maxTableHeight || ''}"
                       placeholder="600" min="200" max="2000" step="50"
                       style="width: 100%; padding: 4px 8px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 12px;">
            </div>
            <div style="flex: 0 0 110px;">
                <label style="color: #61afef; font-weight: 600; font-size: 12px; display: block; margin-bottom: 4px;">
                    Theme:
                </label>
                <select id="themeToggle" style="width: 100%; padding: 4px 8px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 12px;">
                    <option value="dark" selected>Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>
            <div style="flex: 0 0 auto;">
                <button id="applyConfig" style="padding: 6px 16px; background: #61afef; color: #282c34; border: none; border-radius: 3px; font-weight: 600; font-size: 12px; cursor: pointer;">
                    Apply Changes
                </button>
            </div>
        </div>

        <!-- Advanced Settings (Collapsible) -->
        <div id="advancedSettings" style="display: none; border-top: 1px solid #404040; padding-top: 12px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">

                <!-- Output Settings -->
                <div>
                    <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #404040;">
                        <span style="color: #e5c07b; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">OUTPUT SETTINGS</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="color: #abb2bf; font-size: 11px; display: block; margin-bottom: 3px;">Output Note Title:</label>
                        <input type="text" id="outputTitle" value="${escapeHtml(CONFIG.outputNoteTitle)}"
                               style="width: 100%; padding: 3px 6px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 11px;">
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="color: #abb2bf; font-size: 11px; display: block; margin-bottom: 3px;">Parent Note ID:</label>
                        <input type="text" id="outputParent" value="${escapeHtml(CONFIG.outputNoteParent)}" placeholder="root"
                               style="width: 100%; padding: 3px 6px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 11px;">
                    </div>
                </div>

                <!-- Query Settings -->
                <div>
                    <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #404040;">
                        <span style="color: #e5c07b; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">QUERY SETTINGS</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="color: #abb2bf; font-size: 11px; display: block; margin-bottom: 3px;">Scope to Parent Note ID:</label>
                        <input type="text" id="scopeParent" value="${CONFIG.scopeToParentNote || ''}" placeholder="null for all notes"
                               style="width: 100%; padding: 3px 6px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 11px;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="color: #abb2bf; font-size: 11px; display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="includeArchived" ${CONFIG.includeArchivedNotes ? 'checked' : ''}
                                   style="margin-right: 6px; cursor: pointer;">
                            Include Archived Notes
                        </label>
                        <label style="color: #abb2bf; font-size: 11px; display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="excludeSystem" ${CONFIG.excludeSystemNotes ? 'checked' : ''}
                                   style="margin-right: 6px; cursor: pointer;">
                            Exclude System Notes
                        </label>
                    </div>
                </div>

                <!-- Display Settings -->
                <div>
                    <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #404040;">
                        <span style="color: #e5c07b; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">DISPLAY SETTINGS</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="color: #abb2bf; font-size: 11px; display: block; margin-bottom: 3px;">Max Value Length:</label>
                        <input type="number" id="maxValueLen" value="${CONFIG.maxValueLength}" min="10" max="1000"
                               style="width: 100%; padding: 3px 6px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 11px;">
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="color: #abb2bf; font-size: 11px; display: block; margin-bottom: 3px;">Max Results:</label>
                        <input type="number" id="maxResults" value="${CONFIG.maxResults}" min="10" max="100000"
                               style="width: 100%; padding: 3px 6px; background: #21252b; border: 1px solid #3e4451; color: #abb2bf; border-radius: 3px; font-size: 11px;">
                    </div>
                </div>

            </div>
            <div style="margin-top: 10px; padding: 8px; background: #3e3d32; border-radius: 3px; border: 1px solid #5c5b45;">
                <p style="margin: 0; font-size: 11px; color: #e5c07b;">
                    ⚠️ Note: Changes to advanced settings require re-running the script (Ctrl+Enter) to take effect.
                </p>
            </div>
        </div>

        <div id="config-message" style="margin-top: 8px; font-size: 11px; color: #e5c07b; display: none;"></div>
    </div>
    `;
}

/**
 * Generates table header HTML with metadata
 * @param {{timestamp: string, executionTime: number, totalDefinitions: number, totalInstances: number, noteCount: number}} metadata
 * @returns {string} HTML header
 */
function generateTableHeader(metadata) {
    const executionSeconds = (metadata.executionTime / 1000).toFixed(2);

    return `
    <div style="background: #2d2d2d; padding: 8px 12px; border-radius: 3px; margin-bottom: 10px; font-size: 12px; border: 1px solid #404040;">
        <strong style="color: #61afef;">Promoted Attributes Table</strong>
        <span style="color: #abb2bf; margin-left: 15px;">
            Updated: ${escapeHtml(metadata.timestamp)} |
            ${metadata.totalDefinitions} attributes across ${metadata.noteCount} notes |
            ${executionSeconds}s
        </span>
    </div>
    `;
}

/**
 * Generates a table row for a note with its attributes as columns
 * @param {{noteId: string, noteTitle: string, attributes: Object}} note
 * @param {Array<string>} attributeNames - Ordered list of attribute names
 * @param {number} index - Row index for alternating colors
 * @returns {string} HTML table row
 */
function generatePivotedTableRow(note, attributeNames, index) {
    const bgColor = index % 2 === 0 ? '#282c34' : '#21252b';
    const noteLink = `#root/${note.noteId}`;

    // Use hostName attribute value if it exists, otherwise fall back to note title
    const hostName = note.attributes['hostName'] || note.noteTitle;
    const displayTitle = escapeHtml(hostName);

    let html = `<tr style="background: ${bgColor};">`;

    // First column: hostName (from attribute or note title)
    html += `<td style="padding: 4px 8px; border-right: 1px solid #3e4451; font-weight: 500; white-space: nowrap;">
        <a href="${noteLink}" style="text-decoration: none; color: #61afef;">${displayTitle}</a>
    </td>`;

    // Subsequent columns: Attribute values
    for (const attrName of attributeNames) {
        const value = note.attributes[attrName] || '';
        const displayValue = value ? truncateText(escapeHtml(value), CONFIG.maxValueLength) :
                                     '<span style="color: #5c6370;">—</span>';
        html += `<td style="padding: 4px 8px; border-right: 1px solid #3e4451; font-size: 13px; color: #abb2bf;">${displayValue}</td>`;
    }

    html += '</tr>\n';
    return html;
}

/**
 * Generates empty state HTML when no attributes found
 * @returns {string} HTML empty state
 */
function generateEmptyState() {
    return `
    <div style="background: #3e3d32; padding: 20px; border-radius: 5px; text-align: center; border: 1px solid #5c5b45;">
        <h3 style="margin: 0 0 10px 0; color: #e5c07b;">🔍 No promoted attributes found</h3>
        <p style="margin: 5px 0; color: #abb2bf;">
            This means either:<br>
            • No attribute definitions exist yet<br>
            • No notes use promoted attributes
        </p>
        <p style="margin: 15px 0 5px 0; color: #abb2bf;">
            <strong>To create promoted attributes:</strong><br>
            1. Create a label definition note<br>
            2. Add #label:attributeName<br>
            3. Mark as inheritable
        </p>
    </div>
    `;
}

/**
 * Generates error state HTML
 * @param {Array<Error>} errors - Errors encountered
 * @returns {string} HTML error state
 */
function generateErrorState(errors) {
    const errorList = errors.map(err =>
        `<li>${escapeHtml(err.message)}</li>`
    ).join('');

    return `
    <div style="background: #3f2d2d; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #5c3a3a;">
        <h3 style="margin: 0 0 10px 0; color: #e06c75;">⚠️ Script execution encountered errors</h3>
        <ul style="margin: 5px 0; padding-left: 20px; color: #abb2bf;">
            ${errorList}
        </ul>
        <p style="margin: 10px 0 0 0; color: #5c6370;">
            Check Trilium log for details. Partial results shown below (may be incomplete).
        </p>
    </div>
    `;
}

/**
 * Generates JavaScript for config panel and table functionality
 * @returns {string} JavaScript code
 */
function generateSortingScript() {
    return `
    <script>
    (function() {
        const report = document.querySelector('.promoted-attributes-report');
        const table = report.querySelector('table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const headers = table.querySelectorAll('thead th');
        let currentSort = { column: -1, ascending: true };

        // Theme colors
        const themes = {
            dark: {
                bg: '#282c34',
                bgAlt: '#21252b',
                bgPanel: '#2d2d2d',
                border: '#3e4451',
                borderStrong: '#404040',
                text: '#abb2bf',
                textMuted: '#5c6370',
                link: '#61afef',
                empty: '#5c6370',
                headerBg: '#21252b'
            },
            light: {
                bg: '#ffffff',
                bgAlt: '#f5f5f5',
                bgPanel: '#e0e0e0',
                border: '#d0d0d0',
                borderStrong: '#aaa',
                text: '#222',
                textMuted: '#444',
                link: '#0066cc',
                empty: '#999',
                headerBg: '#e8e8e8'
            }
        };

        let currentTheme = 'dark';

        function sortTable(columnIndex) {
            const rows = Array.from(tbody.querySelectorAll('tr'));

            // Determine sort direction
            const ascending = currentSort.column === columnIndex ? !currentSort.ascending : true;
            currentSort = { column: columnIndex, ascending };

            // Sort rows
            rows.sort((a, b) => {
                const aCell = a.children[columnIndex];
                const bCell = b.children[columnIndex];

                // Get text content, handling links
                const aText = aCell.textContent.trim();
                const bText = bCell.textContent.trim();

                // Handle empty cells (—)
                if (aText === '—' && bText !== '—') return ascending ? 1 : -1;
                if (bText === '—' && aText !== '—') return ascending ? -1 : 1;
                if (aText === '—' && bText === '—') return 0;

                // Try numeric comparison first
                const aNum = parseFloat(aText);
                const bNum = parseFloat(bText);
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return ascending ? aNum - bNum : bNum - aNum;
                }

                // Fallback to string comparison
                return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
            });

            // Update row backgrounds and re-append
            rows.forEach((row, index) => {
                const theme = themes[currentTheme];
                row.style.background = index % 2 === 0 ? theme.bg : theme.bgAlt;
                tbody.appendChild(row);
            });

            // Update header indicators
            headers.forEach((header, index) => {
                const indicator = header.querySelector('.sort-indicator');
                if (indicator) indicator.remove();
            });

            const indicator = document.createElement('span');
            indicator.className = 'sort-indicator';
            indicator.textContent = ascending ? ' ▲' : ' ▼';
            indicator.style.color = themes[currentTheme].link;
            indicator.style.marginLeft = '4px';
            headers[columnIndex].appendChild(indicator);
        }

        // Theme switching function
        function applyTheme(themeName) {
            currentTheme = themeName;
            const theme = themes[themeName];

            // Update config panel
            const configPanel = document.getElementById('config-panel');
            if (configPanel) {
                configPanel.style.background = theme.bgPanel;
                configPanel.style.borderColor = theme.borderStrong;

                // Update config panel inputs and labels
                configPanel.querySelectorAll('label').forEach(label => {
                    label.style.color = theme.link;
                });
                configPanel.querySelectorAll('input, select').forEach(input => {
                    input.style.background = theme.bgAlt;
                    input.style.borderColor = theme.border;
                    input.style.color = theme.text;
                });
            }

            // Update table header info box
            const infoBox = report.querySelector('div[style*="padding: 8px 12px"]');
            if (infoBox) {
                infoBox.style.background = theme.bgPanel;
                infoBox.style.borderColor = theme.borderStrong;
                infoBox.querySelectorAll('strong').forEach(el => el.style.color = theme.link);
                infoBox.querySelectorAll('span').forEach(el => el.style.color = theme.text);
            }

            // Update table
            table.style.background = theme.bg;
            table.style.borderColor = theme.border;

            // Update headers
            headers.forEach(header => {
                header.style.background = theme.headerBg;
                header.style.color = theme.text;
                header.style.borderColor = theme.border;
            });

            // Update rows
            tbody.querySelectorAll('tr').forEach((row, index) => {
                row.style.background = index % 2 === 0 ? theme.bg : theme.bgAlt;
                row.querySelectorAll('td').forEach(cell => {
                    cell.style.color = theme.text;
                    cell.style.borderColor = theme.border;
                    const link = cell.querySelector('a');
                    if (link) link.style.color = theme.link;
                    const emptySpan = cell.querySelector('span[style*="color"]');
                    if (emptySpan && cell.textContent.trim() === '—') {
                        emptySpan.style.color = theme.empty;
                    }
                });
            });

            // Update footer
            const footer = report.querySelector('div[style*="margin-top: 10px"]');
            if (footer) {
                footer.style.background = theme.bgPanel;
                footer.style.borderColor = theme.borderStrong;
                footer.style.color = theme.textMuted;
                footer.querySelectorAll('strong').forEach(el => el.style.color = theme.text);
                footer.querySelectorAll('span').forEach(el => el.style.color = theme.link);
            }

            // Update table container
            const container = table.closest('div[style*="overflow"]');
            if (container) {
                container.style.background = theme.bg;
            }
        }

        // Config panel handlers
        const themeToggle = document.getElementById('themeToggle');
        const tableHeightInput = document.getElementById('tableHeight');
        const applyBtn = document.getElementById('applyConfig');
        const configMessage = document.getElementById('config-message');
        const toggleAdvancedBtn = document.getElementById('toggleAdvanced');
        const advancedSettings = document.getElementById('advancedSettings');

        // Toggle advanced settings
        if (toggleAdvancedBtn && advancedSettings) {
            toggleAdvancedBtn.addEventListener('click', () => {
                const isVisible = advancedSettings.style.display !== 'none';
                advancedSettings.style.display = isVisible ? 'none' : 'block';
                toggleAdvancedBtn.textContent = isVisible ? 'Show Advanced ▼' : 'Hide Advanced ▲';
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                let changesApplied = [];

                // Apply theme change
                if (themeToggle) {
                    const selectedTheme = themeToggle.value;
                    if (selectedTheme !== currentTheme) {
                        applyTheme(selectedTheme);
                        changesApplied.push('Theme changed to ' + selectedTheme);
                    }
                }

                // Apply table height change
                if (tableHeightInput) {
                    const newHeight = parseInt(tableHeightInput.value);
                    if (newHeight && newHeight >= 200 && newHeight <= 2000) {
                        const container = table.closest('div[style*="overflow"]');
                        if (container) {
                            container.style.maxHeight = newHeight + 'px';
                            changesApplied.push('Table height updated to ' + newHeight + 'px');
                        }
                    }
                }

                // Show confirmation message
                if (changesApplied.length > 0) {
                    configMessage.textContent = changesApplied.join(' | ');
                    configMessage.style.display = 'block';
                    setTimeout(() => {
                        configMessage.style.display = 'none';
                    }, 3000);
                } else {
                    configMessage.textContent = 'No changes to apply';
                    configMessage.style.display = 'block';
                    setTimeout(() => {
                        configMessage.style.display = 'none';
                    }, 2000);
                }
            });
        }

        // Add click handlers to headers
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.addEventListener('click', () => sortTable(index));

            // Add hover effect
            header.addEventListener('mouseenter', () => {
                const theme = themes[currentTheme];
                header.style.background = currentTheme === 'dark' ? '#2d3139' : '#ddeeff';
            });
            header.addEventListener('mouseleave', () => {
                const theme = themes[currentTheme];
                header.style.background = theme.headerBg;
            });
        });
    })();
    </script>
    `;
}

/**
 * Generates complete HTML table from pivoted data (notes as rows, attributes as columns)
 * @param {{notes: Array, attributes: Array<string>}} pivotedData
 * @param {{timestamp: string, executionTime: number, totalDefinitions: number, totalInstances: number, noteCount: number}} metadata
 * @param {Array<Error>} errors - Any errors encountered
 * @returns {string} Complete HTML content
 */
function generateHtmlTable(pivotedData, metadata, errors = []) {
    // Start HTML structure
    let html = '<div class="promoted-attributes-report" style="font-family: system-ui, -apple-system, sans-serif;">\n';

    // Add config panel
    html += generateConfigPanel();

    // Add header
    html += generateTableHeader(metadata);

    // Add errors if any
    if (errors.length > 0) {
        html += generateErrorState(errors);
    }

    // Check for empty state
    if (pivotedData.notes.length === 0) {
        html += generateEmptyState();
        html += '</div>';
        return html;
    }

    // Generate table with horizontal and vertical scrolling
    const maxHeightStyle = CONFIG.maxTableHeight ? `max-height: ${CONFIG.maxTableHeight}px;` : '';
    html += `
    <div style="overflow-x: auto; overflow-y: auto; ${maxHeightStyle}">
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #3e4451; font-size: 13px; background: #282c34;">
        <thead>
            <tr style="background: #21252b; color: #abb2bf; border-bottom: 2px solid #3e4451;">
                <th style="padding: 6px 8px; text-align: left; border-right: 1px solid #3e4451; font-weight: 600; font-size: 12px; position: sticky; top: 0; left: 0; background: #21252b; z-index: 20; white-space: nowrap;">hostName</th>
    `;

    // Add column headers for each attribute
    for (const attrName of pivotedData.attributes) {
        const displayName = escapeHtml(attrName);
        html += `<th style="padding: 6px 8px; text-align: left; border-right: 1px solid #3e4451; font-weight: 600; font-size: 12px; min-width: 100px; position: sticky; top: 0; background: #21252b; z-index: 10;">${displayName}</th>`;
    }

    html += `
            </tr>
        </thead>
        <tbody>
    `;

    // Generate table rows - one per note
    let rowIndex = 0;
    for (const note of pivotedData.notes) {
        html += generatePivotedTableRow(note, pivotedData.attributes, rowIndex++);
    }

    html += `
        </tbody>
    </table>
    </div>
    `;

    // Add footer
    html += `
    <div style="margin-top: 10px; padding: 6px 10px; background: #2d2d2d; border-radius: 3px; font-size: 11px; color: #5c6370; border: 1px solid #404040;">
        Generated by <strong style="color: #abb2bf;">Promoted Attributes Table Script v1.0</strong> |
        ${pivotedData.notes.length} notes × ${pivotedData.attributes.length} attributes |
        <span style="color: #61afef;">Click column headers to sort</span>
    </div>
    `;

    html += '</div>';

    // Add sorting script
    html += generateSortingScript();

    return html;
}

// ----------------------------------------------------------------------------
// NOTE MANAGEMENT
// ----------------------------------------------------------------------------

/**
 * Finds existing output note or creates a new one
 * @returns {Promise<BNote>} Output note
 * @throws {Error} If note creation fails
 */
async function findOrCreateOutputNote() {
    try {
        // Try to find existing note by label
        let outputNote = await api.getNoteWithLabel(CONFIG.outputNoteLabel);

        if (outputNote) {
            if (CONFIG.verboseLogging) {
                api.log(`[Promoted Attributes] Found existing output note: ${outputNote.noteId}`);
            }
            return outputNote;
        }

        // Create new note
        if (CONFIG.verboseLogging) {
            api.log('[Promoted Attributes] Creating new output note...');
        }

        const { note } = await api.createTextNote(
            CONFIG.outputNoteParent,
            CONFIG.outputNoteTitle,
            '<p>Generating promoted attributes table...</p>'
        );

        // Set identifying label
        await note.setLabel(CONFIG.outputNoteLabel, 'true');

        api.log(`[Promoted Attributes] Created output note: ${note.noteId}`);

        return note;

    } catch (error) {
        throw new Error(`Failed to find or create output note: ${error.message}`);
    }
}

/**
 * Updates note content with generated HTML
 * @param {BNote} note - Note to update
 * @param {string} htmlContent - HTML content to set
 * @returns {Promise<void>}
 * @throws {Error} If note update fails
 */
async function updateNoteContent(note, htmlContent) {
    try {
        await note.setContent(htmlContent);

        if (CONFIG.verboseLogging) {
            api.log(`[Promoted Attributes] Updated note content: ${note.noteId}`);
        }
    } catch (error) {
        throw new Error(`Failed to update note content: ${error.message}`);
    }
}

// ----------------------------------------------------------------------------
// ERROR HANDLING
// ----------------------------------------------------------------------------

/**
 * Handles and logs errors with context
 * @param {Error} error - Error that occurred
 * @param {string} context - Context where error occurred
 */
function handleError(error, context) {
    const message = `[Promoted Attributes] ERROR in ${context}: ${error.message}`;
    api.log(message);

    if (CONFIG.verboseLogging && error.stack) {
        api.log(`[Promoted Attributes] Stack trace: ${error.stack}`);
    }
}

// ----------------------------------------------------------------------------
// MAIN EXECUTION
// ----------------------------------------------------------------------------

/**
 * Main script execution function
 * Orchestrates all components to generate the promoted attributes table
 * @returns {Promise<void>}
 */
async function generatePromotedAttributesTable() {
    const startTime = Date.now();
    const errors = [];

    try {
        // Log start
        api.log('[Promoted Attributes] Starting execution...');

        // 1. Validate configuration
        try {
            validateConfig(CONFIG);
        } catch (error) {
            handleError(error, 'Configuration validation');
            throw error;
        }

        // 2. Check API availability
        const apiCheck = checkApiAvailability();
        if (!apiCheck.available) {
            const error = new Error(
                `Required Trilium APIs not available: ${apiCheck.missing.join(', ')}. ` +
                `Minimum version required: Trilium 0.50+`
            );
            handleError(error, 'API validation');
            throw error;
        }

        // 3. Check for dry run mode
        if (CONFIG.dryRun) {
            api.log('[Promoted Attributes] DRY RUN MODE - No changes will be made');
        }

        // 4. Get scope note IDs if scopeToParentNote is set
        let scopeNoteIds = null;
        if (CONFIG.scopeToParentNote) {
            try {
                scopeNoteIds = await getDescendantNoteIds(CONFIG.scopeToParentNote);
                api.log(`[Promoted Attributes] Limiting scope to ${scopeNoteIds.length} notes under ${CONFIG.scopeToParentNote}`);
            } catch (error) {
                handleError(error, 'Scope filtering');
                errors.push(error);
            }
        }

        // 5. Discover attribute definitions
        let definitions = [];
        try {
            definitions = await findPromotedAttributeDefinitions();
            api.log(`[Promoted Attributes] Found ${definitions.length} attribute definitions`);
        } catch (error) {
            handleError(error, 'Data discovery');
            errors.push(error);
        }

        if (definitions.length === 0) {
            api.log('[Promoted Attributes] No attribute definitions found - generating empty state');
        }

        // 6. Extract attribute names
        const attributeNames = extractAttributeNames(definitions);

        // 7. Collect attribute instances (with optional scope filtering)
        let instances = [];
        try {
            instances = await collectAttributeInstances(attributeNames, scopeNoteIds);
            api.log(`[Promoted Attributes] Collected ${instances.length} attribute instances`);
        } catch (error) {
            handleError(error, 'Data collection');
            errors.push(error);
        }

        // 8. Filter instances (if additional filtering needed)
        instances = filterAttributesByConfig(instances);

        // 9. Transform data - pivot so notes are rows and attributes are columns
        const pivotedData = pivotDataByNote(instances);

        // 10. Calculate statistics (using old group format for metadata calculation)
        const groups = groupAttributesByName(instances);
        const executionTime = Date.now() - startTime;
        const metadata = calculateStatistics(groups, executionTime);
        metadata.errorCount = errors.length;

        // 11. Generate HTML using pivoted format
        const htmlContent = generateHtmlTable(pivotedData, metadata, errors);

        // 12. Find or create output note
        if (CONFIG.dryRun) {
            api.log('[Promoted Attributes] DRY RUN - Would update output note');
            api.log(`[Promoted Attributes] HTML length: ${htmlContent.length} characters`);
        } else {
            const outputNote = await findOrCreateOutputNote();

            // 13. Update note content
            await updateNoteContent(outputNote, htmlContent);

            // 14. Log success
            const duration = (Date.now() - startTime) / 1000;
            api.log(
                `[Promoted Attributes] ✓ Success! Generated table with ${metadata.totalInstances} ` +
                `attribute instances from ${metadata.totalDefinitions} definitions across ` +
                `${metadata.noteCount} notes in ${duration.toFixed(2)}s`
            );
            api.log(`[Promoted Attributes] Output note ID: ${outputNote.noteId}`);

            if (errors.length > 0) {
                api.log(`[Promoted Attributes] ⚠ Completed with ${errors.length} errors (see above)`);
            }
        }

    } catch (error) {
        // Fatal error - log and re-throw
        handleError(error, 'Main execution');

        // Try to create error note even on failure
        try {
            const outputNote = await findOrCreateOutputNote();
            const errorHtml = `
                <div style="background: #ffcdd2; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #c62828;">❌ Script Execution Failed</h2>
                    <p><strong>Error:</strong> ${escapeHtml(error.message)}</p>
                    <p><strong>Time:</strong> ${formatTimestamp(new Date())}</p>
                    <p>Check Trilium log for detailed error information.</p>
                </div>
            `;
            await updateNoteContent(outputNote, errorHtml);
        } catch (noteError) {
            api.log(`[Promoted Attributes] Failed to create error note: ${noteError.message}`);
        }

        throw error;
    }
}

// ----------------------------------------------------------------------------
// SCRIPT ENTRY POINT
// ----------------------------------------------------------------------------

// Execute the script
generatePromotedAttributesTable().catch(error => {
    api.log(`[Promoted Attributes] Fatal error: ${error.message}`);
});
