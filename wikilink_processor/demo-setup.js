// ============================================================================
// Wikilink Processor Demo Setup Script
// ============================================================================
// Version: 1.0.0
// Description: Creates demo notes with wikilinks to test the processor
// ============================================================================

// Demo content with various wikilink formats
const DEMO_NOTES = [
    {
        title: "Project Overview",
        content: `# Project Overview

This is a demo project to test the [[wikilink processor]] functionality.

## Related Documents
- [[Research Notes]]
- [[Technical Requirements]]
- [[Timeline|Project Schedule]]

## Key Features
The [[wikilink processor]] automatically converts markdown-style links to Trilium's native format.

This allows for seamless integration with [[Trilium Backlinks|existing backlink system]].

## References
- See [[Technical Requirements#Security]] for security considerations
- Check [[Timeline#Milestones]] for key dates
`,
        parent: 'root'
    },
    {
        title: "Research Notes",
        content: `# Research Notes

Research findings related to the [[Project Overview]].

## Key Findings
1. [[wikilink processor]] implementation is feasible
2. Integration with [[Trilium Backlinks]] works well
3. [[User Experience]] improvements are significant

## Sources
- [[Academic Papers]]
- [[Technical Documentation|Docs]]
- [[User Feedback|Comments]]

## Related Topics
- [[Best Practices]]
- [[Performance Metrics]]
`,
        parent: 'root'
    },
    {
        title: "Technical Requirements",
        content: `# Technical Requirements

Technical specifications for the [[Project Overview]].

## System Requirements
- [[wikilink processor]] must handle batch processing
- Integration with [[Trilium Backlinks]] required
- Support for [[User Experience]] features

## Security Section #Security

### Authentication
- [[Security Protocols]]
- [[User Access|Permissions]]

### Data Protection
- [[Encryption Standards]]
- [[Backup Procedures|Data Backup]]

## Performance
- [[Performance Metrics]] must be tracked
- [[Optimization Techniques]] should be implemented
`,
        parent: 'root'
    },
    {
        title: "Timeline",
        content: `# Timeline

Project timeline for the [[Project Overview]].

## Phases

### Phase 1: Research
- Complete [[Research Notes]]
- Review [[Academic Papers]]
- Analyze [[User Feedback|Comments]]

### Phase 2: Development #Milestones
- Implement [[wikilink processor]]
- Integrate with [[Trilium Backlinks]]
- Test [[User Experience]] features

### Phase 3: Testing
- [[Performance Metrics]] evaluation
- [[Security Protocols]] validation
- [[User Feedback]] collection

## Deadlines
- See [[Timeline#Milestones]] for specific dates
- Review [[Timeline#Phase 3]] for testing schedule
`,
        parent: 'root'
    },
    {
        title: "Best Practices",
        content: `# Best Practices

Recommended practices for using the [[wikilink processor]].

## Usage Guidelines
1. Use descriptive titles for [[wikilinks]]
2. Maintain consistency with [[Trilium Backlinks]]
3. Test with [[User Experience]] in mind

## Implementation Tips
- Batch process [[Performance Metrics]]
- Follow [[Security Protocols]]
- Document [[Technical Documentation|changes]]

## Resources
- [[Academic Papers]] on knowledge management
- [[User Feedback]] from testing
- [[Optimization Techniques]] for performance
`,
        parent: 'root'
    }
];

/**
 * Creates demo notes with wikilinks
 */
async function createDemoNotes() {
    api.log('[Demo Setup] Creating demo notes for wikilink processor testing...');

    try {
        const createdNotes = [];

        for (const demoNote of DEMO_NOTES) {
            try {
                // Check if note already exists
                const existingNote = await api.getNoteWithLabel('demoWikilink');
                if (existingNote && existingNote.title === demoNote.title) {
                    api.log(`[Demo Setup] Note "${demoNote.title}" already exists, skipping...`);
                    continue;
                }

                // Create the note
                const { note } = await api.createTextNote(
                    demoNote.parent,
                    demoNote.title,
                    demoNote.content
                );

                // Add demo label
                await note.setLabel('demoWikilink', 'true');
                await note.setLabel('demoContent', 'wikilinks');

                createdNotes.push({
                    noteId: note.noteId,
                    title: demoNote.title
                });

                api.log(`[Demo Setup] Created demo note: ${note.noteId} - "${demoNote.title}"`);

            } catch (error) {
                api.log(`[Demo Setup] Failed to create note "${demoNote.title}": ${error.message}`);
            }
        }

        // Create a summary note
        const summaryContent = `
# Wikilink Demo Setup

This demo contains ${createdNotes.length} notes with various [[wikilink]] formats to test the wikilink processor.

## Created Notes
${createdNotes.map(note => `- [[${note.title}]]`).join('\n')}

## Wikilink Formats Used
- Basic: [[Project Overview]]
- With alias: [[Timeline|Project Schedule]]
- With heading: [[Technical Requirements#Security]]
- Combined: [[Timeline#Milestones|Key Dates]]

## Next Steps
1. Run the [[wikilink processor]] script
2. Check the processing report
3. Verify that links are converted to ~noteId format
4. Test backlink functionality

## Notes to Create Orphaned Links
These wikilinks should trigger automatic note creation:
- [[Academic Papers]]
- [[User Experience]]
- [[Trilium Backlinks]]
- [[Security Protocols]]
- [[Performance Metrics]]
- [[User Feedback|Comments]]
- [[Technical Documentation|Docs]]
- [[Encryption Standards]]
- [[Backup Procedures|Data Backup]]
- [[Optimization Techniques]]

---
*Created by demo setup script on ${new Date().toLocaleString()}*
        `;

        const { note: summaryNote } = await api.createTextNote(
            'root',
            'Wikilink Demo Summary',
            summaryContent
        );

        await summaryNote.setLabel('demoWikilink', 'true');
        await summaryNote.setLabel('demoSummary', 'true');

        api.log(`[Demo Setup] ✓ Demo setup completed! Created ${createdNotes.length} notes plus summary.`);
        api.log(`[Demo Setup] Summary note: ${summaryNote.noteId}`);
        api.log(`[Demo Setup] Now you can run the wikilink processor to test the functionality.`);

    } catch (error) {
        api.log(`[Demo Setup] Error during demo setup: ${error.message}`);
    }
}

/**
 * Cleans up demo notes
 */
async function cleanupDemoNotes() {
    api.log('[Demo Setup] Cleaning up demo notes...');

    try {
        const demoNotes = await api.getNotesWithLabel('demoWikilink');
        let deletedCount = 0;

        for (const note of demoNotes) {
            try {
                await note.deleteNote();
                deletedCount++;
                api.log(`[Demo Setup] Deleted: ${note.title}`);
            } catch (error) {
                api.log(`[Demo Setup] Failed to delete ${note.title}: ${error.message}`);
            }
        }

        api.log(`[Demo Setup] ✓ Cleanup completed! Deleted ${deletedCount} demo notes.`);

    } catch (error) {
        api.log(`[Demo Setup] Error during cleanup: ${error.message}`);
    }
}

// Usage instructions
api.log(`
=================================================================
WIKILINK PROCESSOR DEMO SETUP
=================================================================

This script creates demo notes to test the wikilink processor.

TO RUN:
- Create demo notes: createDemoNotes()
- Clean up demo notes: cleanupDemoNotes()

DEMO NOTES CREATED:
${DEMO_NOTES.map(note => `- ${note.title}`).join('\n')}

TESTING WIKILINKS:
- Basic links: [[Project Overview]]
- Alias links: [[Timeline|Project Schedule]]
- Heading links: [[Technical Requirements#Security]]
- Orphaned links: [[Academic Papers]], [[User Experience]]

NEXT STEPS:
1. Run createDemoNotes() to create demo content
2. Run the wikilink processor script
3. Check the processing report
4. Verify converted links and backlink functionality

=================================================================
`);

// Uncomment the line below to create demo notes automatically
// createDemoNotes();