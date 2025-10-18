# Trilium Wikilink Processor

A powerful JavaScript backend script for Trilium Notes that processes markdown-style `[[wikilinks]]` and converts them to native Trilium internal links (`~noteId`). This script enhances Trilium's existing backlink system by providing Obsidian-like wikilink functionality.

## ✨ Features

- **Smart Link Resolution**: Finds existing notes by title with optional fuzzy matching
- **Automatic Note Creation**: Creates new notes for orphaned wikilinks
- **Native Integration**: Converts to Trilium's `~noteId` format, preserving backlink functionality
- **Batch Processing**: Efficiently processes large numbers of notes
- **Flexible Configuration**: Extensive customization options
- **Comprehensive Reporting**: Detailed processing reports with statistics
- **Error Handling**: Robust error handling with detailed logging
- **Performance Optimized**: Batches queries and uses efficient SQL operations

## 🚀 Installation

1. **Create a Backend Script Note**
   - In Trilium, create a new note
   - Set the note type to **"JS Backend"**
   - Copy the entire `wikilink-processor.js` script into the note

2. **Configure the Script**
   - Review and modify the `WIKILINK_CONFIG` object as needed
   - See [Configuration](#configuration) section for details

3. **Run the Script**
   - Execute manually: Press `Ctrl+Enter` in the script note
   - Or add scheduling labels:
     - `#run=hourly` - Run every hour
     - `#run=daily` - Run daily
     - `#run=onNoteCreation` - Run when notes are created

## 📝 Supported Wikilink Formats

The processor supports several wikilink formats:

```markdown
# Basic wikilink
[[Project Plan]]

# With display alias
[[Project Plan|My Project]]

# With heading reference
[[Project Plan#Timeline]]

# Combined alias and heading
[[Project Plan#Timeline|Schedule]]
```

## ⚙️ Configuration

Key configuration options in `WIKILINK_CONFIG`:

### Processing Settings
```javascript
{
    enabled: true,                    // Enable/disable the processor
    processOnCreation: true,          // Process notes on creation
    processOnUpdate: true,            // Process notes on update
    dryRun: false,                    // Run without making changes
    generateReport: true              // Generate processing reports
}
```

### Link Resolution
```javascript
{
    fuzzySearch: true,                // Enable fuzzy title matching
    caseSensitive: false,             // Case sensitivity in matching
    minMatchScore: 0.6,              // Minimum similarity score (0.0-1.0)
    maxSearchResults: 5               // Max results for ambiguous matches
}
```

### Note Creation
```javascript
{
    autoCreateOrphanedLinks: true,    // Create notes for unmatched links
    defaultParentForNewNotes: 'root', // Parent for new notes
    defaultTemplateForNewNotes: null  // Template note ID for new notes
}
```

### Performance
```javascript
{
    batchSize: 50,                   // Notes per batch
    maxNotesPerRun: 1000,            // Maximum notes to process
    queryTimeout: 30000              // Database query timeout (ms)
}
```

## 🔧 How It Works

### 1. Wikilink Detection
The script scans note content for `[[wikilinks]]` using regex matching:
- `[[Title]]` - Basic wikilink
- `[[Title|Alias]]` - With display alias
- `[[Title#Heading]]` - With heading reference

### 2. Link Resolution
For each wikilink, the processor:
- **Exact Match**: Searches for notes with exact title match
- **Fuzzy Match**: If no exact match, uses Levenshtein distance for fuzzy matching
- **Score Threshold**: Only accepts matches above `minMatchScore`
- **Best Match**: Selects the highest-scoring match

### 3. Note Creation
If no match is found and `autoCreateOrphanedLinks` is enabled:
- Creates a new note with the wikilink title
- Uses the configured parent note
- Applies optional template
- Adds `createdFromWikilink` label for tracking

### 4. Link Conversion
Converts wikilinks to Trilium's native format:
- **Internal Format**: `~noteId` (default)
- **Markdown Format**: `[Title](~noteId)` (optional)
- **Preserves Original**: Comments with original `[[wikilink]]` (optional)

## 📊 Processing Reports

The script generates comprehensive HTML reports that include:
- **Summary Statistics**: Notes processed, wikilinks found, notes created
- **Configuration Display**: Current settings snapshot
- **Detailed Results**: Per-note processing information
- **Error Tracking**: Any errors encountered during processing
- **Performance Metrics**: Execution time and processing speed

## 🎯 Use Cases

### 1. Migrating from Obsidian
Perfect for users transitioning from Obsidian to Trilium who want to maintain their wikilink workflow.

### 2. Knowledge Base Management
Maintain interconnected knowledge bases with intuitive linking syntax.

### 3. Project Documentation
Create linked project documentation that's easy to navigate and maintain.

### 4. Research Notes
Build research networks with automatic link creation between related concepts.

## 🔍 Examples

### Before Processing
```markdown
# Project Overview

This project connects to [[Research Notes]] and references the [[Timeline|Milestones]].

We also need to check the [[Technical Requirements#Security]] section.
```

### After Processing
```markdown
# Project Overview

This project connects to ~abc123xyz and references the [Milestones](~def456uvw).

We also need to check the ~ghi789rst#Security section.

<!-- Original wikilinks preserved as comments -->
```

## ⚡ Performance Considerations

- **Batch Processing**: Processes notes in configurable batches to prevent memory issues
- **SQL Optimization**: Uses efficient queries with proper indexing
- **Parallel Processing**: Processes batches concurrently for better performance
- **Configurable Limits**: Adjustable batch sizes and processing limits

## 🛠️ Advanced Configuration

### Scope Limiting
Limit processing to specific note subtrees:
```javascript
scopeToParentNote: 'yourParentNoteId'  // Only process this subtree
```

### Excluding Notes
Exclude specific notes from processing:
```javascript
excludeNoteIds: ['systemNote1', 'privateNote2']  // Skip these notes
```

### Template Integration
Automatically apply templates to newly created notes:
```javascript
defaultTemplateForNewNotes: 'templateNoteId'  // Use this template
```

## 🐛 Troubleshooting

### Common Issues

1. **No notes being processed**
   - Check `scopeToParentNote` configuration
   - Verify `excludeSystemNotes` setting
   - Ensure `enabled` is `true`

2. **Links not being created**
   - Check if `dryRun` is `false`
   - Verify wikilink syntax in source notes
   - Check processing report for errors

3. **Poor fuzzy matching**
   - Adjust `minMatchScore` (try 0.4-0.8)
   - Enable `caseSensitive` if needed
   - Check note titles for formatting differences

### Debug Mode
Enable verbose logging for troubleshooting:
```javascript
verboseLogging: true  // Detailed processing logs
```

## 📝 Changelog

### v1.0.0
- Initial release
- Basic wikilink parsing and resolution
- Automatic note creation for orphaned links
- Comprehensive reporting system
- Performance optimization with batch processing

## 🤝 Contributing

This script is designed to be extensible. Key areas for enhancement:
- Additional wikilink syntax support
- Advanced fuzzy matching algorithms
- Integration with external note sources
- Custom link transformation rules

## 📄 License

MIT License - feel free to modify and distribute according to your needs.

## 🔗 Related Scripts

This wikilink processor is designed to complement other Trilium enhancement scripts:
- **Promoted Attributes Table**: Visualize structured note attributes
- **Backlink Analysis**: Analyze note relationship patterns
- **Content Indexing**: Create searchable content indexes

---

**Note**: This script builds on Trilium's existing backlink system rather than replacing it. All converted links will work seamlessly with Trilium's native navigation and relationship features.