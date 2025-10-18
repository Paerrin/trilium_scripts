# 🧪 Trilium n8n Community Node - Testing Procedure

## 📋 Overview

This comprehensive testing procedure validates all functionality of the Trilium n8n community node, ensuring reliable operation across all features and integration scenarios.

## 🎯 Testing Objectives

- ✅ Validate all CRUD operations (Create, Read, Update, Delete)
- ✅ Test search functionality with various filters
- ✅ Verify trigger mechanisms and event handling
- ✅ Confirm backup and export operations
- ✅ Test error handling and edge cases
- ✅ Validate API integrations (ETAPI & Backend Script API)
- ✅ Ensure proper data transformation and formatting
- ✅ Test performance under various conditions

## 🏗️ 1. Environment Setup

### Prerequisites Checklist

- [ ] **Trilium Server**: Running Trilium instance (v1.0.0+)
- [ ] **n8n Instance**: n8n workflow automation platform
- [ ] **Node.js**: Version 18.0.0 or higher
- [ ] **npm**: Latest stable version
- [ ] **Git**: For version control and cloning

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd trilium_n8n_node

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Run tests
npm run test
```

## 🔧 2. Unit Testing

### Automated Test Execution

```bash
# Run all unit tests
node src/__tests__/test-runner.js

# Expected output: "🎉 All tests passed!" with 11/11 tests passing
```

### Unit Test Checklist

#### API Client Tests
- [ ] **TriliumBackendApiClient Initialization**
  - [ ] Validates API object requirement
  - [ ] Handles null/undefined API gracefully
  - [ ] Initializes with proper configuration

- [ ] **Note Operations**
  - [ ] `getNote()` returns correct note data
  - [ ] `getNote()` handles non-existent notes
  - [ ] `createNote()` creates notes with all parameters
  - [ ] `createTextNote()` creates text notes correctly
  - [ ] `createDataNote()` handles JSON content
  - [ ] `updateNote()` modifies existing notes
  - [ ] `deleteNote()` removes notes properly

- [ ] **Search Operations**
  - [ ] `searchNotes()` processes query parameters
  - [ ] `getNotesWithLabel()` filters by label name
  - [ ] `getNoteWithLabel()` returns single note
  - [ ] Search respects limit parameters

- [ ] **Utility Operations**
  - [ ] `createBackup()` generates backup files
  - [ ] `exportSubtree()` exports note trees
  - [ ] `getAppInfo()` retrieves server information

#### Data Transformation Tests
- [ ] **Note Attribute Processing**
  - [ ] Converts Trilium attributes to standard format
  - [ ] Handles label and relation attributes
  - [ ] Preserves attribute metadata (position, inheritability)

- [ ] **Error Handling**
  - [ ] Graceful handling of API failures
  - [ ] Proper error message formatting
  - [ ] Network timeout handling

## 🔗 3. API Integration Testing

### ETAPI (HTTP REST API) Testing

#### Server Setup
```bash
# Ensure Trilium server is running with ETAPI enabled
# Default: http://localhost:37840
# API Token: Generate via Trilium Web UI
```

#### API Endpoint Testing Checklist

- [ ] **Authentication**
  - [ ] Server accepts valid API tokens
  - [ ] Rejects requests without authentication
  - [ ] Handles token expiration gracefully

- [ ] **Note Endpoints**
  - [ ] `GET /api/notes/{id}` - Retrieve single note
  - [ ] `POST /api/notes` - Create new note
  - [ ] `PATCH /api/notes/{id}` - Update note
  - [ ] `DELETE /api/notes/{id}` - Delete note

- [ ] **Search Endpoints**
  - [ ] `POST /api/notes/search` - Search functionality
  - [ ] `GET /api/notes/labels/{name}` - Get notes by label
  - [ ] `GET /api/notes/labels/{name}/{value}` - Get notes by label value

- [ ] **Utility Endpoints**
  - [ ] `GET /api/app-info` - Application information
  - [ ] `POST /api/backup` - Create backup
  - [ ] `POST /api/notes/{id}/export` - Export subtree

### Backend Script API Testing

#### Script Environment Setup
```javascript
// Ensure backend scripts can access the global 'api' object
// Test script execution in Trilium's script editor
const testScript = `
  try {
    const testNote = api.createTextNote('test_parent', 'API Test', 'Testing backend API');
    api.log('Backend API test successful');
    return { success: true, noteId: testNote.note.noteId };
  } catch (error) {
    api.log('Backend API test failed: ' + error.message);
    return { success: false, error: error.message };
  }
`;
```

## ⚡ 4. Node Operation Testing

### Individual Node Testing

#### Create Note Node
```bash
# Test Parameters:
{
  "parentNoteId": "root_note_id",
  "title": "Test Note",
  "content": "Test content for validation",
  "noteType": "text",
  "labels": {
    "label": [
      { "name": "test", "value": "true" },
      { "name": "category", "value": "testing" }
    ]
  }
}
```

**Testing Checklist:**
- [ ] Creates note with basic parameters
- [ ] Handles different note types (text, code, data)
- [ ] Processes labels correctly
- [ ] Returns proper response format
- [ ] Handles missing parent note gracefully

#### Read Note Node
```bash
# Test Parameters:
{
  "noteId": "existing_note_id",
  "includeMetadata": true,
  "includeAttributes": true
}
```

**Testing Checklist:**
- [ ] Retrieves note by ID successfully
- [ ] Returns 404 for non-existent notes
- [ ] Includes metadata when requested
- [ ] Handles attribute inclusion properly

#### Update Note Node
```bash
# Test Parameters:
{
  "noteId": "existing_note_id",
  "updateMode": "partial",
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Testing Checklist:**
- [ ] Updates note content successfully
- [ ] Handles partial vs complete updates
- [ ] Archives/unarchives notes properly
- [ ] Manages label addition/removal

#### Delete Note Node
```bash
# Test Parameters:
{
  "noteId": "note_to_delete",
  "deleteMode": "trash",
  "returnNoteInfo": true
}
```

**Testing Checklist:**
- [ ] Moves notes to trash successfully
- [ ] Handles permanent deletion
- [ ] Processes child note deletion
- [ ] Returns appropriate confirmation data

#### Search Node
```bash
# Test Parameters:
{
  "searchQuery": "#test AND #important",
  "includeArchived": false,
  "maxResults": 50,
  "sortBy": "relevance",
  "includeContent": true
}
```

**Testing Checklist:**
- [ ] Processes Trilium search syntax
- [ ] Respects result limits
- [ ] Handles sorting options
- [ ] Includes content preview when requested

#### Trigger Node
```bash
# Test Parameters:
{
  "events": ["noteCreated", "noteModified"],
  "noteTypeFilter": ["text"],
  "pollingInterval": 30,
  "includeContent": true
}
```

**Testing Checklist:**
- [ ] Detects note creation events
- [ ] Responds to note modifications
- [ ] Filters by note type correctly
- [ ] Handles polling intervals properly

#### Backup Node
```bash
# Test Parameters:
{
  "backupName": "test-backup-{{ $now.format('YYYY-MM-DD') }}",
  "backupType": "full",
  "compression": "gzip"
}
```

**Testing Checklist:**
- [ ] Creates backup files successfully
- [ ] Generates proper file names
- [ ] Handles compression options
- [ ] Returns backup metadata

#### Export Node
```bash
# Test Parameters:
{
  "exportSource": "singleNote",
  "noteId": "note_to_export",
  "exportFormat": "html",
  "outputFilePath": "/tmp/export.html"
}
```

**Testing Checklist:**
- [ ] Exports single notes correctly
- [ ] Handles subtree exports
- [ ] Generates proper file formats
- [ ] Includes attachments when requested

## 🔄 5. Integration Testing

### Workflow Testing Scenarios

#### Scenario 1: Complete Note Lifecycle
```bash
# Test workflow that creates, reads, updates, and deletes a note
{
  "workflow": [
    { "node": "createNote", "test": "note_creation" },
    { "node": "readNote", "test": "note_retrieval" },
    { "node": "updateNote", "test": "note_modification" },
    { "node": "deleteNote", "test": "note_deletion" }
  ]
}
```

#### Scenario 2: Search and Archive
```bash
# Test workflow that searches for old notes and archives them
{
  "workflow": [
    { "node": "searchNotes", "test": "old_note_search" },
    { "node": "updateNote", "test": "note_archiving" }
  ]
}
```

#### Scenario 3: Automated Backup
```bash
# Test automated backup creation and validation
{
  "workflow": [
    { "node": "backup", "test": "backup_creation" },
    { "node": "moveFile", "test": "backup_storage" }
  ]
}
```

## 🚨 6. Error Handling Testing

### Error Scenario Checklist

#### Network Errors
- [ ] **Connection Timeout**: Server unreachable for 30+ seconds
- [ ] **DNS Resolution**: Invalid hostname resolution
- [ ] **Port Blocking**: Firewall blocking Trilium port

#### Authentication Errors
- [ ] **Invalid Token**: Expired or malformed API token
- [ ] **Missing Credentials**: No authentication provided
- [ ] **Permission Denied**: Insufficient privileges for operation

#### Data Validation Errors
- [ ] **Invalid Note ID**: Malformed or non-existent note identifier
- [ ] **Missing Required Fields**: Title, content, or parent note missing
- [ ] **Invalid Parameters**: Wrong data types or out-of-range values

#### API Errors
- [ ] **Server 500**: Internal server errors
- [ ] **Server 404**: Resource not found
- [ ] **Server 429**: Rate limiting triggered
- [ ] **Server 503**: Service unavailable

## ⚡ 7. Performance Testing

### Load Testing Checklist

#### Concurrent Operations
- [ ] **Multiple Creates**: 10 simultaneous note creations
- [ ] **Bulk Search**: Search operations with large datasets
- [ ] **Batch Updates**: Multiple note modifications concurrently

#### Data Volume Testing
- [ ] **Large Content**: Notes with 10MB+ content
- [ ] **Many Labels**: Notes with 50+ labels/attributes
- [ ] **Deep Trees**: Note trees with 10+ levels depth

#### Memory Usage
- [ ] **Search Results**: Handling 1000+ search results
- [ ] **Export Operations**: Large subtree exports
- [ ] **Backup Creation**: Full database backups

## 📊 8. Manual Testing Checklist

### Visual Validation
- [ ] **n8n UI Integration**: Nodes appear correctly in palette
- [ ] **Parameter Forms**: All input fields render properly
- [ ] **Error Messages**: Clear error display in workflow editor

### Workflow Validation
- [ ] **Node Connections**: Proper input/output connections
- [ ] **Data Flow**: Information passes between nodes correctly
- [ ] **Execution History**: Workflow execution logs accessible

### User Experience
- [ ] **Intuitive Parameters**: Clear, self-explanatory input fields
- [ ] **Helpful Descriptions**: Useful tooltips and documentation
- [ ] **Error Recovery**: Graceful handling of user mistakes

## 🔍 9. Debugging Procedures

### Logging Verification
```bash
# Check n8n logs for node execution
tail -f /path/to/n8n/logs/n8n.log | grep -i trilium

# Check Trilium logs for API calls
tail -f /path/to/trilium/logs/trilium.log
```

### Debug Mode Testing
```bash
# Enable debug logging in n8n
export N8N_LOG_LEVEL=debug
export N8N_LOG_OUTPUT=console

# Run test workflow with verbose output
n8n execute --file=test-workflow.json --verbose
```

### Network Traffic Analysis
```bash
# Monitor HTTP requests to Trilium server
sudo tcpdump -i lo -A 'port 37840'

# Or use curl for manual API testing
curl -X GET "http://localhost:37840/api/app-info" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 10. Test Data Management

### Sample Data Creation
```javascript
// Create test notes in Trilium for testing
const testData = {
  projectNotes: [
    { title: "Project Alpha", content: "Main project note", labels: ["project", "active"] },
    { title: "Meeting Notes", content: "Weekly meeting summary", labels: ["meeting", "completed"] },
    { title: "Bug Reports", content: "Issue tracking", labels: ["bugs", "urgent"] }
  ],
  dailyNotes: [
    { title: "Daily Journal", content: "Personal reflections", labels: ["journal", "personal"] },
    { title: "Task List", content: "Daily todos", labels: ["tasks", "work"] }
  ]
};
```

### Cleanup Procedures
```bash
# Remove test data after testing
# 1. Archive test notes
# 2. Delete test backups
# 3. Clear temporary export files
```

## 🎯 11. Success Criteria

### Functional Requirements
- [ ] **All Nodes Operational**: 8/8 nodes execute without errors
- [ ] **API Compatibility**: Both ETAPI and Backend Script API work
- [ ] **Data Integrity**: No data corruption during operations
- [ ] **Error Recovery**: Graceful handling of all error conditions

### Performance Requirements
- [ ] **Response Time**: Operations complete within 5 seconds
- [ ] **Memory Usage**: No memory leaks during extended operation
- [ ] **Concurrent Safety**: Multiple workflows run simultaneously

### Usability Requirements
- [ ] **Documentation**: All features documented and accessible
- [ ] **Examples**: Working examples for common use cases
- [ ] **Error Messages**: Clear, actionable error reporting

## 🚨 12. Troubleshooting Guide

### Common Issues

#### Connection Problems
```bash
# Check Trilium server status
curl http://localhost:37840

# Verify API token
curl -H "Authorization: Bearer TOKEN" http://localhost:37840/api/app-info
```

#### Authentication Issues
- Ensure API token is valid and not expired
- Check token permissions in Trilium settings
- Verify server URL and port configuration

#### Node Execution Errors
- Validate all required parameters are provided
- Check note IDs exist in Trilium
- Verify parent note permissions

#### Performance Issues
- Monitor system resources during large operations
- Check network latency for remote servers
- Validate large dataset handling

## 📈 13. Test Reporting

### Test Execution Log
```bash
# Create test execution report
{
  "testDate": "2024-01-01T00:00:00Z",
  "testEnvironment": {
    "triliumVersion": "1.0.0",
    "n8nVersion": "1.0.0",
    "nodeVersion": "18.0.0"
  },
  "testResults": {
    "unitTests": { "passed": 11, "failed": 0 },
    "integrationTests": { "passed": 8, "failed": 0 },
    "manualTests": { "passed": 24, "failed": 0 }
  },
  "performanceMetrics": {
    "averageResponseTime": "1.2s",
    "memoryUsage": "45MB",
    "concurrentOperations": "Supported"
  }
}
```

## 🎉 14. Final Validation

### Acceptance Criteria
- [ ] **All Automated Tests Pass**: 11/11 unit tests successful
- [ ] **All Manual Tests Pass**: 24/24 checklist items completed
- [ ] **Integration Verified**: Both API types functional
- [ ] **Documentation Complete**: All features documented
- [ ] **Performance Acceptable**: Response times within limits
- [ ] **Error Handling Robust**: All error scenarios handled gracefully

### Sign-off Requirements
- [ ] **Functionality Testing**: All features work as specified
- [ ] **Integration Testing**: Seamless operation with Trilium and n8n
- [ ] **Performance Testing**: Acceptable operation under load
- [ ] **Documentation Review**: All user-facing features documented
- [ ] **Code Quality**: Clean, maintainable, well-structured code

---

## 🚀 Quick Start Testing

For immediate testing, run:

```bash
# 1. Navigate to project directory
cd trilium_n8n_node

# 2. Run automated tests
node src/__tests__/test-runner.js

# 3. Build the project
npm run build

# 4. Check for any compilation errors
npm run lint
```

**Expected Results**: All tests pass with no errors or warnings.

This testing procedure ensures comprehensive validation of all Trilium n8n community node functionality across all operational scenarios.