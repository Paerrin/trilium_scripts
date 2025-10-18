import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient } from '../TriliumBackendApiClient';

/**
 * Trilium Export node
 * Exports Trilium notes and subtrees to various formats
 */
export class TriliumExport implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Export Trilium Notes',
    name: 'triliumExport',
    icon: 'fa:download',
    group: ['output'],
    version: 1,
    description: 'Export Trilium notes and subtrees to HTML, Markdown, or other formats',
    defaults: {
      name: 'Export Notes',
      color: '#7f8c8d',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'triliumApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Export Source',
        name: 'exportSource',
        type: 'options',
        options: [
          {
            name: 'Single Note',
            value: 'singleNote',
            description: 'Export a single note',
          },
          {
            name: 'Note Subtree',
            value: 'subtree',
            description: 'Export a note and all its children',
          },
          {
            name: 'Notes with Label',
            value: 'notesWithLabel',
            description: 'Export all notes with a specific label',
          },
          {
            name: 'Search Results',
            value: 'searchResults',
            description: 'Export results of a search query',
          },
        ],
        default: 'singleNote',
        description: 'What to export from Trilium',
      },
      {
        displayName: 'Note ID',
        name: 'noteId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the note to export',
        displayOptions: {
          show: {
            exportSource: ['singleNote', 'subtree'],
          },
        },
      },
      {
        displayName: 'Label Name',
        name: 'labelName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the label to filter notes for export',
        displayOptions: {
          show: {
            exportSource: ['notesWithLabel'],
          },
        },
      },
      {
        displayName: 'Label Value',
        name: 'labelValue',
        type: 'string',
        default: '',
        description: 'Value of the label (optional)',
        displayOptions: {
          show: {
            exportSource: ['notesWithLabel'],
          },
        },
      },
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        required: true,
        default: '',
        description: 'Search query to find notes for export',
        displayOptions: {
          show: {
            exportSource: ['searchResults'],
          },
        },
      },
      {
        displayName: 'Export Format',
        name: 'exportFormat',
        type: 'options',
        options: [
          {
            name: 'HTML',
            value: 'html',
            description: 'Export as HTML with full formatting',
          },
          {
            name: 'Markdown',
            value: 'markdown',
            description: 'Export as Markdown',
          },
          {
            name: 'ZIP Archive',
            value: 'zip',
            description: 'Export as ZIP archive (single file)',
          },
        ],
        default: 'html',
        description: 'Format for the exported data',
      },
      {
        displayName: 'Output File Path',
        name: 'outputFilePath',
        type: 'string',
        required: true,
        default: '',
        description: 'Full path where to save the exported file',
        placeholder: '/path/to/export/file.html',
      },
      {
        displayName: 'Include Attachments',
        name: 'includeAttachments',
        type: 'boolean',
        default: true,
        description: 'Include file attachments in the export',
      },
      {
        displayName: 'Include Note Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: true,
        description: 'Include creation dates, modification dates, and other metadata',
      },
      {
        displayName: 'Include Search Results',
        name: 'includeSearchResults',
        type: 'boolean',
        default: false,
        description: 'Include the search query and results in the export',
        displayOptions: {
          show: {
            exportFormat: ['html'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await this.executeExport(i);
        returnData.push(result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : String(error),
              itemIndex: i,
            },
            pairedItem: i,
          });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }

  private async executeExport(itemIndex: number): Promise<INodeExecutionData> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const exportSource = this.getNodeParameter('exportSource', itemIndex) as string;
    const exportFormat = this.getNodeParameter('exportFormat', itemIndex) as string;
    const outputFilePath = this.getNodeParameter('outputFilePath', itemIndex) as string;
    const includeAttachments = this.getNodeParameter('includeAttachments', itemIndex) as boolean;
    const includeMetadata = this.getNodeParameter('includeMetadata', itemIndex) as boolean;

    // Initialize API client
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    let noteIds: string[] = [];

    // Determine which notes to export based on source
    switch (exportSource) {
      case 'singleNote':
        const noteId = this.getNodeParameter('noteId', itemIndex) as string;
        noteIds = [noteId];
        break;

      case 'subtree':
        const subtreeNoteId = this.getNodeParameter('noteId', itemIndex) as string;
        // Would need to implement method to get all child note IDs
        noteIds = [subtreeNoteId]; // Placeholder
        break;

      case 'notesWithLabel':
        const labelName = this.getNodeParameter('labelName', itemIndex) as string;
        const labelValue = this.getNodeParameter('labelValue', itemIndex) as string;

        if (labelValue) {
          const notes = await apiClient.getNotesWithLabel(labelName, labelValue);
          noteIds = notes.map(note => note.noteId);
        } else {
          const notes = await apiClient.getNotesWithLabel(labelName);
          noteIds = notes.map(note => note.noteId);
        }
        break;

      case 'searchResults':
        const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
        const searchResults = await apiClient.searchNotes({
          query: searchQuery,
          includeArchivedNotes: false,
          limit: 1000,
        });
        noteIds = searchResults.map(note => note.noteId);
        break;

      default:
        throw new Error(`Unknown export source: ${exportSource}`);
    }

    if (noteIds.length === 0) {
      throw new Error('No notes found to export');
    }

    // Perform export
    const startTime = new Date();

    try {
      if (exportFormat === 'zip') {
        // Export as ZIP - use the first note as root for subtree export
        await apiClient.exportSubtree(noteIds[0], 'html', outputFilePath);
      } else {
        // For HTML/Markdown, we would need to implement custom export logic
        // This is a placeholder for the actual implementation
        throw new Error(`Export format ${exportFormat} not yet implemented`);
      }
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    const endTime = new Date();

    const result: any = {
      success: true,
      exportSource,
      exportFormat,
      outputFilePath,
      notesExported: noteIds.length,
      noteIds,
      exportedAt: endTime.toISOString(),
      duration: endTime.getTime() - startTime.getTime(),
    };

    if (includeMetadata) {
      result.metadata = {
        totalNotes: noteIds.length,
        exportMethod: credentials.apiType,
        includeAttachments,
        includeMetadata,
      };
    }

    return {
      json: result,
      pairedItem: itemIndex,
    };
  }
}