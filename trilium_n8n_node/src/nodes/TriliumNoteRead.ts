import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient } from '../TriliumBackendApiClient';

/**
 * Trilium Note Read node
 * Retrieves and reads notes from Trilium
 */
export class TriliumNoteRead implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Read Trilium Note',
    name: 'triliumNoteRead',
    icon: 'file:trilium.svg',
    group: ['input'],
    version: 1,
    description: 'Read an existing note from Trilium by ID or retrieve multiple notes',
    defaults: {
      name: 'Read Note',
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
        displayName: 'Operation Mode',
        name: 'operationMode',
        type: 'options',
        options: [
          {
            name: 'Read Single Note',
            value: 'single',
            description: 'Read a specific note by ID',
          },
          {
            name: 'Read Notes with Label',
            value: 'byLabel',
            description: 'Read all notes with a specific label',
          },
          {
            name: 'Read Child Notes',
            value: 'children',
            description: 'Read child notes of a parent note',
          },
        ],
        default: 'single',
        description: 'How to identify which notes to read',
      },
      {
        displayName: 'Note ID',
        name: 'noteId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the note to read',
        displayOptions: {
          show: {
            operationMode: ['single'],
          },
        },
      },
      {
        displayName: 'Label Name',
        name: 'labelName',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the label to search for',
        displayOptions: {
          show: {
            operationMode: ['byLabel'],
          },
        },
      },
      {
        displayName: 'Label Value',
        name: 'labelValue',
        type: 'string',
        default: '',
        description: 'Value of the label (optional - if not provided, matches any note with this label)',
        displayOptions: {
          show: {
            operationMode: ['byLabel'],
          },
        },
      },
      {
        displayName: 'Parent Note ID',
        name: 'parentNoteId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the parent note whose children to read',
        displayOptions: {
          show: {
            operationMode: ['children'],
          },
        },
      },
      {
        displayName: 'Include Note Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: true,
        description: 'Include creation date, modification date, and other metadata',
      },
      {
        displayName: 'Include Attributes',
        name: 'includeAttributes',
        type: 'boolean',
        default: true,
        description: 'Include labels and relations attached to the note(s)',
      },
      {
        displayName: 'Max Results',
        name: 'maxResults',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 1000,
        },
        default: 100,
        description: 'Maximum number of notes to return (1-1000)',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const results = await this.executeRead(i);
        returnData.push(...results);
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

  private async executeRead(itemIndex: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const operationMode = this.getNodeParameter('operationMode', itemIndex) as string;
    const includeMetadata = this.getNodeParameter('includeMetadata', itemIndex) as boolean;
    const includeAttributes = this.getNodeParameter('includeAttributes', itemIndex) as boolean;
    const maxResults = this.getNodeParameter('maxResults', itemIndex) as number;

    // Initialize API client
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    const results: INodeExecutionData[] = [];

    switch (operationMode) {
      case 'single':
        const noteId = this.getNodeParameter('noteId', itemIndex) as string;
        const note = await apiClient.getNote(noteId);

        if (!note) {
          throw new Error(`Note with ID ${noteId} not found`);
        }

        results.push({
          json: {
            noteId: note!.noteId,
            title: note!.title,
            content: note!.content,
            type: note!.type,
            mime: note!.mime,
            isProtected: note!.isProtected,
            isDeleted: note!.isDeleted,
            ...(includeMetadata && {
              dateCreated: note!.dateCreated,
              dateModified: note!.dateModified,
              utcDateCreated: note!.utcDateCreated,
              utcDateModified: note!.utcDateModified,
            }),
            ...(includeAttributes && note!.attributes && { attributes: note!.attributes }),
          },
          pairedItem: itemIndex,
        });
        break;

      case 'byLabel':
        const labelName = this.getNodeParameter('labelName', itemIndex) as string;
        const labelValue = this.getNodeParameter('labelValue', itemIndex) as string;

        let notes: any[];
        if (labelValue) {
          notes = await apiClient.getNotesWithLabel(labelName, labelValue);
        } else {
          notes = await apiClient.getNotesWithLabel(labelName);
        }

        // Apply max results limit
        const limitedNotes = notes.slice(0, maxResults);

        for (const note of limitedNotes) {
          results.push({
            json: {
              noteId: note.noteId,
              title: note.title,
              content: note.content,
              type: note.type,
              mime: note.mime,
              isProtected: note.isProtected,
              isDeleted: note.isDeleted,
              ...(includeMetadata && {
                dateCreated: note.dateCreated,
                dateModified: note.dateModified,
                utcDateCreated: note.utcDateCreated,
                utcDateModified: note.utcDateModified,
              }),
              ...(includeAttributes && note.attributes && { attributes: note.attributes }),
            },
            pairedItem: itemIndex,
          });
        }
        break;

      case 'children':
        // For children, we would need to implement a method to get child notes
        // This might require additional API methods or searching
        throw new Error('Read child notes operation not yet implemented');
        break;

      default:
        throw new Error(`Unknown operation mode: ${operationMode}`);
    }

    return results;
  }
}