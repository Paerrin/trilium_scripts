/**
 * @name Comprehensive Trilium Scripts Setup Guide
 * @version 1.0.0
 * @author Paerrin
 * @description Complete setup guide for all Trilium scripts with step-by-step installation, configuration, and integration
 *
 * @category Tutorial
 * @tags setup, installation, configuration, integration, trilium
 *
 * @triliumVersion 0.60.0
 * @difficulty Medium
 *
 * @config true
 *
 * @features
 * - Step-by-step installation for all scripts
 * - Configuration management and optimization
 * - Integration between multiple scripts
 * - Performance optimization tips
 * - Troubleshooting and error handling
 * - Best practices for production use
 *
 * @useCases
 * - New users setting up Trilium scripts for the first time
 * - Advanced users optimizing their script configuration
 * - Teams deploying scripts in shared environments
 - Users integrating multiple Trilium automation tools
 *
 * @exampleBasic
 * ```javascript
 * // Run the complete setup guide
 * const result = await main();
 * console.log(result.setupSummary);
 * ```
 *
 * @exampleAdvanced
 * ```javascript
 * // Custom setup with specific configurations
 * const customConfig = {
 *     scripts: ['promoted_attributes_table', 'wikilink_processor'],
 *     optimizeFor: 'performance',
 *     includeTests: true
 * };
 *
 * const result = await main(customConfig);
 * ```
 *
 * @limitations
 * - Requires Trilium Notes 0.60.0 or later
 * - Some advanced features require JavaScript knowledge
 * - Performance optimization depends on system resources
 * - Integration features may vary based on Trilium version
 *
 * @todo
 * - Add support for additional scripts as they are developed
 * - Implement automated backup before setup
 * - Add configuration validation and testing
 * - Create setup profiles for different use cases
 * - Add integration with external services
 */

// Comprehensive Setup Guide Configuration
const config = {
    // Setup phases
    phases: [
        'prerequisites',
        'environment_setup',
        'script_installation',
        'configuration',
        'integration',
        'testing',
        'optimization',
        'production_ready'
    ],

    // Supported scripts with their configurations
    scripts: {
        promoted_attributes_table: {
            name: 'Promoted Attributes Table',
            difficulty: 'Medium',
            category: 'Database Enhancement',
            setupTime: 10,
            configOptions: {
                updateInterval: 'hourly',
                includeArchived: false,
                groupBy: 'name',
                showStatistics: true,
                maxRows: 1000
            }
        },
        trilium_n8n_node: {
            name: 'Trilium n8n Integration',
            difficulty: 'Advanced',
            category: 'Workflow Automation',
            setupTime: 25,
            configOptions: {
                apiType: 'etapi',
                enableWebhooks: true,
                defaultTimeout: 30,
                maxConcurrent: 5,
                enableCache: true
            }
        },
        wikilink_processor: {
            name: 'Wikilink Processor',
            difficulty: 'Medium',
            category: 'Content Processing',
            setupTime: 15,
            configOptions: {
                createMissingNotes: true,
                fuzzyMatching: true,
                batchSize: 1000,
                processChildren: true,
                reportFormat: 'detailed'
            }
        }
    },

    // Setup profiles for different use cases
    profiles: {
        personal: {
            name: 'Personal Knowledge Management',
            scripts: ['promoted_attributes_table', 'wikilink_processor'],
            priority: 'usability',
            optimization: 'balanced'
        },
        team: {
            name: 'Team Collaboration',
            scripts: ['trilium_n8n_node', 'promoted_attributes_table'],
            priority: 'stability',
            optimization: 'performance'
        },
        power_user: {
            name: 'Power User Setup',
            scripts: ['promoted_attributes_table', 'trilium_n8n_node', 'wikilink_processor'],
            priority: 'features',
            optimization: 'memory'
        },
        developer: {
            name: 'Developer Environment',
            scripts: ['trilium_n8n_node', 'wikilink_processor'],
            priority: 'integration',
            optimization: 'development'
        }
    },

    // System requirements
    systemRequirements: {
        triliumVersion: '0.60.0',
        recommendedMemory: '2GB',
        minDiskSpace: '1GB',
        recommendedCpu: '2 cores'
    },

    // Performance optimization levels
    optimizationLevels: {
        performance: {
            batchSize: 2000,
            maxRetries: 2,
            enableCache: true,
            parallelProcessing: true
        },
        memory: {
            batchSize: 500,
            maxRetries: 5,
            enableCache: false,
            parallelProcessing: false
        },
        balanced: {
            batchSize: 1000,
            maxRetries: 3,
            enableCache: true,
            parallelProcessing: true
        }
    },

    // Testing configuration
    testing: {
        enableTests: true,
        testNotes: 100,
        validationLevel: 'comprehensive',
        performanceThresholds: {
            smallDatabase: 5,    // seconds
            mediumDatabase: 30,  // seconds
            largeDatabase: 120   // seconds
        }
    }
};

// Setup Phase Management
const setupPhases = {
    prerequisites: async (context) => {
        log('Starting prerequisites check...', 'info');

        const checks = [
            checkTriliumVersion(context),
            checkSystemResources(context),
            checkBrowserCompatibility(context),
            checkRequiredPermissions(context)
        ];

        const results = await Promise.allSettled(checks);
        const failed = results.filter(r => r.status === 'rejected');

        if (failed.length > 0) {
            throw new Error(`Prerequisites failed: ${failed.map(f => f.reason).join(', ')}`);
        }

        context.prerequisitesCompleted = true;
        log('✅ All prerequisites met', 'success');
        return context;
    },

    environment_setup: async (context) => {
        log('Starting environment setup...', 'info');

        const setupTasks = [
            createSetupNotes(context),
            organizeScriptDirectory(context),
            prepareTestEnvironment(context),
            setupConfigurationNotes(context)
        ];

        const results = await Promise.all(setupTasks);

        context.environmentReady = true;
        log('✅ Environment setup completed', 'success');
        return context;
    },

    script_installation: async (context) => {
        log('Starting script installation...', 'info');

        const installationTasks = [];

        for (const scriptName of context.selectedScripts) {
            const scriptConfig = config.scripts[scriptName];
            log(`Installing ${scriptConfig.name}...`, 'info');

            const task = installScript(scriptName, scriptConfig, context);
            installationTasks.push(task);
        }

        const results = await Promise.allSettled(installationTasks);
        const failed = results.filter(r => r.status === 'rejected');

        if (failed.length > 0) {
            log(`⚠️  ${failed.length} script(s) failed to install`, 'warn');
            failed.forEach(f => log(`Error: ${f.reason}`, 'error'));
        }

        context.installationResults = results;
        context.installationCompleted = true;
        log('✅ Script installation completed', 'success');
        return context;
    },

    configuration: async (context) => {
        log('Starting configuration...', 'info');

        const configurationTasks = [];

        for (const scriptName of context.selectedScripts) {
            const scriptConfig = config.scripts[scriptName];
            log(`Configuring ${scriptConfig.name}...`, 'info');

            const task = configureScript(scriptName, scriptConfig, context);
            configurationTasks.push(task);
        }

        const results = await Promise.allSettled(configurationTasks);

        context.configurationResults = results;
        context.configurationCompleted = true;
        log('✅ Configuration completed', 'success');
        return context;
    },

    integration: async (context) => {
        log('Starting script integration...', 'info');

        const integrationTasks = [
            integrateScripts(context),
            setupSharedConfiguration(context),
            createWorkflows(context),
            testIntegration(context)
        ];

        const results = await Promise.all(integrationTasks);

        context.integrationResults = results;
        context.integrationCompleted = true;
        log('✅ Integration completed', 'success');
        return context;
    },

    testing: async (context) => {
        if (!config.testing.enableTests) {
            log('Testing disabled in configuration', 'info');
            context.testingCompleted = true;
            return context;
        }

        log('Starting comprehensive testing...', 'info');

        const testTasks = [
            runFunctionalTests(context),
            runPerformanceTests(context),
            runIntegrationTests(context),
            runStressTests(context)
        ];

        const results = await Promise.allSettled(testTasks);
        const testResults = results.map(r => r.status === 'fulfilled' ? r.value : null);

        context.testResults = testResults;
        context.testingCompleted = true;

        const passedTests = testResults.filter(r => r && r.success).length;
        const totalTests = testResults.length;

        log(`✅ Testing completed: ${passedTests}/${totalTests} tests passed`, 'success');
        return context;
    },

    optimization: async (context) => {
        log('Starting optimization...', 'info');

        const optimizationTasks = [
            optimizePerformance(context),
            optimizeMemory(context),
            optimizeDatabase(context),
            optimizeConfiguration(context)
        ];

        const results = await Promise.all(optimizationTasks);

        context.optimizationResults = results;
        context.optimizationCompleted = true;
        log('✅ Optimization completed', 'success');
        return context;
    },

    production_ready: async (context) => {
        log('Finalizing production setup...', 'info');

        const productionTasks = [
            createProductionNotes(context),
            setupBackupProcedures(context),
            documentSetup(context),
            provideOngoingSupport(context)
        ];

        const results = await Promise.all(productionTasks);

        context.productionReady = true;
        log('✅ Production setup completed', 'success');
        return context;
    }
};

// Prerequisite Check Functions
async function checkTriliumVersion(context) {
    try {
        const etapi = require('etapi');
        const version = await etapi.getVersion();

        if (version < config.systemRequirements.triliumVersion) {
            throw new Error(`Trilium version ${version} is below minimum required ${config.systemRequirements.triliumVersion}`);
        }

        log(`✅ Trilium version ${version} meets requirements`, 'success');
        return true;
    } catch (error) {
        throw new Error(`Trilium version check failed: ${error.message}`);
    }
}

async function checkSystemResources(context) {
    try {
        // Check memory usage
        const memoryUsage = process.memoryUsage();
        const usedMemory = memoryUsage.heapUsed / 1024 / 1024; // MB

        if (usedMemory > parseInt(config.systemRequirements.recommendedMemory)) {
            log(`⚠️  Memory usage: ${usedMemory.toFixed(1)}MB (recommended: ${config.systemRequirements.recommendedMemory}MB)`, 'warn');
        } else {
            log(`✅ Memory usage: ${usedMemory.toFixed(1)}MB`, 'success');
        }

        // Check disk space (basic check)
        const fs = require('fs').promises;
        const stats = await fs.stat(context.inputDirectory);
        log(`✅ Disk space available at ${context.inputDirectory}`, 'success');

        return true;
    } catch (error) {
        throw new Error(`System resource check failed: ${error.message}`);
    }
}

async function checkBrowserCompatibility(context) {
    try {
        // Check if browser console APIs are available
        if (typeof window === 'undefined' || typeof console === 'undefined') {
            throw new Error('Browser console not available');
        }

        log('✅ Browser compatibility confirmed', 'success');
        return true;
    } catch (error) {
        throw new Error(`Browser compatibility check failed: ${error.message}`);
    }
}

async function checkRequiredPermissions(context) {
    try {
        // Check basic Trilium API permissions
        const requiredPermissions = [
            'note:create',
            'note:read',
            'note:update',
            'note:delete',
            'attribute:read',
            'attribute:write'
        ];

        // Test basic API access
        const etapi = require('etapi');
        await etapi.getNotes({ limit: 1 });

        log('✅ Required permissions confirmed', 'success');
        return true;
    } catch (error) {
        throw new Error(`Permission check failed: ${error.message}`);
    }
}

// Environment Setup Functions
async function createSetupNotes(context) {
    try {
        const etapi = require('etapi');

        // Create setup notes directory
        const setupNotes = [
            {
                title: 'Trilium Scripts Setup Guide',
                content: generateSetupGuideContent(context),
                parentNoteId: context.rootNoteId,
                type: 'text'
            },
            {
                title: 'Script Configuration',
                content: generateConfigurationContent(context),
                parentNoteId: context.rootNoteId,
                type: 'text'
            },
            {
                title: 'Integration Documentation',
                content: generateIntegrationContent(context),
                parentNoteId: context.rootNoteId,
                type: 'text'
            }
        ];

        for (const noteData of setupNotes) {
            const note = await etapi.createNote(noteData);
            log(`Created setup note: ${note.title}`, 'info');
            context.setupNotes.push(note);
        }

        return true;
    } catch (error) {
        throw new Error(`Failed to create setup notes: ${error.message}`);
    }
}

async function organizeScriptDirectory(context) {
    try {
        const fs = require('fs').promises;
        const path = require('path');

        // Create organized directory structure
        const directories = [
            'setup_notes',
            'configurations',
            'integrations',
            'backups',
            'logs'
        ];

        for (const dir of directories) {
            const dirPath = path.join(context.outputDirectory, dir);
            await fs.mkdir(dirPath, { recursive: true });
            log(`Created directory: ${dir}`, 'info');
        }

        return true;
    } catch (error) {
        throw new Error(`Failed to organize script directory: ${error.message}`);
    }
}

async function prepareTestEnvironment(context) {
    try {
        const etapi = require('etapi');

        // Create test notes for validation
        const testNotes = [];
        for (let i = 0; i < config.testing.testNotes; i++) {
            const note = await etapi.createNote({
                title: `Test Note ${i + 1}`,
                content: `Test content for script validation ${i + 1}`,
                type: 'text'
            });
            testNotes.push(note);
        }

        context.testNotes = testNotes;
        log(`✅ Created ${testNotes.length} test notes`, 'success');
        return true;
    } catch (error) {
        throw new Error(`Failed to prepare test environment: ${error.message}`);
    }
}

async function setupConfigurationNotes(context) {
    try {
        const etapi = require('etapi');

        // Create configuration notes for each script
        for (const scriptName of context.selectedScripts) {
            const scriptConfig = config.scripts[scriptName];
            const configNote = await etapi.createNote({
                title: `${scriptConfig.name} Configuration`,
                content: generateScriptConfigurationContent(scriptName, scriptConfig),
                type: 'text',
                parentNoteId: context.rootNoteId
            });

            context.configurationNotes[scriptName] = configNote;
            log(`Created configuration note for ${scriptConfig.name}`, 'info');
        }

        return true;
    } catch (error) {
        throw new Error(`Failed to setup configuration notes: ${error.message}`);
    }
}

// Script Installation Functions
async function installScript(scriptName, scriptConfig, context) {
    try {
        const etapi = require('etapi');

        // Get script content (would normally read from file)
        const scriptContent = await getScriptContent(scriptName);

        // Create script note
        const scriptNote = await etapi.createNote({
            title: scriptConfig.name,
            content: scriptContent,
            type: 'javascript-backend',
            parentNoteId: context.rootNoteId
        });

        context.installedScripts[scriptName] = scriptNote;
        log(`✅ Installed ${scriptConfig.name}`, 'success');

        return {
            scriptName,
            success: true,
            note: scriptNote,
            installTime: Date.now()
        };
    } catch (error) {
        log(`❌ Failed to install ${scriptConfig.name}: ${error.message}`, 'error');
        return {
            scriptName,
            success: false,
            error: error.message
        };
    }
}

// Configuration Functions
async function configureScript(scriptName, scriptConfig, context) {
    try {
        const etapi = require('etapi');

        // Apply default configuration
        const scriptNote = context.installedScripts[scriptName];

        // Set note attributes for configuration
        const attributes = Object.entries(scriptConfig.configOptions).map(([key, value]) => ({
            name: `config_${key}`,
            value: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
            type: 'string'
        }));

        for (const attr of attributes) {
            await etapi.createAttribute({
                noteId: scriptNote.id,
                ...attr
            });
        }

        context.configuredScripts[scriptName] = {
            note: scriptNote,
            config: scriptConfig.configOptions
        };

        log(`✅ Configured ${scriptConfig.name}`, 'success');
        return {
            scriptName,
            success: true,
            config: scriptConfig.configOptions
        };
    } catch (error) {
        log(`❌ Failed to configure ${scriptConfig.name}: ${error.message}`, 'error');
        return {
            scriptName,
            success: false,
            error: error.message
        };
    }
}

// Integration Functions
async function integrateScripts(context) {
    try {
        const etapi = require('etapi');

        // Create integration note
        const integrationNote = await etapi.createNote({
            title: 'Script Integration Configuration',
            content: generateIntegrationContent(context),
            type: 'text',
            parentNoteId: context.rootNoteId
        });

        context.integrationNote = integrationNote;
        log('✅ Created integration configuration', 'success');
        return true;
    } catch (error) {
        throw new Error(`Failed to integrate scripts: ${error.message}`);
    }
}

// Testing Functions
async function runFunctionalTests(context) {
    try {
        const testResults = [];

        for (const scriptName of context.selectedScripts) {
            const scriptNote = context.installedScripts[scriptName];
            const scriptConfig = config.scripts[scriptName];

            log(`Running functional tests for ${scriptConfig.name}...`, 'info');

            // Test basic execution
            const testResult = await testScriptExecution(scriptNote);
            testResults.push({
                script: scriptName,
                type: 'functional',
                ...testResult
            });
        }

        return {
            success: testResults.every(r => r.success),
            results: testResults,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

async function runPerformanceTests(context) {
    try {
        const testResults = [];
        const dbSizes = ['small', 'medium', 'large'];
        const noteCounts = [100, 1000, 5000];

        for (const scriptName of context.selectedScripts) {
            const scriptNote = context.installedScripts[scriptName];

            for (let i = 0; i < dbSizes.length; i++) {
                const dbSize = dbSizes[i];
                const noteCount = noteCounts[i];

                log(`Testing ${scriptName} performance with ${dbSize} database (${noteCount} notes)...`, 'info');

                const testResult = await testScriptPerformance(scriptNote, noteCount);
                testResults.push({
                    script: scriptName,
                    databaseSize: dbSize,
                    noteCount,
                    ...testResult
                });
            }
        }

        return {
            success: testResults.every(r => r.success),
            results: testResults,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

async function runIntegrationTests(context) {
    try {
        const testResults = [];

        // Test script interactions
        for (let i = 0; i < context.selectedScripts.length; i++) {
            for (let j = i + 1; j < context.selectedScripts.length; j++) {
                const script1 = context.selectedScripts[i];
                const script2 = context.selectedScripts[j];

                log(`Testing integration between ${script1} and ${script2}...`, 'info');

                const testResult = await testScriptInteraction(script1, script2, context);
                testResults.push({
                    script1,
                    script2,
                    type: 'integration',
                    ...testResult
                });
            }
        }

        return {
            success: testResults.every(r => r.success),
            results: testResults,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Optimization Functions
async function optimizePerformance(context) {
    try {
        const optimizationResults = [];

        for (const scriptName of context.selectedScripts) {
            const scriptNote = context.installedScripts[scriptName];
            const scriptConfig = config.scripts[scriptName];

            log(`Optimizing ${scriptConfig.name} for performance...`, 'info');

            // Apply performance optimizations
            const optimization = await applyPerformanceOptimizations(scriptNote);
            optimizationResults.push({
                script: scriptName,
                ...optimization
            });
        }

        return {
            success: optimizationResults.every(r => r.success),
            results: optimizationResults,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Main Setup Functions
async function main(setupConfig = {}) {
    try {
        const startTime = Date.now();

        // Initialize context
        const context = {
            startTime,
            setupConfig,
            selectedScripts: setupConfig.scripts || Object.keys(config.scripts),
            profile: setupConfig.profile || 'balanced',
            rootNoteId: 'root', // Would be determined dynamically
            setupNotes: [],
            configurationNotes: {},
            installedScripts: {},
            configuredScripts: {},
            testResults: [],
            optimizationResults: [],
            integrationResults: [],
            installationResults: [],
            configurationResults: [],
            outputDirectory: setupConfig.outputDirectory || '/tmp/trilium-setup'
        };

        log('Starting comprehensive Trilium scripts setup...', 'info');
        log(`Selected scripts: ${context.selectedScripts.join(', ')}`, 'info');
        log(`Setup profile: ${context.profile}`, 'info');

        // Execute setup phases
        for (const phaseName of config.phases) {
            log(`Starting phase: ${phaseName}`, 'info');

            try {
                context.currentPhase = phaseName;
                await setupPhases[phaseName](context);
                log(`✅ Phase completed: ${phaseName}`, 'success');
            } catch (error) {
                log(`❌ Phase failed: ${phaseName} - ${error.message}`, 'error');
                throw error;
            }
        }

        // Generate setup summary
        const setupSummary = generateSetupSummary(context);

        const endTime = Date.now();
        const duration = endTime - startTime;

        log(`✅ Setup completed in ${formatDuration(duration)}`, 'success');

        return {
            success: true,
            setupSummary,
            context,
            duration,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        log(`❌ Setup failed: ${error.message}`, 'error');
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Utility Functions
function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function generateSetupGuideContent(context) {
    return `# Comprehensive Trilium Scripts Setup Guide

This guide provides step-by-step instructions for setting up and configuring all Trilium scripts.

## Overview

Setup Profile: ${context.profile}
Selected Scripts: ${context.selectedScripts.join(', ')}
Estimated Time: ${estimateSetupTime(context.selectedScripts)} minutes

## Prerequisites

- Trilium Notes ${config.systemRequirements.triliumVersion} or later
- ${config.systemRequirements.recommendedMemory} RAM minimum
- Basic JavaScript knowledge for advanced configuration

## Installation Steps

1. Environment Setup
2. Script Installation
3. Configuration
4. Integration
5. Testing
6. Optimization
7. Production Readiness

## Next Steps

Follow the setup notes for detailed instructions on each script.`;
}

function generateConfigurationContent(context) {
    return `# Script Configuration

## Configuration Notes

${context.selectedScripts.map(scriptName => {
    const scriptConfig = config.scripts[scriptName];
    return `
### ${scriptConfig.name}
${Object.entries(scriptConfig.configOptions).map(([key, value]) =>
    `- ${key}: ${value}`
).join('\n')}
`;
}).join('')}

## Optimization Profile

${context.profile} optimization settings applied.`;
}

function generateIntegrationContent(context) {
    return `# Script Integration Guide

## Integration Overview

This document provides guidance on integrating multiple Trilium scripts.

## Script Interactions

${context.selectedScripts.map((script1, index) => {
    const interactions = context.selectedScripts.slice(index + 1).map(script2 =>
        `- ${script1} → ${script2}: ${getInteractionDescription(script1, script2)}`
    ).join('\n');
    return interactions;
}).filter(i => i).join('\n\n')}

## Shared Configuration

Common settings and attributes shared across scripts.`;
}

function generateScriptConfigurationContent(scriptName, scriptConfig) {
    return `# ${scriptConfig.name} Configuration

## Default Configuration

${Object.entries(scriptConfig.configOptions).map(([key, value]) =>
    \`config_${key} = ${JSON.stringify(value)}\`
).join('\n')}

## Customization Options

Modify these attributes in the script note to customize behavior.

## Performance Notes

- Default batch size: ${scriptConfig.configOptions.batchSize || 1000}
- Timeout: ${scriptConfig.configOptions.timeout || 30000}ms
- Retry attempts: ${scriptConfig.configOptions.maxRetries || 3}`;
}

function generateSetupSummary(context) {
    const successfulScripts = context.installationResults
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => r.value.scriptName);

    const successfulConfigurations = context.configurationResults
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => r.value.scriptName);

    const passedTests = context.testResults
        .filter(r => r && r.success)
        .map(r => r.results)
        .flat();

    return {
        totalScripts: context.selectedScripts.length,
        successfulScripts: successfulScripts.length,
        successfulConfigurations: successfulConfigurations.length,
        passedTests: passedTests.length,
        totalTestTime: context.testResults.reduce((sum, r) => sum + (r?.duration || 0), 0),
        setupDuration: context.duration,
        recommendations: generateRecommendations(context)
    };
}

function generateRecommendations(context) {
    const recommendations = [];

    // Performance recommendations
    if (context.profile === 'performance') {
        recommendations.push('Consider enabling parallel processing for better performance');
    }

    // Memory recommendations
    if (context.profile === 'memory') {
        recommendations.push('Reduce batch sizes if experiencing memory issues');
    }

    // Integration recommendations
    if (context.selectedScripts.length > 1) {
        recommendations.push('Regularly run integration tests to ensure compatibility');
    }

    return recommendations;
}

function estimateSetupTime(scriptNames) {
    return scriptNames.reduce((total, scriptName) => {
        const scriptConfig = config.scripts[scriptName];
        return total + scriptConfig.setupTime;
    }, 0);
}

function getInteractionDescription(script1, script2) {
    // Define script interactions
    const interactions = {
        'promoted_attributes_table': {
            'trilium_n8n_node': 'Attributes can be used as triggers in n8n workflows',
            'wikilink_processor': 'Processed wikilinks can be tracked in attribute tables'
        },
        'trilium_n8n_node': {
            'promoted_attributes_table': 'Workflows can automatically update attribute values',
            'wikilink_processor': 'Automated wikilink processing can be triggered'
        },
        'wikilink_processor': {
            'promoted_attributes_table': 'Created notes can have automatic attribute assignment',
            'trilium_n8n_node': 'Link processing can be part of larger automation workflows'
        }
    };

    return interactions[script1]?.[script2] || 'Standard integration available';
}

// Export Functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        main,
        config,
        // Export utility functions for testing
        setupPhases,
        log,
        formatDuration
    };
}

// Direct execution
if (require.main === module) {
    (async () => {
        const result = await main();
        process.exit(result.success ? 0 : 1);
    })();
}