# {Project Name}

{Short description of what this script does}

## 🚀 Quick Start

### Installation

1. **Create a new note** in Trilium Notes titled "Script Name"
2. **Copy the script** into the note content
3. **Set note type** to "JavaScript Backend"
4. **Execute the script** by running the following command in your browser console:

```javascript
// Execute from browser console or directly in the note
await require('/path/to/note').main();
```

### Basic Usage

```javascript
// Run the script with default configuration
const result = await main();
console.log(result);

// With custom configuration
const config = {
    debugMode: true,
    batchSize: 500
};
const result = await main();
```

## 📋 Features

{Key features of the script}

- **Feature 1**: Description of what this feature does
- **Feature 2**: Description of what this feature does
- **Feature 3**: Description of what this feature does
- **Performance**: Optimized for large databases (tested with X notes)
- **Safety**: Read-only operations by default, safe for production use

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debugMode` | Boolean | `false` | Enable verbose logging |
| `logLevel` | String | `'info'` | Logging level: debug, info, warn, error |
| `batchSize` | Number | `1000` | Number of items to process per batch |
| `maxRetries` | Number | `3` | Maximum retry attempts for failed operations |
| `timeout` | Number | `30000` | Operation timeout in milliseconds |
| `includeArchived` | Boolean | `false` | Include archived notes in processing |
| `processChildren` | Boolean | `true` | Process child notes |
| `outputFormat` | String | `'table'` | Output format: table, list, json |
| `customOption` | String | `'default_value'` | Custom option description |

## 🎯 Use Cases

### Basic Use Case

{Describe a common use scenario with example code}

```javascript
// Example of basic usage
const result = await main();
console.log(`Processed ${result.processedCount} items`);
```

### Advanced Use Case

{Describe an advanced use scenario with example code}

```javascript
// Example of advanced usage
const advancedConfig = {
    debugMode: true,
    batchSize: 100,
    outputFormat: 'json'
};

const result = await main();
console.log('Advanced processing complete:', result);
```

## 🔧 Technical Details

### Requirements

- **Trilium Notes**: Version 0.60.0 or later
- **JavaScript**: ES6+ features supported
- **Memory**: Minimum 512MB RAM for large databases
- **Storage**: Sufficient space for processing temporary data

### Performance

- **Small databases** (< 1,000 notes): < 1 second
- **Medium databases** (1,000 - 10,000 notes): 1-5 seconds
- **Large databases** (10,000 - 50,000 notes): 5-30 seconds
- **Very large databases** (50,000+ notes): 30+ seconds

### API Calls

{List of Trilium API calls made by this script}

- `api.getNotes()`: Retrieves notes for processing
- `api.createNote()`: Creates new notes
- `api.updateNote()`: Updates existing notes
- `api.deleteNote()`: Safely deletes notes
- `api.searchNotes()`: Advanced search functionality

### Error Handling

The script includes comprehensive error handling:

- Graceful degradation when individual items fail
- Automatic retry mechanism for transient errors
- Detailed logging for troubleshooting
- Safe operations that don't modify data unless intended

## 📊 Examples

### Example 1: Basic Processing

```javascript
// Run the script with default settings
const result = await main();

if (result.success) {
    console.log(`✅ Successfully processed ${result.processedCount} items`);
} else {
    console.log(`❌ Error: ${result.error}`);
}
```

### Example 2: Custom Configuration

```javascript
// Override configuration before execution
const config = {
    debugMode: true,
    batchSize: 500,
    logLevel: 'debug'
};

const result = await main();
console.log('Processing result:', result);
```

### Example 3: Integration with Other Scripts

```javascript
// Use functions in other Trilium scripts
const { main, getNotes, updateConfig } = require('/path/to/script');

// Configure for specific use case
updateConfig({ batchSize: 200 });

// Get notes and process them
const notes = await getNotes({ limit: 100 });
const result = await processData(notes);
```

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Script takes too long to execute" | Reduce `batchSize` in configuration |
| "Memory issues with large databases" | Process notes in smaller batches |
| "Permission denied errors" | Ensure script has proper API access |
| "Notes not found in search" | Check `includeArchived` setting |
| "Performance slow" | Enable `debugMode` to identify bottlenecks |

### Debug Mode

Enable debug mode for detailed troubleshooting:

```javascript
const config = { debugMode: true };
const result = await main();
```

Debug mode provides:
- Detailed operation logs
- Performance metrics
- Error stack traces
- Database query information

### Performance Optimization

1. **Batch Processing**: Use appropriate `batchSize` for your system
2. **Memory Management**: Process large datasets in chunks
3. **Caching**: Reuse results when possible
4. **Parallel Processing**: Consider async operations for independent tasks

## 📈 Monitoring and Logging

The script provides comprehensive logging through multiple channels:

### Console Output

```javascript
// Enable debug logging
const config = { logLevel: 'debug' };
const result = await main();
```

### Log Levels

- **debug**: Detailed technical information
- **info**: General execution information
- **warn**: Non-critical warnings
- **error**: Critical errors that need attention

### Performance Metrics

The script tracks and reports:
- Processing time per operation
- Number of items processed
- Success/failure rates
- Memory usage statistics

## 🎉 Results

### Output Format

The script provides structured output in various formats:

#### Table Format (Default)

```
┌─────────┬─────────────┬─────────────────┐
│ Status  │ Description │ Count          │
├─────────┼─────────────┼─────────────────┤
│ Success │ Processed   │ 1,234          │
│ Warning │ Failed      │ 2              │
│ Error   │ Critical    │ 0              │
└─────────┴─────────────┴─────────────────┘
```

#### JSON Format

```json
{
  "success": true,
  "processedCount": 1234,
  "results": [...],
  "timestamp": "2023-10-18T12:00:00.000Z"
}
```

## 🔄 Updates and Maintenance

### Version History

- **1.0.0** - Initial release
- **1.1.0** - Performance improvements and bug fixes
- **1.2.0** - Additional configuration options

### Future Enhancements

Planned improvements:
- [ ] Additional output formats
- [ ] Performance optimizations
- [ ] Enhanced error recovery
- [ ] Integration with external services
- [ ] Automated testing suite

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Standards

- Follow the existing code style
- Include comprehensive comments
- Add error handling
- Update documentation
- Test thoroughly

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙋 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [Trilium documentation](https://github.com/zadam/trilium)
3. Open an issue on GitHub
4. Join the Trilium community discussions

---

**Happy Trilium scripting!** 🚀

*Last Updated: {Date}*