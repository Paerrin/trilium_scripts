# Project Brief: Trilium Promoted Attributes Table Script

---

## Executive Summary

This project will create a script for Trilium Notes that automatically generates a comprehensive table displaying all promoted attributes stored in the database. The script addresses the need for users to have a centralized, visual overview of their promoted attributes and their values, displayed in a dedicated note for easy reference and management.

**Target Users:** Trilium Notes power users who extensively use promoted attributes for organizing and categorizing their notes.

**Key Value Proposition:** Provides instant visibility into all promoted attributes across the entire note database, enabling better attribute management and discovery.

---

## Problem Statement

### Current State & Pain Points

Trilium Notes users rely heavily on promoted attributes to organize, categorize, and add metadata to their notes. However, there is currently no built-in way to:

- View all promoted attributes in one centralized location
- Understand the full scope of attributes being used across the database
- Quickly reference attribute names and their values
- Identify inconsistencies or duplicates in attribute usage

Users must manually navigate through individual notes to discover what promoted attributes exist, making it difficult to maintain consistent attribute naming conventions or understand the full taxonomy of their note system.

### Impact of the Problem

Without a centralized view:
- Users spend unnecessary time searching for existing attributes
- Attribute naming inconsistencies proliferate (e.g., "priority" vs "Priority" vs "prio")
- New users to a shared Trilium database cannot easily discover available attributes
- Attribute-based workflows become harder to maintain as databases grow

### Why Existing Solutions Fall Short

Trilium's current interface shows attributes on individual notes but lacks:
- A database-wide attribute overview
- Aggregated view of all promoted attributes
- Easy-to-scan table format for attribute discovery

### Urgency & Importance

As Trilium databases grow in size and complexity, the need for attribute management tools becomes critical. Power users with hundreds or thousands of notes need efficient ways to understand and manage their attribute schemas.

---

## Proposed Solution

### Core Concept

Develop a Trilium script that:
1. Queries the Trilium database for all attributes marked as "promoted"
2. Extracts attribute names and their associated values
3. Generates a formatted table with attributes as rows and values as cell entries
4. Displays the table in a dedicated note that can be refreshed on demand

### Key Differentiators

- **Native Integration:** Works within Trilium's scripting environment using the Trilium API
- **Automatic Updates:** Can be configured to refresh automatically or on-demand
- **Clean Presentation:** Generates a well-formatted table optimized for readability
- **No External Dependencies:** Uses only Trilium's built-in API and scripting capabilities

### Why This Solution Will Succeed

This solution leverages Trilium's robust scripting API and note-based architecture, making it:
- Easy to deploy (single script)
- Maintainable (standard Trilium script practices)
- Accessible (results displayed as a regular note)
- Performant (direct database queries)

### High-Level Vision

A lightweight, efficient script that becomes an essential tool for Trilium power users to manage their attribute schemas, promoting better organization practices and database hygiene.

---

## Target Users

### Primary User Segment: Trilium Power Users

**Profile:**
- Existing Trilium Notes users with established databases (100+ notes)
- Heavy users of promoted attributes for categorization and metadata
- Comfortable with Trilium's scripting capabilities
- Value organization and systematic note management

**Current Behaviors:**
- Regularly create and use promoted attributes across multiple notes
- May struggle to remember all attribute names being used
- Manually check notes to discover existing attributes
- Interested in maintaining consistency in their note system

**Specific Pain Points:**
- No central reference for promoted attributes
- Time wasted searching for attribute names
- Inconsistent attribute naming across notes
- Difficulty onboarding others to shared databases

**Goals:**
- Maintain clean, consistent attribute taxonomy
- Quickly reference available attributes when creating new notes
- Understand the full scope of their metadata schema
- Improve overall note organization

---

## Goals & Success Metrics

### Business Objectives

- Create a functional, reliable script that queries promoted attributes accurately
- Deliver a tool that saves users time in attribute management
- Provide foundation for potential future attribute management features

### User Success Metrics

- Users can successfully generate attribute tables within 30 seconds of running the script
- Table accurately reflects all promoted attributes in the database
- Users report improved attribute discovery and management
- Script requires minimal maintenance after initial deployment

### Key Performance Indicators (KPIs)

- **Script Execution Time:** < 5 seconds for databases with up to 10,000 notes
- **Accuracy Rate:** 100% of promoted attributes captured in generated table
- **Error Rate:** < 1% of script executions result in errors
- **User Adoption:** Script becomes a standard tool for Trilium power users
- **Code Quality:** Script follows Trilium API best practices and conventions

---

## MVP Scope

### Core Features (Must Have)

- **Database Query Function:** Query Trilium database to retrieve all promoted attributes
  - *Rationale:* Core functionality - without this, the script has no purpose

- **Attribute Data Extraction:** Extract attribute names and values from query results
  - *Rationale:* Necessary to transform raw database data into usable information

- **Table Generation:** Create formatted table with attribute names and values
  - *Rationale:* Primary deliverable - the visual representation users need

- **Note Creation/Update:** Display generated table in a dedicated note
  - *Rationale:* Integration with Trilium's native interface for easy access

- **Error Handling:** Basic error handling for database queries and note operations
  - *Rationale:* Ensures script reliability and provides useful feedback to users

### Out of Scope for MVP

- Attribute editing capabilities from the table view
- Filtering or sorting functionality
- Attribute usage statistics (count of notes using each attribute)
- Historical tracking of attribute changes
- Export to external formats (CSV, JSON)
- Attribute merge/rename tools
- Integration with Trilium's attribute definition system
- Visual styling beyond basic table formatting

### MVP Success Criteria

The MVP is successful when:
1. Script executes without errors on a standard Trilium database
2. Generated table accurately displays all promoted attributes
3. Table is readable and properly formatted in the target note
4. Script can be run multiple times to refresh the table
5. Basic documentation is provided for installation and usage

---

## Post-MVP Vision

### Phase 2 Features

- **Interactive Table:** Click attribute names to see all notes using that attribute
- **Filtering & Search:** Filter table by attribute name or value patterns
- **Statistics Display:** Show count of notes using each attribute
- **Attribute Management:** Rename or merge attributes directly from the table
- **Customizable Columns:** Let users choose which attribute metadata to display

### Long-Term Vision

Transform this script into a comprehensive attribute management suite within Trilium:
- Visual attribute taxonomy browser
- Attribute relationship mapping
- Bulk attribute operations
- Attribute templates and presets
- Integration with Trilium's relation system
- Attribute-based note analytics and insights

### Expansion Opportunities

- **Plugin Development:** Convert to formal Trilium plugin with UI integration
- **Community Sharing:** Share on Trilium community forums/GitHub
- **Template Library:** Create starter attribute schemas for common use cases
- **Documentation Tools:** Generate attribute documentation automatically
- **API Extensions:** Contribute attribute management endpoints back to Trilium API

---

## Technical Considerations

### Platform Requirements

- **Target Platform:** Trilium Notes (desktop and server versions)
- **Compatibility:** Trilium version 0.50+ (or specify minimum version based on API usage)
- **Performance Requirements:**
  - Execute within 5 seconds for typical databases (< 10,000 notes)
  - Minimal memory footprint during execution
  - Non-blocking execution where possible

### Technology Preferences

- **Language:** JavaScript (Trilium's native scripting language)
- **API:** Trilium Backend API (`api` object)
- **Database Access:** Via Trilium API methods (no direct SQL unless necessary)
- **Output Format:** HTML table or Markdown table within Trilium note
- **Styling:** Utilize Trilium's note rendering capabilities

### Architecture Considerations

- **Repository Structure:**
  - Single script file for MVP
  - Separate documentation file (README.md)
  - Example scripts folder referenced for patterns

- **Script Architecture:**
  - Main execution function
  - Separate helper functions for query, processing, and rendering
  - Error handling wrapper

- **Integration Requirements:**
  - Access to Trilium API
  - Read permissions on attribute tables
  - Write permissions to create/update target note

- **Security/Compliance:**
  - Read-only access to note data (no modifications to source notes)
  - Safe handling of attribute values (escape special characters)
  - No external network calls or data transmission

---

## Constraints & Assumptions

### Constraints

- **Budget:** Personal/open-source project (no monetary budget)
- **Timeline:** Target completion within 2-4 weeks for MVP
- **Resources:** Single developer, part-time effort
- **Technical:**
  - Must work within Trilium's API limitations
  - Cannot modify Trilium core code
  - Must use JavaScript (Trilium's scripting language)
  - Performance limited by Trilium's database query capabilities

### Key Assumptions

- Trilium API provides necessary methods to query promoted attributes
- Users have basic familiarity with Trilium scripts
- Promoted attributes are properly marked in the database
- Target note for displaying table can be created programmatically
- HTML or Markdown tables are acceptable output formats
- Users running the script have appropriate permissions
- Example scripts in examples folder follow current best practices
- API documentation (api_md folder) is current and accurate

---

## Risks & Open Questions

### Key Risks

- **API Limitations:** Trilium API may not expose all necessary attribute data or query methods
  - *Impact:* Could require workarounds or limit functionality

- **Performance Issues:** Large databases (10,000+ notes) may cause slow queries or timeouts
  - *Impact:* Script may be unusable for power users with large databases

- **Breaking Changes:** Future Trilium updates might change API or attribute system
  - *Impact:* Script maintenance burden and potential breakage

- **Data Accuracy:** Edge cases in attribute storage might cause incorrect table generation
  - *Impact:* Users lose trust in the tool if data is inaccurate

### Open Questions

- What is the exact Trilium API method to query promoted attributes?
- Should the table include inherited attributes or only direct attributes?
- How should duplicate attribute names (on different notes) be handled?
- Should the script handle attribute types (string, number, boolean, relation)?
- What is the preferred table format (HTML vs Markdown)?
- Should the script be executable as a frontend script, backend script, or both?
- Where should the output note be created in the note tree hierarchy?
- Should the script preserve previous table versions or overwrite completely?

### Areas Needing Further Research

- Trilium API methods for attribute queries (review api_md documentation)
- Performance characteristics of database queries on large note sets
- Best practices from existing Trilium scripts in examples folder
- Trilium Wiki documentation on promoted attributes and scripting
- Table rendering capabilities and limitations in Trilium notes
- Error handling patterns in Trilium scripts
- Note creation and update workflows via API

---

## Appendices

### A. Research Summary

**Available Resources:**
- **API Documentation:** HTML files available in `api/` directory
- **API Documentation (Markdown):** Converted markdown in `api_md/` directory
- **Trilium Wiki:** Local clone available in `Trilium.wiki/` directory
- **Example Scripts:** Scripts from another repo available in `examples/` folder

**Next Steps for Research:**
1. Review Trilium API docs for attribute-related methods
2. Examine example scripts for patterns and best practices
3. Consult Trilium Wiki for promoted attributes behavior
4. Test API methods in development environment

### C. References

**Documentation Sources:**
- `api/` - Trilium API HTML documentation
- `api_md/` - Trilium API Markdown documentation
- `Trilium.wiki/` - Local Trilium Wiki clone
- `examples/` - Reference script examples
- `docs/project_overview.md` - Project specifications

**External Resources:**
- Trilium Notes GitHub: https://github.com/zadam/trilium
- Trilium Community Discussion Forum
- Trilium API Documentation (online)

---

## Next Steps

### Immediate Actions

1. Review Trilium API documentation in `api_md/` to identify attribute query methods
2. Examine example scripts in `examples/` folder to understand coding patterns
3. Consult Trilium Wiki for promoted attributes behavior and best practices
4. Set up development environment and test basic API calls
5. Create proof-of-concept script to query one promoted attribute
6. Design table format and test rendering in Trilium note
7. Implement full MVP script with error handling
8. Test with various database sizes and edge cases
9. Document installation and usage instructions
10. Share with Trilium community for feedback

### PM Handoff

This Project Brief provides the full context for **Trilium Promoted Attributes Table Script**. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.

---

**Document Generated:** 2025-10-13
**Status:** Draft for Review
**Next Phase:** PRD Development
