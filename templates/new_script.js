/**
 * @name New Script Template
 * @version 1.0.0
 * @author Your Name
 * @description A template for creating new Trilium scripts with consistent structure and quality standards
 *
 * @category Utility
 * @tags template, development, trilium
 *
 * @triliumVersion 0.60.0
 * @difficulty Easy
 *
 * @config true
 *
 * @features
 * - Template structure for consistent script development
 * - Comprehensive error handling and logging
 * - Performance optimized with batch processing
 * - Safe read-only operations by default
 * - Easy customization and extension
 *
 * @useCases
 * - Starting point for new Trilium backend scripts
 * - Learning script development patterns
 * - Ensuring consistent code quality across projects
 * - Quick prototyping of new functionality
 *
 * @exampleBasic
 * ```javascript
 * // Basic usage - run main function
 * main();
 * ```
 *
 * @exampleAdvanced
 * ```javascript
 * // With custom configuration
 * const customConfig = {
 *     debugMode: true,
 *     batchSize: 100,
 *     customOption: "value"
 * };
 *
 * // Override configuration
 * Object.assign(config, customConfig);
 * main();
 * ```
 *
 * @limitations
 * - Requires Trilium Notes 0.60.0 or later
 * - Basic template - extend based on your specific needs
 * - Some features may need additional implementation
 *
 * @todo
 * - Add specific functionality based on your use case
 * - Implement proper data validation
 * - Add comprehensive unit tests
 * - Create documentation and examples
 */

// Configuration Section
const config = {
    // Debug and logging options
    debugMode: false,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'

    // Performance options
    batchSize: 1000,
    maxRetries: 3,
    timeout: 30000,

    // Processing options
    includeArchived: false,
    processChildren: true,

    // Output options
    outputFormat: 'table', // 'table', 'list', 'json'
    includeMetadata: true,

    // Custom options for your specific use case
    customOption: 'default_value'
};

// Utility Functions
function log(message, level = 'info') {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = levels.indexOf(config.logLevel);
    const messageLevel = levels.indexOf(level);

    if (messageLevel >= configLevel) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);

        // Also log to Trilium if available
        if (typeof logToTrilium !== 'undefined') {
            logToTrilium(`${prefix} ${message}`, level);
        }
    }
}

function handleError(error, context = '') {
    const errorMessage = context ? `${context}: ${error.message}` : error.message;
    log(errorMessage, 'error');

    if (config.debugMode) {
        console.error('Full error:', error);
        console.error('Stack trace:', error.stack);
    }

    // Return error object for consistent error handling
    return {
        success: false,
        error: error.message,
        context,
        timestamp: new Date().toISOString()
    };
}

function validateInput(data) {
    if (!data) {
        throw new Error('Input data is required');
    }

    // Add specific validation for your script
    // Example: if (typeof data.id !== 'string') { ... }

    return true;
}

// Core Processing Functions
async function processData(data) {
    try {
        validateInput(data);
        log(`Processing data: ${JSON.stringify(data)}`, 'debug');

        // Your processing logic here
        const result = await processBatch(data);

        log(`Successfully processed ${result.processedCount} items`);
        return {
            success: true,
            result,
            processedCount: result.processedCount,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        return handleError(error, 'processData');
    }
}

async function processBatch(data) {
    const results = [];

    // Implement batch processing for performance
    for (let i = 0; i < data.length; i += config.batchSize) {
        const batch = data.slice(i, i + i + config.batchSize);

        try {
            const batchResults = await processBatchItems(batch);
            results.push(...batchResults);

            log(`Processed batch ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(data.length / config.batchSize)}`);

        } catch (batchError) {
            log(`Batch ${Math.floor(i / config.batchSize) + 1} failed: ${batchError.message}`, 'warn');
            // Continue with next batch or rethrow based on requirements
        }
    }

    return {
        results,
        processedCount: results.length
    };
}

async function processBatchItems(items) {
    const results = [];

    for (const item of items) {
        try {
            // Process individual item
            const processed = await processItem(item);
            results.push(processed);

        } catch (itemError) {
            log(`Failed to process item ${item.id}: ${itemError.message}`, 'warn');
            // Continue with next item or collect errors
        }
    }

    return results;
}

async function processItem(item) {
    // Your item processing logic here
    // Example: create notes, update attributes, search, etc.

    log(`Processing item: ${item.id || item.name}`, 'debug');

    // Return processed item result
    return {
        id: item.id,
        processed: true,
        timestamp: new Date().toISOString()
    };
}

// Trilium Integration Functions
async function getNotes(options = {}) {
    const defaultOptions = {
        includeArchived: config.includeArchived,
        includeChildren: config.processChildren,
        limit: config.batchSize
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        // Example: Get notes using Trilium API
        // Replace with actual Trilium API calls
        const notes = await api.getNotes(finalOptions);
        return notes;

    } catch (error) {
        return handleError(error, 'getNotes');
    }
}

async function createNote(noteData) {
    try {
        validateInput(noteData);

        // Example: Create note using Trilium API
        // Replace with actual Trilium API calls
        const note = await api.createNote(noteData);
        log(`Created note: ${note.title} (ID: ${note.id})`);

        return note;

    } catch (error) {
        return handleError(error, 'createNote');
    }
}

async function updateNote(noteId, updates) {
    try {
        validateInput({ noteId, updates });

        // Example: Update note using Trilium API
        // Replace with actual Trilium API calls
        const note = await api.updateNote(noteId, updates);
        log(`Updated note: ${note.title} (ID: ${note.id})`);

        return note;

    } catch (error) {
        return handleError(error, 'updateNote');
    }
}

// Main Function
async function main() {
    try {
        log('Starting script execution');
        log(`Configuration: ${JSON.stringify(config, null, 2)}`, 'debug');

        // Your main script logic here
        // Example:
        // 1. Get data from Trilium
        // 2. Process the data
        // 3. Create/update notes
        // 4. Generate reports

        const notes = await getNotes();
        log(`Retrieved ${notes.length} notes for processing`);

        if (notes.length === 0) {
            log('No notes found to process', 'warn');
            return {
                success: true,
                message: 'No notes found to process',
                processedCount: 0,
                timestamp: new Date().toISOString()
            };
        }

        const result = await processData(notes);

        log('Script execution completed successfully');
        return result;

    } catch (error) {
        return handleError(error, 'main');
    }
}

// Configuration Override Function
function updateConfig(newConfig) {
    try {
        validateInput(newConfig);

        Object.assign(config, newConfig);
        log('Configuration updated successfully', 'info');

        return {
            success: true,
            config,
            message: 'Configuration updated'
        };

    } catch (error) {
        return handleError(error, 'updateConfig');
    }
}

// Get Current Configuration
function getConfig() {
    return {
        ...config,
        timestamp: new Date().toISOString()
    };
}

// Export Functions for Use in Other Scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        main,
        config,
        updateConfig,
        getConfig,
        // Export individual utility functions
        log,
        handleError,
        validateInput,
        processData,
        getNotes,
        createNote,
        updateNote
    };
}

// Direct execution when run as standalone script
if (require.main === module) {
    (async () => {
        const result = await main();
        process.exit(result.success ? 0 : 1);
    })();
}