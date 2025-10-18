// ============================================================================
// Trilium Wikilink Processor Script
// ============================================================================
// Version: 1.0.0
// Author: Winston (AI Architect)
// License: MIT
// Description: Processes markdown-style [[wikilinks]] in Trilium notes and
//              converts them to native Trilium internal links (~noteId).
//              Builds on Trilium's existing backlink system.
//
// Features:
// - Parses [[wikilinks]] in note content
// - Resolves links to existing notes by title search
// - Creates new notes for orphaned links
// - Converts to native Trilium ~noteId format
// - Maintains existing backlink functionality
// - Batch processing capabilities
//
// Installation:
// 1. Create a new note in Trilium of type "JS Backend"
// 2. Copy this entire script into the note
// 3. Run the script manually or add scheduling labels:
//    - #run=hourly for hourly execution
//    - #run=daily for daily execution
//    - #run=onNoteCreation for automatic processing
// ============================================================================

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------

const WIKILINK_CONFIG = {
    // Processing Settings
    enabled: true,
    processOnCreation: true,
    processOnUpdate: true,

    // Scope Settings
    scopeToParentNote: null,         // Set to noteId to limit processing to subtree
    excludeSystemNotes: true,
    excludeNoteIds: [],              // Specific note IDs to exclude

    // Link Resolution Settings
    fuzzySearch: true,               // Enable fuzzy title matching
    caseSensitive: false,            // Case sensitivity in title matching
    minMatchScore: 0.6,              // Minimum similarity score for fuzzy matching (0.0-1.0)
    maxSearchResults: 5,             // Maximum results to consider for ambiguous matches

    // Note Creation Settings
    autoCreateOrphanedLinks: true,   // Create new notes for unmatched links
    defaultParentForNewNotes: 'root', // Parent note for newly created notes
    defaultTemplateForNewNotes: null, // Template note ID for new notes

    // Link Formatting Settings
    preserveOriginalText: true,      // Keep original [[wikilink]] as comment
    linkFormat: 'internal',          // 'internal' for ~noteId, 'markdown' for [title](~noteId)

    // Performance Settings
    batchSize: 50,                   // Notes to process in each batch
    maxNotesPerRun: 1000,            // Maximum notes to process per execution
    queryTimeout: 30000,             // Database query timeout in ms

    // Logging and Debugging
    verboseLogging: false,
    dryRun: false,                   // Process but don't save changes
    generateReport: true,            // Generate processing report

    // Report Settings
    reportNoteTitle: 'Wikilink Processing Report',
    reportNoteParent: 'root',
    reportNoteLabel: 'wikilinkReport'
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
 * Calculates string similarity using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0.0 and 1.0
 */
function calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) return len2 === 0 ? 1.0 : 0.0;
    if (len2 === 0) return 0.0;

    // Create distance matrix
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
}

/**
 * Validates configuration object
 * @param {object} config - Configuration to validate
 * @returns {boolean} True if valid, throws error otherwise
 */
function validateWikilinkConfig(config) {
    if (typeof config.batchSize !== 'number' || config.batchSize < 1 || config.batchSize > 1000) {
        throw new Error('WIKILINK_CONFIG.batchSize must be between 1 and 1000');
    }

    if (typeof config.minMatchScore !== 'number' || config.minMatchScore < 0 || config.minMatchScore > 1) {
        throw new Error('WIKILINK_CONFIG.minMatchScore must be between 0.0 and 1.0');
    }

    if (typeof config.maxNotesPerRun !== 'number' || config.maxNotesPerRun < 1) {
        throw new Error('WIKILINK_CONFIG.maxNotesPerRun must be at least 1');
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
// WIKILINK PARSING
// ----------------------------------------------------------------------------

/**
 * Regular expression for matching wikilinks in content
 * Supports [[title]], [[title|alias]], and [[title#heading]] formats
 */
const WIKILINK_REGEX = /\[\[([^\]]+?)\]\]/g;

/**
 * Represents a parsed wikilink
 * @typedef {Object} Wikilink
 * @property {string} fullMatch - The complete [[wikilink]] match
 * @property {string} title - The note title to link to
 * @property {string} alias - Optional display alias
 * @property {string} heading - Optional heading within the note
 * @property {number} position - Position in the source text
 */

/**
 * Parses wikilinks from note content
 * @param {string} content - Note content to parse
 * @returns {Array<Wikilink>} Array of parsed wikilinks
 */
function parseWikilinks(content) {
    const wikilinks = [];
    let match;

    while ((match = WIKILINK_REGEX.exec(content)) !== null) {
        const fullMatch = match[0];
        const linkContent = match[1];

        // Parse link components
        let title = linkContent;
        let alias = '';
        let heading = '';

        // Handle alias format: [[title|alias]]
        const pipeIndex = linkContent.indexOf('|');
        if (pipeIndex !== -1) {
            title = linkContent.substring(0, pipeIndex).trim();
            alias = linkContent.substring(pipeIndex + 1).trim();
        }

        // Handle heading format: [[title#heading]]
        const hashIndex = title.indexOf('#');
        if (hashIndex !== -1) {
            heading = title.substring(hashIndex + 1).trim();
            title = title.substring(0, hashIndex).trim();
        }

        wikilinks.push({
            fullMatch,
            title,
            alias,
            heading,
            position: match.index
        });
    }

    return wikilinks;
}

// ----------------------------------------------------------------------------
// NOTE RESOLUTION
// ----------------------------------------------------------------------------

/**
 * Searches for notes by title with optional fuzzy matching
 * @param {string} title - Title to search for
 * @returns {Promise<Array<{noteId: string, title: string, score: number}>>} Matching notes
 */
async function findNotesByTitle(title) {
    const searchTitle = WIKILINK_CONFIG.caseSensitive ? title : title.toLowerCase();

    try {
        // Exact match query first
        const exactQuery = `
            SELECT noteId, title
            FROM notes
            WHERE title = ?
              AND isDeleted = 0
              ${WIKILINK_CONFIG.excludeSystemNotes ? "AND noteId NOT LIKE '_system%'" : ''}
            ORDER BY
                CASE WHEN noteId = 'root' THEN 1 ELSE 2 END,
                title = ? DESC,
                LENGTH(title) ASC
            LIMIT 5
        `;

        const exactResults = await api.sql.getRows(exactQuery, [title, title]);

        if (exactResults.length > 0) {
            return exactResults.map(row => ({
                noteId: row.noteId,
                title: row.title,
                score: 1.0
            }));
        }

        // Fuzzy matching if enabled
        if (WIKILINK_CONFIG.fuzzySearch) {
            const fuzzyQuery = `
                SELECT noteId, title
                FROM notes
                WHERE title LIKE ?
                  AND isDeleted = 0
                  ${WIKILINK_CONFIG.excludeSystemNotes ? "AND noteId NOT LIKE '_system%'" : ''}
                ORDER BY LENGTH(title) ASC
                LIMIT 50
            `;

            const fuzzyPattern = WIKILINK_CONFIG.caseSensitive ?
                `%${title}%` : `%${searchTitle}%`;
            const fuzzyResults = await api.sql.getRows(fuzzyQuery, [fuzzyPattern]);

            // Calculate similarity scores
            const scoredResults = fuzzyResults
                .map(row => {
                    const score = calculateSimilarity(
                        WIKILINK_CONFIG.caseSensitive ? row.title : row.title.toLowerCase(),
                        searchTitle
                    );
                    return {
                        noteId: row.noteId,
                        title: row.title,
                        score
                    };
                })
                .filter(result => result.score >= WIKILINK_CONFIG.minMatchScore)
                .sort((a, b) => {
                    // Sort by score descending, then by title length ascending
                    if (b.score !== a.score) return b.score - a.score;
                    return a.title.length - b.title.length;
                })
                .slice(0, WIKILINK_CONFIG.maxSearchResults);

            return scoredResults;
        }

        return [];

    } catch (error) {
        throw new Error(`Failed to search for notes with title "${title}": ${error.message}`);
    }
}

/**
 * Resolves a wikilink to a note ID
 * @param {Wikilink} wikilink - The wikilink to resolve
 * @returns {Promise<{noteId: string, title: string, created: boolean, confidence: number}>} Resolution result
 */
async function resolveWikilink(wikilink) {
    const candidates = await findNotesByTitle(wikilink.title);

    if (candidates.length === 0) {
        // No matches found
        if (WIKILINK_CONFIG.autoCreateOrphanedLinks) {
            const newNoteId = await createNoteFromWikilink(wikilink);
            return {
                noteId: newNoteId,
                title: wikilink.title,
                created: true,
                confidence: 1.0
            };
        } else {
            throw new Error(`No matching note found for wikilink: [[${wikilink.title}]]`);
        }
    }

    if (candidates.length === 1) {
        // Single match - use it
        return {
            noteId: candidates[0].noteId,
            title: candidates[0].title,
            created: false,
            confidence: candidates[0].score
        };
    }

    // Multiple matches - use the best one
    const bestMatch = candidates[0];
    if (WIKILINK_CONFIG.verboseLogging) {
        api.log(`[Wikilink] Multiple matches found for "${wikilink.title}", using "${bestMatch.title}" (${bestMatch.noteId}) with score ${bestMatch.score.toFixed(2)}`);
    }

    return {
        noteId: bestMatch.noteId,
        title: bestMatch.title,
        created: false,
        confidence: bestMatch.score
    };
}

/**
 * Creates a new note from a wikilink
 * @param {Wikilink} wikilink - The wikilink to create a note for
 * @returns {Promise<string>} ID of the created note
 */
async function createNoteFromWikilink(wikilink) {
    try {
        const noteTitle = wikilink.title;
        const noteContent = generateNewNoteContent(wikilink);

        if (WIKILINK_CONFIG.verboseLogging) {
            api.log(`[Wikilink] Creating new note: "${noteTitle}"`);
        }

        const { note } = await api.createTextNote(
            WIKILINK_CONFIG.defaultParentForNewNotes,
            noteTitle,
            noteContent
        );

        // Add label to identify it as created from wikilink
        await note.setLabel('createdFromWikilink', 'true');

        // Apply template if specified
        if (WIKILINK_CONFIG.defaultTemplateForNewNotes) {
            try {
                const templateNote = await api.getNote(WIKILINK_CONFIG.defaultTemplateForNewNotes);
                if (templateNote) {
                    await note.setLabel('template', templateNote.noteId);
                }
            } catch (templateError) {
                api.log(`[Wikilink] Warning: Could not apply template: ${templateError.message}`);
            }
        }

        api.log(`[Wikilink] Created new note: ${note.noteId} ("${noteTitle}")`);
        return note.noteId;

    } catch (error) {
        throw new Error(`Failed to create note for wikilink [[${wikilink.title}]]: ${error.message}`);
    }
}

/**
 * Generates initial content for newly created notes
 * @param {Wikilink} wikilink - The wikilink that triggered note creation
 * @returns {string} Initial note content
 */
function generateNewNoteContent(wikilink) {
    let content = `# ${wikilink.title}\n\n`;
    content += `*This note was automatically created from a wikilink reference.*\n\n`;

    if (wikilink.heading) {
        content += `## ${wikilink.heading}\n\n`;
        content += `Content for this section will be added here.\n\n`;
    }

    content += `---\n\n`;
    content += `**Created:** ${formatTimestamp(new Date())}\n`;
    content += `**Source:** Wikilink processor\n`;

    return content;
}

// ----------------------------------------------------------------------------
// LINK PROCESSING
// ----------------------------------------------------------------------------

/**
 * Converts wikilinks to Trilium internal links in note content
 * @param {string} content - Original note content
 * @param {Array<Object>} resolutions - Array of resolved wikilinks
 * @returns {string} Content with converted links
 */
function convertWikilinksToInternalLinks(content, resolutions) {
    let processedContent = content;

    // Process resolutions in reverse order to maintain position accuracy
    const sortedResolutions = [...resolutions].sort((a, b) => b.position - a.position);

    for (const resolution of sortedResolutions) {
        const { wikilink, resolution: linkResolution } = resolution;
        let replacement;

        switch (WIKILINK_CONFIG.linkFormat) {
            case 'markdown':
                const displayText = wikilink.alias || wikilink.title;
                replacement = `[${displayText](~${linkResolution.noteId})`;
                break;

            case 'internal':
            default:
                replacement = `~${linkResolution.noteId}`;
                break;
        }

        // Add comment with original wikilink if enabled
        if (WIKILINK_CONFIG.preserveOriginalText) {
            replacement += ` <!-- [[${wikilink.title}]] -->`;
        }

        // Replace the wikilink in content
        const before = processedContent.substring(0, wikilink.position);
        const after = processedContent.substring(wikilink.position + wikilink.fullMatch.length);
        processedContent = before + replacement + after;
    }

    return processedContent;
}

/**
 * Processes a single note for wikilinks
 * @param {string} noteId - ID of note to process
 * @returns {Promise<Object>} Processing results
 */
async function processNoteForWikilinks(noteId) {
    const startTime = Date.now();
    const results = {
        noteId,
        noteTitle: '',
        wikilinksFound: 0,
        wikilinksProcessed: 0,
        linksCreated: 0,
        notesCreated: 0,
        errors: [],
        processingTime: 0
    };

    try {
        // Get the note
        const note = await api.getNote(noteId);
        if (!note) {
            throw new Error(`Note not found: ${noteId}`);
        }

        results.noteTitle = note.title;

        // Get note content
        const content = await note.getContent();
        if (!content) {
            return results; // No content to process
        }

        // Parse wikilinks
        const wikilinks = parseWikilinks(content);
        results.wikilinksFound = wikilinks.length;

        if (wikilinks.length === 0) {
            return results;
        }

        // Resolve each wikilink
        const resolutions = [];
        for (const wikilink of wikilinks) {
            try {
                const resolution = await resolveWikilink(wikilink);
                resolutions.push({ wikilink, resolution });

                if (resolution.created) {
                    results.notesCreated++;
                }

                results.wikilinksProcessed++;

            } catch (error) {
                results.errors.push({
                    wikilink: wikilink.fullMatch,
                    error: error.message
                });

                if (WIKILINK_CONFIG.verboseLogging) {
                    api.log(`[Wikilink] Error processing [[${wikilink.title}]]: ${error.message}`);
                }
            }
        }

        // Convert wikilinks to internal links
        if (resolutions.length > 0 && !WIKILINK_CONFIG.dryRun) {
            const processedContent = convertWikilinksToInternalLinks(content, resolutions);

            // Only update if content actually changed
            if (processedContent !== content) {
                await note.setContent(processedContent);
                results.linksCreated = resolutions.length;
            }
        }

    } catch (error) {
        results.errors.push({
            error: error.message
        });

        if (WIKILINK_CONFIG.verboseLogging) {
            api.log(`[Wikilink] Error processing note ${noteId}: ${error.message}`);
        }
    }

    results.processingTime = Date.now() - startTime;
    return results;
}

// ----------------------------------------------------------------------------
// BATCH PROCESSING
// ----------------------------------------------------------------------------

/**
 * Gets candidate notes for wikilink processing
 * @returns {Promise<Array<string>>} Array of note IDs to process
 */
async function getCandidateNotes() {
    try {
        let query = `
            SELECT noteId
            FROM notes
            WHERE type = 'text'
              AND isDeleted = 0
              ${WIKILINK_CONFIG.excludeSystemNotes ? "AND noteId NOT LIKE '_system%'" : ''}
        `;

        const params = [];

        // Apply scope filtering if configured
        if (WIKILINK_CONFIG.scopeToParentNote) {
            const scopeQuery = `
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

            const scopeResults = await api.sql.getRows(scopeQuery, [WIKILINK_CONFIG.scopeToParentNote]);
            const scopeNoteIds = scopeResults.map(row => row.noteId);

            if (scopeNoteIds.length > 0) {
                const placeholders = scopeNoteIds.map(() => '?').join(',');
                query += ` AND noteId IN (${placeholders})`;
                params.push(...scopeNoteIds);
            }
        }

        // Exclude specific note IDs
        if (WIKILINK_CONFIG.excludeNoteIds.length > 0) {
            const excludePlaceholders = WIKILINK_CONFIG.excludeNoteIds.map(() => '?').join(',');
            query += ` AND noteId NOT IN (${excludePlaceholders})`;
            params.push(...WIKILINK_CONFIG.excludeNoteIds);
        }

        // Limit results and order by last modified
        query += ` ORDER BY dateModified DESC LIMIT ?`;
        params.push(WIKILINK_CONFIG.maxNotesPerRun);

        const results = await api.sql.getRows(query, params);
        return results.map(row => row.noteId);

    } catch (error) {
        throw new Error(`Failed to get candidate notes: ${error.message}`);
    }
}

/**
 * Processes notes in batches
 * @param {Array<string>} noteIds - Note IDs to process
 * @returns {Promise<Array<Object>>} Processing results for all notes
 */
async function processNotesInBatches(noteIds) {
    const allResults = [];

    for (let i = 0; i < noteIds.length; i += WIKILINK_CONFIG.batchSize) {
        const batch = noteIds.slice(i, i + WIKILINK_CONFIG.batchSize);

        if (WIKILINK_CONFIG.verboseLogging) {
            api.log(`[Wikilink] Processing batch ${Math.floor(i / WIKILINK_CONFIG.batchSize) + 1} (${batch.length} notes)`);
        }

        // Process batch in parallel
        const batchPromises = batch.map(noteId => processNoteForWikilinks(noteId));
        const batchResults = await Promise.all(batchPromises);

        allResults.push(...batchResults);

        // Brief delay between batches to prevent overwhelming the system
        if (i + WIKILINK_CONFIG.batchSize < noteIds.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return allResults;
}

// ----------------------------------------------------------------------------
// REPORT GENERATION
// ----------------------------------------------------------------------------

/**
 * Generates HTML report for wikilink processing results
 * @param {Array<Object>} results - Processing results
 * @param {number} executionTime - Total execution time in ms
 * @returns {string} HTML report content
 */
function generateWikilinkReport(results, executionTime) {
    const totalNotes = results.length;
    const notesWithWikilinks = results.filter(r => r.wikilinksFound > 0).length;
    const totalWikilinks = results.reduce((sum, r) => sum + r.wikilinksFound, 0);
    const processedWikilinks = results.reduce((sum, r) => sum + r.wikilinksProcessed, 0);
    const notesCreated = results.reduce((sum, r) => sum + r.notesCreated, 0);
    const linksCreated = results.reduce((sum, r) => sum + r.linksCreated, 0);
    const errors = results.reduce((sum, r) => sum + r.errors.length, 0);

    const executionSeconds = (executionTime / 1000).toFixed(2);

    let html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #1e1e1e; color: #d4d4d4; min-height: 100vh;">
        <div style="max-width: 1200px; margin: 0 auto;">

            <!-- Header -->
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #404040;">
                <h1 style="margin: 0; color: #61afef; font-size: 24px; font-weight: 600;">
                    🔗 Wikilink Processing Report
                </h1>
                <div style="margin-top: 10px; color: #abb2bf; font-size: 14px;">
                    Generated on ${formatTimestamp(new Date())} • Execution time: ${executionSeconds}s
                </div>
            </div>

            <!-- Summary Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; border: 1px solid #404040; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #61afef;">${totalNotes}</div>
                    <div style="font-size: 12px; color: #abb2bf; margin-top: 5px;">Notes Processed</div>
                </div>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; border: 1px solid #404040; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #98c379;">${notesWithWikilinks}</div>
                    <div style="font-size: 12px; color: #abb2bf; margin-top: 5px;">Notes with Wikilinks</div>
                </div>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; border: 1px solid #404040; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #e5c07b;">${processedWikilinks}</div>
                    <div style="font-size: 12px; color: #abb2bf; margin-top: 5px;">Wikilinks Processed</div>
                </div>
                <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; border: 1px solid #404040; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #c678dd;">${notesCreated}</div>
                    <div style="font-size: 12px; color: #abb2bf; margin-top: 5px;">New Notes Created</div>
                </div>
            </div>

            <!-- Configuration -->
            <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #404040;">
                <h3 style="margin: 0 0 10px 0; color: #e5c07b; font-size: 16px;">⚙️ Configuration</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 12px; color: #abb2bf;">
                    <div><strong>Fuzzy Search:</strong> ${WIKILINK_CONFIG.fuzzySearch ? 'Enabled' : 'Disabled'}</div>
                    <div><strong>Auto-create Orphaned:</strong> ${WIKILINK_CONFIG.autoCreateOrphanedLinks ? 'Enabled' : 'Disabled'}</div>
                    <div><strong>Min Match Score:</strong> ${WIKILINK_CONFIG.minMatchScore}</div>
                    <div><strong>Link Format:</strong> ${WIKILINK_CONFIG.linkFormat}</div>
                    <div><strong>Batch Size:</strong> ${WIKILINK_CONFIG.batchSize}</div>
                    <div><strong>Dry Run:</strong> ${WIKILINK_CONFIG.dryRun ? 'Yes' : 'No'}</div>
                </div>
            </div>
    `;

    // Detailed results table
    if (results.length > 0) {
        html += `
            <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #404040;">
                <h3 style="margin: 0 0 15px 0; color: #e5c07b; font-size: 16px;">📊 Detailed Results</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: #21252b; color: #abb2bf;">
                                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #404040;">Note</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #404040;">Wikilinks Found</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #404040;">Processed</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #404040;">Links Created</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #404040;">Notes Created</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #404040;">Time (ms)</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        const sortedResults = results.sort((a, b) => b.wikilinksFound - a.wikilinksFound);

        for (const result of sortedResults) {
            if (result.wikilinksFound > 0) {
                const noteLink = `#root/${result.noteId}`;
                const bgColor = result.errors.length > 0 ? '#3f2d2d' : (result.wikilinksFound > 0 ? '#2a3f2f' : '#1e1e1e');

                html += `
                    <tr style="background: ${bgColor}; border-bottom: 1px solid #404040;">
                        <td style="padding: 8px; border-right: 1px solid #404040;">
                            <a href="${noteLink}" style="color: #61afef; text-decoration: none;">${escapeHtml(result.noteTitle)}</a>
                        </td>
                        <td style="padding: 8px; text-align: center; border-right: 1px solid #404040; color: #e5c07b;">${result.wikilinksFound}</td>
                        <td style="padding: 8px; text-align: center; border-right: 1px solid #404040; color: #98c379;">${result.wikilinksProcessed}</td>
                        <td style="padding: 8px; text-align: center; border-right: 1px solid #404040; color: #61afef;">${result.linksCreated}</td>
                        <td style="padding: 8px; text-align: center; border-right: 1px solid #404040; color: #c678dd;">${result.notesCreated}</td>
                        <td style="padding: 8px; text-align: center; color: #abb2bf;">${result.processingTime}</td>
                    </tr>
                `;
            }
        }

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Errors section
    if (errors > 0) {
        html += `
            <div style="background: #3f2d2d; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #5c3a3a;">
                <h3 style="margin: 0 0 15px 0; color: #e06c75; font-size: 16px;">⚠️ Errors (${errors})</h3>
        `;

        const errorResults = results.filter(r => r.errors.length > 0);
        for (const result of errorResults) {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: #2d1d1d; border-radius: 4px;">
                    <div style="color: #e06c75; font-weight: bold; margin-bottom: 5px;">
                        ${escapeHtml(result.noteTitle)}
                    </div>
            `;

            for (const error of result.errors) {
                html += `
                    <div style="color: #abb2bf; font-size: 12px; margin-bottom: 3px;">
                        • ${error.wikilink ? `[[${error.wikilink}]]: ` : ''}${escapeHtml(error.error)}
                    </div>
                `;
            }

            html += `</div>`;
        }

        html += `</div>`;
    }

    // Footer
    html += `
            <div style="background: #2d2d2d; padding: 15px; border-radius: 6px; border: 1px solid #404040; text-align: center; font-size: 12px; color: #5c6370;">
                Generated by <strong style="color: #abb2bf;">Wikilink Processor v1.0</strong> •
                Total: ${totalWikilinks} wikilinks found, ${processedWikilinks} processed, ${notesCreated} notes created
            </div>

        </div>
    </div>
    `;

    return html;
}

/**
 * Creates or updates the processing report note
 * @param {Array<Object>} results - Processing results
 * @param {number} executionTime - Total execution time
 * @returns {Promise<void>}
 */
async function createOrUpdateReport(results, executionTime) {
    try {
        const reportContent = generateWikilinkReport(results, executionTime);

        // Try to find existing report note
        let reportNote = await api.getNoteWithLabel(WIKILINK_CONFIG.reportNoteLabel);

        if (!reportNote) {
            // Create new report note
            const { note } = await api.createTextNote(
                WIKILINK_CONFIG.reportNoteParent,
                WIKILINK_CONFIG.reportNoteTitle,
                reportContent
            );
            await note.setLabel(WIKILINK_CONFIG.reportNoteLabel, 'true');
            reportNote = note;

            if (WIKILINK_CONFIG.verboseLogging) {
                api.log(`[Wikilink] Created report note: ${reportNote.noteId}`);
            }
        } else {
            // Update existing report note
            await reportNote.setContent(reportContent);

            if (WIKILINK_CONFIG.verboseLogging) {
                api.log(`[Wikilink] Updated report note: ${reportNote.noteId}`);
            }
        }

    } catch (error) {
        api.log(`[Wikilink] Failed to create/update report: ${error.message}`);
    }
}

// ----------------------------------------------------------------------------
// MAIN EXECUTION
// ----------------------------------------------------------------------------

/**
 * Main wikilink processing function
 * @returns {Promise<void>}
 */
async function processWikilinks() {
    const startTime = Date.now();

    try {
        api.log('[Wikilink] Starting wikilink processing...');

        // Validate configuration
        validateWikilinkConfig(WIKILINK_CONFIG);

        if (!WIKILINK_CONFIG.enabled) {
            api.log('[Wikilink] Processor is disabled in configuration');
            return;
        }

        // Check for dry run mode
        if (WIKILINK_CONFIG.dryRun) {
            api.log('[Wikilink] DRY RUN MODE - No changes will be saved');
        }

        // Get candidate notes
        const candidateNotes = await getCandidateNotes();
        api.log(`[Wikilink] Found ${candidateNotes.length} candidate notes to process`);

        if (candidateNotes.length === 0) {
            api.log('[Wikilink] No notes to process');
            return;
        }

        // Process notes in batches
        const results = await processNotesInBatches(candidateNotes);

        // Calculate statistics
        const executionTime = Date.now() - startTime;
        const totalWikilinks = results.reduce((sum, r) => sum + r.wikilinksFound, 0);
        const processedWikilinks = results.reduce((sum, r) => sum + r.wikilinksProcessed, 0);
        const notesCreated = results.reduce((sum, r) => sum + r.notesCreated, 0);
        const errors = results.reduce((sum, r) => sum + r.errors.length, 0);

        // Generate report if enabled
        if (WIKILINK_CONFIG.generateReport) {
            await createOrUpdateReport(results, executionTime);
        }

        // Log summary
        const duration = (executionTime / 1000).toFixed(2);
        api.log(`[Wikilink] ✓ Processing completed in ${duration}s`);
        api.log(`[Wikilink] Summary: ${processedWikilinks}/${totalWikilinks} wikilinks processed, ${notesCreated} notes created, ${errors} errors`);

        if (errors > 0) {
            api.log(`[Wikilink] ⚠ Completed with ${errors} errors - check report for details`);
        }

    } catch (error) {
        api.log(`[Wikilink] Fatal error: ${error.message}`);
        throw error;
    }
}

// ----------------------------------------------------------------------------
// SCRIPT ENTRY POINT
// ----------------------------------------------------------------------------

// Execute the script
processWikilinks().catch(error => {
    api.log(`[Wikilink] Fatal error: ${error.message}`);
});