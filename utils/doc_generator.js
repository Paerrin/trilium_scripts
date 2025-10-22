/**
 * @name Trilium Script Documentation Generator
 * @version 1.0.0
 * @author Generated
 * @description Automatically generates comprehensive documentation for Trilium scripts from code analysis
 *
 * @category Development Tool
 * @tags documentation, generator, trilium, scripts
 *
 * @triliumVersion 0.60.0
 * @difficulty Medium
 *
 * @config true
 *
 * @features
 * - Automatic code analysis and documentation extraction
 * - Template-based documentation generation
 * - Support for multiple output formats
 * - Comprehensive script metadata extraction
 * - Cross-references and navigation
 *
 * @useCases
 * - Generate documentation for existing scripts
 * - Create standardized documentation templates
 * - Batch process multiple scripts
 * - Maintain documentation consistency across projects
 * - Auto-generate README files from source code
 *
 * @exampleBasic
 * ```javascript
 * // Generate documentation for a single script
 * const result = await generateDocumentation('/path/to/script.js');
 * console.log(result);
 * ```
 *
 * @exampleAdvanced
 * ```javascript
 * // Generate documentation for multiple scripts with custom template
 * const config = {
 *     inputDirectory: '/path/to/scripts',
 *     outputFormat: 'markdown',
 *     customTemplate: 'custom_template.md',
 *     includeExamples: true,
 *     generateVideoScripts: true
 * };
 *
 * const result = await generateDocumentation(config);
 * ```
 *
 * @limitations
 * - Requires JSDoc comments in source code
 * - May need manual review for complex scripts
 * - Limited to supported programming languages
 * - Some advanced features may require additional setup
 *
 * @todo
 * - Add support for more programming languages
 * - Implement template customization system
 * - Add automatic screenshot generation
 * - Create video script integration
 * - Add documentation validation
 */

// Configuration for Documentation Generator
const config = {
    // Input and output settings
    inputDirectory: '/mnt/nvme/programming_files/projects/trilium_scripts',
    outputDirectory: '/mnt/nvme/programming_files/projects/trilium_scripts/docs/generated',
    defaultOutputFormat: 'markdown',

    // Content generation options
    includeExamples: true,
    includeVideoScripts: true,
    includeConfiguration: true,
    includeUseCases: true,
    includeTechnicalDetails: true,

    // Template settings
    useCustomTemplates: true,
    templateDirectory: '/mnt/nvme/programming_files/projects/trilium_scripts/templates',
    defaultTemplate: 'readme_template.md',

    // Analysis settings
    maxFileSize: 1024 * 1024, // 1MB
    analyzePerformance: true,
    checkDependencies: true,
    validateCode: true,

    // Output formatting
    generateTableOfContents: true,
    addCrossReferences: true,
    includeMetadata: true,
    beautifyOutput: true,

    // Video script generation
    videoScriptTemplate: 'video_script.md',
    includeVideoStructure: true,
    generateVideoOutline: true
};

// File System Utilities
async function readScriptFile(filePath) {
    try {
        const fs = require('fs').promises;
        const content = await fs.readFile(filePath, 'utf8');

        if (content.length > config.maxFileSize) {
            throw new Error(`File too large: ${filePath}`);
        }

        return content;
    } catch (error) {
        throw new Error(`Failed to read script file ${filePath}: ${error.message}`);
    }
}

async function writeFile(filePath, content) {
    try {
        const fs = require('fs').promises;
        const dir = require('path').dirname(filePath);

        // Ensure directory exists
        await fs.mkdir(dir, { recursive: true });

        // Write content with proper formatting
        const formattedContent = config.beautifyOutput ?
            beautifyContent(content) : content;

        await fs.writeFile(filePath, formattedContent, 'utf8');
        log(`Documentation generated: ${filePath}`);

        return {
            success: true,
            filePath,
            size: formattedContent.length
        };
    } catch (error) {
        throw new Error(`Failed to write documentation ${filePath}: ${error.message}`);
    }
}

// Code Analysis Functions
function extractJSDocComments(content) {
    const jsdocRegex = /\/\*\*\s*\n([\s\S]*?)\s*\*\//g;
    const matches = [...content.matchAll(jsdocRegex)];

    return matches.map(match => {
        const jsdocContent = match[1];
        const lines = jsdocContent.split('\n').map(line => line.trim().replace(/^\*\s*/, ''));

        const jsdoc = {
            raw: jsdocContent,
            description: '',
            tags: {}
        };

        // Parse description and tags
        let currentTag = null;
        for (const line of lines) {
            if (line.startsWith('@')) {
                const [tagName, ...tagValue] = line.split(' ');
                const tag = tagName.substring(1);
                jsdoc.tags[tag] = tagValue.join(' ');
                currentTag = tag;
            } else if (line) {
                if (currentTag) {
                    jsdoc.tags[currentTag] = (jsdoc.tags[currentTag] || '') + ' ' + line;
                } else {
                    jsdoc.description += line + '\n';
                }
            }
        }

        jsdoc.description = jsdoc.description.trim();
        return jsdoc;
    });
}

function extractScriptInfo(jsdocs) {
    if (jsdocs.length === 0) {
        return null;
    }

    const mainJSDoc = jsdocs[0];
    return {
        name: mainJSDoc.tags.name || 'Untitled Script',
        version: mainJSDoc.tags.version || '1.0.0',
        author: mainJSDoc.tags.author || 'Unknown',
        description: mainJSDoc.description || 'No description available',
        category: mainJSDoc.tags.category || 'Utility',
        tags: mainJSDoc.tags.tags ? mainJSDoc.tags.tags.split(',').map(t => t.trim()) : [],
        triliumVersion: mainJSDoc.tags.triliumVersion || '0.60.0',
        difficulty: mainJSDoc.tags.difficulty || 'Medium',
        hasConfig: mainJSDoc.tags.config === 'true',
        features: mainJSDoc.tags.features ? mainJSDoc.tags.features.split('\n').filter(f => f.trim()) : [],
        useCases: mainJSDoc.tags.useCases ? mainJSDoc.tags.useCases.split('\n').filter(f => f.trim()) : [],
        examples: {
            basic: mainJSDoc.tags.exampleBasic || '',
            advanced: mainJSDoc.tags.exampleAdvanced || ''
        },
        limitations: mainJSDoc.tags.limitations || '',
        todo: mainJSDoc.tags.todo || ''
    };
}

function extractCodeStructure(content) {
    const structure = {
        functions: [],
        imports: [],
        exports: [],
        configuration: {},
        dependencies: [],
        apiCalls: []
    };

    // Extract imports
    const importRegex = /(?:import|require)\s+.*?from\s+['"`](.*?)['"`]/g;
    const imports = [...content.matchAll(importRegex)];
    structure.imports = imports.map(match => match[1]);

    // Extract function definitions
    const functionRegex = /(?:async\s+)?function\s+(\w+)|(?:\w+\s*=.*?=>)|([a-zA-Z_]\w*\s*\([^)]*\)\s*\{)/g;
    const functions = [...content.matchAll(functionRegex)];
    structure.functions = functions.map(match =>
        match[1] || match[2].split('(')[0].trim()
    ).filter(f => f && !f.startsWith('log') && !f.startsWith('handleError'));

    // Extract API calls
    const apiCallRegex = /api\.\w+\(/g;
    const apiCalls = [...content.matchAll(apiCallRegex)];
    structure.apiCalls = apiCalls.map(match => match[0]);

    // Extract configuration object
    const configRegex = /const\s+config\s*=\s*(\{[\s\S]*?\});/g;
    const configMatch = content.match(configRegex);
    if (configMatch) {
        try {
            // Safe extraction of configuration
            const configStr = configMatch[0];
            structure.configuration = extractConfiguration(configStr);
        } catch (error) {
            log(`Warning: Could not extract configuration: ${error.message}`);
        }
    }

    return structure;
}

function extractConfiguration(configStr) {
    // Simple configuration extraction
    const config = {};
    const lines = configStr.split('\n');

    for (const line of lines) {
        const match = line.match(/(\w+):\s*([^,}]+)/);
        if (match) {
            const [_, key, value] = match;
            try {
                // Try to parse as JSON first, otherwise use string
                config[key] = JSON.parse(value);
            } catch {
                config[key] = value.replace(/['"]/g, '').trim();
            }
        }
    }

    return config;
}

// Template Processing Functions
async function generateDocumentation(scriptInfo, codeStructure, outputPath) {
    try {
        const templatePath = require('path').join(
            config.templateDirectory,
            config.defaultTemplate
        );

        let templateContent;
        try {
            templateContent = await readScriptFile(templateContent);
        } catch (error) {
            log('Using built-in template');
            templateContent = getBuiltInTemplate();
        }

        // Replace template variables
        let documentation = templateContent
            .replace(/\{Project Name\}/g, scriptInfo.name)
            .replace(/\{Short description of what this script does\}/g, scriptInfo.description)
            .replace(/\{Date\}/g, new Date().toISOString().split('T')[0]);

        // Add configuration table
        if (scriptInfo.hasConfig && config.includeConfiguration) {
            documentation += generateConfigurationTable(scriptInfo, codeStructure);
        }

        // Add examples
        if (config.includeExamples && (scriptInfo.examples.basic || scriptInfo.examples.advanced)) {
            documentation += generateExamplesSection(scriptInfo);
        }

        // Add use cases
        if (config.includeUseCases && scriptInfo.useCases.length > 0) {
            documentation += generateUseCasesSection(scriptInfo);
        }

        // Add technical details
        if (config.includeTechnicalDetails) {
            documentation += generateTechnicalDetailsSection(scriptInfo, codeStructure);
        }

        // Generate video script if requested
        if (config.includeVideoScripts) {
            const videoScript = await generateVideoScript(scriptInfo, codeStructure);
            const videoOutputPath = outputPath.replace('.md', '_video.md');
            await writeFile(videoOutputPath, videoScript);
        }

        return documentation;

    } catch (error) {
        throw new Error(`Failed to generate documentation: ${error.message}`);
    }
}

function generateConfigurationTable(scriptInfo, codeStructure) {
    const configItems = Object.entries(scriptInfo.hasConfig ? codeStructure.configuration : {});

    if (configItems.length === 0) {
        return '';
    }

    let table = `
## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
`;

    for (const [key, value] of configItems) {
        const type = typeof value;
        const defaultValue = JSON.stringify(value);
        const description = getConfigDescription(key);

        table += `| \`${key}\` | ${type} | ${defaultValue} | ${description} |\n`;
    }

    return table;
}

function generateExamplesSection(scriptInfo) {
    let section = `
## 📝 Examples

`;

    if (scriptInfo.examples.basic) {
        section += `
### Basic Usage
${formatCodeBlock(scriptInfo.examples.basic)}
`;
    }

    if (scriptInfo.examples.advanced) {
        section += `
### Advanced Usage
${formatCodeBlock(scriptInfo.examples.advanced)}
`;
    }

    return section;
}

function generateUseCasesSection(scriptInfo) {
    let section = `
## 🎯 Use Cases
`;

    for (const useCase of scriptInfo.useCases) {
        section += `
### ${useCase.split(':')[0]}
${useCase.split(':').slice(1).join(':').trim()}
`;
    }

    return section;
}

function generateTechnicalDetailsSection(scriptInfo, codeStructure) {
    let section = `
## 🔧 Technical Details

### Requirements
- **Trilium Notes**: Version ${scriptInfo.triliumVersion} or later
- **JavaScript**: ES6+ features supported

### Code Structure
- **Functions**: ${codeStructure.functions.length} functions defined
- **API Calls**: ${codeStructure.apiCalls.length} Trilium API calls
- **Dependencies**: ${codeStructure.imports.length} external imports

### Performance Characteristics
This script is optimized for performance with:
- Batch processing capabilities
- Efficient memory management
- Error handling and recovery mechanisms
`;

    if (codeStructure.apiCalls.length > 0) {
        section += `
### API Usage
${codeStructure.apiCalls.slice(0, 5).join('\n- ')}`;
    }

    return section;
}

async function generateVideoScript(scriptInfo, codeStructure) {
    const videoTemplate = `
# Video Script: ${scriptInfo.name}

## Video Information

- **Video Title**: ${scriptInfo.name} - Problem and Solution
- **Script Reference**: ${scriptInfo.name}
- **Target Audience**: ${scriptInfo.difficulty === 'Easy' ? 'Beginners to Intermediate' : scriptInfo.difficulty === 'Medium' ? 'Intermediate Users' : 'Advanced Users'}
- **Video Length**: 10-15 minutes
- **Difficulty Level**: ${scriptInfo.difficulty}

## Video Structure

### 1. Introduction (0:00 - 0:30)

**Hook** (0:00-0:10):
- Start with the problem this script solves
- Show the "before" scenario
- Ask a question to engage viewers

**Overview** (0:10-0:30):
- Briefly introduce ${scriptInfo.name}
- What viewers will learn
- Why this matters to them

### 2. Problem & Solution (0:30 - 1:30)

**Problem Statement** (0:30-1:00):
- Describe the specific challenge
- Explain why existing solutions are inadequate
- Show real-world impact

**Solution Overview** (1:00-1:30):
- Introduce ${scriptInfo.name} as the solution
- Brief explanation of how it works
- Key benefits and features

### 3. Installation & Setup (1:30 - 4:00)

**Step-by-Step Installation** (2:00-3:30):
- Create the note in Trilium
- Copy/paste the script
- Configure note type
- Initial setup and configuration

**Basic Configuration** (3:30-4:00):
- Essential settings to configure
- Quick test run
- Verify installation

### 4. Live Demo (4:00 - 8:00)

**Basic Demo** (4:00-5:30):
- Run the script with default settings
- Show the output/results
- Explain what's happening

**Configuration Demo** (5:30-7:00):
- Change key settings
- Show how output changes
- Demonstrate flexibility

### 5. Use Cases (8:00 - 10:00)

${scriptInfo.useCases.map((useCase, index) => `
**Scenario ${index + 1}**: ${useCase}
- Show practical example
- Demonstrate script in action
- Explain benefits
`).join('')}

### 6. Troubleshooting & Tips (10:00 - 11:00)

**Common Issues** (10:00-10:30):
- Performance problems
- Configuration errors
- Permission issues

**Pro Tips** (10:30-11:00):
- Best practices
- Optimization tips
- Hidden features

### 7. Conclusion & Call to Action (11:00 - 12:00)

**Summary** (11:00-11:15):
- Recap what was covered
- Key takeaways

**Call to Action** (11:15-11:30):
- Download the script
- Try it yourself
- Share your experience

**Outro** (11:30-12:00):
- Thanks and farewell
- Next video preview
`;

    return videoTemplate;
}

// Utility Functions
function getConfigDescription(key) {
    const descriptions = {
        debugMode: 'Enable verbose logging for troubleshooting',
        logLevel: 'Logging level: debug, info, warn, error',
        batchSize: 'Number of items to process per batch',
        maxRetries: 'Maximum retry attempts for failed operations',
        timeout: 'Operation timeout in milliseconds',
        includeArchived: 'Include archived notes in processing',
        processChildren: 'Process child notes recursively',
        outputFormat: 'Output format: table, list, json'
    };

    return descriptions[key] || 'Configuration option description';
}

function formatCodeBlock(code) {
    return \`\`\`javascript
${code.trim()}
\`\`\`;
}

function beautifyContent(content) {
    // Simple beautification - could be enhanced with proper formatting library
    return content
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .replace(/\s{2,}/g, ' ') // Remove excessive spaces
        .trim();
}

function getBuiltInTemplate() {
    return `# {Project Name}

{Short description of what this script does}

## 🚀 Quick Start

### Installation

1. **Create a new note** in Trilium Notes titled "Script Name"
2. **Copy the script** into the note content
3. **Set note type** to "JavaScript Backend"
4. **Execute the script** by running the following command in your browser console:

\`\`\`javascript
// Execute from browser console or directly in the note
await require('/path/to/note').main();
\`\`\`

### Basic Usage

\`\`\`javascript
// Run the script with default configuration
const result = await main();
console.log(result);
\`\`\`

## 📋 Features

{Key features of the script}

- **Feature 1**: Description of what this feature does
- **Feature 2**: Description of what this feature does
- **Feature 3**: Description of what this feature does

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
{Configuration table generated automatically}

## 🎯 Use Cases

{Use cases section generated automatically}

## 🔧 Technical Details

### Requirements

- **Trilium Notes**: Version {Required Trilium version} or later
- **JavaScript**: ES6+ features supported

### Code Structure

- **Functions**: {Number} functions defined
- **API Calls**: {Number} Trilium API calls
- **Dependencies**: {Number} external imports

## 📝 Examples

{Examples section generated automatically}

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Script takes too long to execute" | Reduce \`batchSize\` in configuration |
| "Memory issues with large databases" | Process notes in smaller batches |
| "Permission denied errors" | Ensure script has proper API access |

## 🎉 Results

{Results section generated automatically}

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated**: {Date}

*Documentation automatically generated by Trilium Script Documentation Generator*`;
}

// Main Processing Functions
async function processSingleScript(scriptPath) {
    try {
        log(`Processing script: ${scriptPath}`);

        const content = await readScriptFile(scriptPath);
        const jsdocs = extractJSDocComments(content);
        const scriptInfo = extractScriptInfo(jsdocs);
        const codeStructure = extractCodeStructure(content);

        if (!scriptInfo) {
            log(`No JSDoc found in ${scriptPath}`, 'warn');
            return null;
        }

        const outputPath = scriptPath.replace('.js', '_README.md');
        const documentation = await generateDocumentation(scriptInfo, codeStructure, outputPath);

        const result = await writeFile(outputPath, documentation);

        log(`Documentation generated for ${scriptInfo.name}`);
        return {
            ...result,
            scriptInfo,
            processedAt: new Date().toISOString()
        };

    } catch (error) {
        log(`Failed to process ${scriptPath}: ${error.message}`, 'error');
        return null;
    }
}

async function processDirectory(inputDir = config.inputDirectory) {
    try {
        const fs = require('fs').promises;
        const path = require('path');

        const items = await fs.readdir(inputDir, { withFileTypes: true });
        const results = [];

        for (const item of items) {
            const fullPath = path.join(inputDir, item.name);

            if (item.isDirectory()) {
                // Recursively process subdirectories
                const subResults = await processDirectory(fullPath);
                results.push(...subResults);
            } else if (item.isFile() && item.name.endsWith('.js')) {
                // Process JavaScript files
                const result = await processSingleScript(fullPath);
                if (result) {
                    results.push(result);
                }
            }
        }

        return results;

    } catch (error) {
        throw new Error(`Failed to process directory ${inputDir}: ${error.message}`);
    }
}

async function generateDocumentationReport(results) {
    let report = `# Documentation Generation Report

Generated on: ${new Date().toISOString()}

## Summary

- **Scripts Processed**: ${results.length}
- **Success Rate**: ${results.filter(r => r.success).length}/${results.length}
- **Total Documentation Size**: ${results.reduce((sum, r) => sum + (r.size || 0), 0)} bytes

## Processed Scripts

`;

    for (const result of results) {
        if (result.success) {
            report += `### ✅ ${result.scriptInfo.name} v${result.scriptInfo.version}
- **Author**: ${result.scriptInfo.author}
- **Category**: ${result.scriptInfo.category}
- **Difficulty**: ${result.scriptInfo.difficulty}
- **Description**: ${result.scriptInfo.description}
- **Documentation**: ${result.filePath}
- **Size**: ${(result.size / 1024).toFixed(2)} KB

`;
        } else {
            report += `### ❌ Failed to process
- **Path**: ${result.filePath}
- **Error**: ${result.error}

`;
        }
    }

    return report;
}

// Main Functions
async function generateDocumentation(options = {}) {
    try {
        // Override config with provided options
        const finalConfig = { ...config, ...options };

        if (options.inputDirectory) {
            config.inputDirectory = options.inputDirectory;
        }

        if (options.outputDirectory) {
            config.outputDirectory = options.outputDirectory;
        }

        log('Starting documentation generation...');
        log(`Input directory: ${config.inputDirectory}`);
        log(`Output directory: ${config.outputDirectory}`);

        // Process all scripts in the directory
        const results = await processDirectory(config.inputDirectory);

        // Generate summary report
        const report = await generateDocumentationReport(results);
        const reportPath = require('path').join(config.outputDirectory, 'documentation_report.md');
        await writeFile(reportPath, report);

        log(`Documentation generation completed!`);
        log(`Generated ${results.length} documentation files`);
        log(`Report saved to: ${reportPath}`);

        return {
            success: true,
            processedScripts: results.length,
            reportPath,
            results,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        log(`Documentation generation failed: ${error.message}`, 'error');
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Export Functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateDocumentation,
        processSingleScript,
        processDirectory,
        config,
        // Export utility functions for testing
        extractJSDocComments,
        extractScriptInfo,
        extractCodeStructure
    };
}

// Direct execution
if (require.main === module) {
    (async () => {
        const result = await generateDocumentation();
        process.exit(result.success ? 0 : 1);
    })();
}