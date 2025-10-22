# Trilium Scripts Catalog & Development Guide

This catalog serves as a comprehensive guide for developing and documenting new Trilium scripts with consistent structure and quality standards.

## Current Projects Overview

| Project | Type | Status | Last Updated | Description |
|---------|------|--------|--------------|-------------|
| promoted_attributes_table | JS Backend | Production Ready | 2023-10-15 | Generates comprehensive tables of promoted attributes |
| trilium_n8n_node | TypeScript | Production Ready | 2023-10-17 | Complete n8n workflow integration for Trilium |
| wikilink_processor | JS Backend | Production Ready | 2023-10-13 | Converts wikilinks to Trilium internal links |
| reference_scripts | JS Backend | Library | 2023-10-13 | Collection of 20+ practical example scripts |

## Script Development Template

### Standard Structure for All Scripts

```javascript
/**
 * @name {Script Name}
 * @version {Semantic Version}
 * @author {Your Name}
 * @description {Brief description of what the script does}
 *
 * @category {Category}
 * @tags {tag1,tag2,tag3}
 *
 * @triliumVersion {Required Trilium version}
 * @difficulty {Easy|Medium|Hard}
 *
 * @config {true|false}
 *
 * @features {List of key features}
 * @useCases {Common use cases}
 *
 * @exampleBasic {Basic usage example}
 * @exampleAdvanced {Advanced usage example}
 *
 * @limitations {Any known limitations}
 * @todo {Future improvements planned}
 */

// Configuration section (if applicable)
const config = {
    option1: defaultValue1,
    option2: defaultValue2
};

// Main script logic
function main() {
    // Implementation
}

// Utility functions
function utilityFunction() {
    // Helper logic
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        main,
        utilityFunction,
        config
    };
} else {
    // Direct execution
    main();
}
```

### Required Documentation Sections

#### 1. Script Header
- Name, version, author, description
- Category and tags
- Trilium version requirement
- Difficulty level
- Configuration options

#### 2. Features Section
- 3-5 bullet points describing key capabilities
- Performance characteristics
- Technical requirements

#### 3. Use Cases
- 3-5 practical scenarios
- Integration examples
- Expected outcomes

#### 4. Examples
- Basic usage code snippet
- Advanced usage code snippet
- Configuration examples

#### 5. Technical Details
- Dependencies
- API calls made
- Performance considerations
- Error handling approach

### Quality Standards

#### Code Quality
- ✅ Proper error handling with try-catch blocks
- ✅ Configurable options with sensible defaults
- ✅ Performance optimized for large databases
- ✅ Safe operations (read-only by default)
- ✅ Comprehensive logging
- ✅ JSDoc comments

#### Documentation Quality
- ✅ Clear, concise README.md
- ✅ Installation instructions
- ✅ Configuration options documented
- ✅ Examples provided
- ✅ Troubleshooting section
- ✅ Performance characteristics

#### Testing Requirements
- ✅ Basic functionality test
- ✅ Performance test (with database size)
- ✅ Error condition handling
- ✅ Edge cases covered

## Script Categories

### 1. Database Enhancement
- Improve Trilium's core functionality
- Better data organization and visualization
- Performance optimization scripts

### 2. Workflow Automation
- Integration with external services
- Task management and scheduling
- Data processing pipelines

### 3. Content Processing
- Text and link manipulation
- Import/export utilities
- Content transformation tools

### 4. Integration & External Services
- API integrations
- Third-party service connections
- Data synchronization

### 5. User Experience
- Interface enhancements
- Custom views and layouts
- Accessibility improvements

## Video Content Structure

### Short Demo Videos (2-5 minutes)
- **Problem Statement**: What issue does this solve?
- **Solution Overview**: Brief script explanation
- **Setup**: Quick installation guide
- **Demo**: Live demonstration of key features
- **Results**: Show the output/benefits
- **Conclusion**: Call to action and next steps

### Tutorial Videos (10-15 minutes)
- **Introduction**: Project overview and prerequisites
- **Installation**: Step-by-step setup
- **Configuration**: All options explained
- **Advanced Features**: Deep dive into capabilities
- **Real-world Use Case**: Practical example
- **Troubleshooting**: Common issues and solutions
- **Conclusion**: Summary and best practices

### Project Overview Videos (5-8 minutes)
- **Project Background**: Why created and for whom
- **Key Features**: Major capabilities highlighted
- **Installation Process**: Quick setup overview
- **Use Cases**: Multiple scenarios demonstrated
- **Technical Details**: Architecture and limitations
- **Next Steps**: How to get started

## Development Workflow

### 1. Planning Phase
- Define the problem to solve
- Research existing solutions
- Plan the technical approach
- Document requirements

### 2. Development Phase
- Write script with template structure
- Implement error handling
- Add comprehensive logging
- Test with sample data

### 3. Documentation Phase
- Write README.md with all sections
- Create examples and configuration guides
- Document performance characteristics
- Provide troubleshooting guide

### 4. Testing Phase
- Basic functionality verification
- Performance testing
- Error condition testing
- Edge case validation

### 5. Video Planning Phase
- Outline script structure
- Prepare demo environment
- Write video script
- Record and edit

## Template Files

### New Script Template
See `templates/new_script.js` for a complete starting template.

### Video Script Template
See `templates/video_script.md` for video production templates.

### Documentation Template
See `templates/readme_template.md` for README structure.

## Contributing

When adding new scripts:
1. Use the development template
2. Follow quality standards
3. Update this catalog
4. Create corresponding documentation
5. Plan video content

## Support & Maintenance

- Regular updates for Trilium compatibility
- Performance optimization improvements
- Documentation updates
- Video content refresh
- Community feedback integration

---

*Last Updated: 2023-10-18*
*For questions or suggestions, please open an issue in the repository.*