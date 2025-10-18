import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient, TriliumNoteParams } from '../TriliumBackendApiClient';

/**
 * Trilium Note Create node
 * Creates new notes in Trilium
 */
export class TriliumNoteCreate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Create Trilium Note',
    name: 'triliumNoteCreate',
    icon: 'file:trilium.svg',
    group: ['output'],
    version: 1,
    description: 'Create a new note in Trilium',
    defaults: {
      name: 'Create Note',
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
        displayName: 'Parent Note ID',
        name: 'parentNoteId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the parent note where the new note will be created',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        description: 'Title of the new note',
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        required: true,
        typeOptions: {
          alwaysOpenEditWindow: true,
          rows: 10,
        },
        default: '',
        description: 'Content of the new note',
      },
      {
        displayName: 'Note Type',
        name: 'noteType',
        type: 'options',
        options: [
          {
            name: 'Text',
            value: 'text',
            description: 'Regular text note',
          },
          {
            name: 'Code',
            value: 'code',
            description: 'Code note with syntax highlighting',
          },
          {
            name: 'Data (JSON)',
            value: 'data',
            description: 'JSON data note',
          },
        ],
        default: 'text',
        description: 'Type of note to create',
      },
      {
        displayName: 'MIME Type',
        name: 'mimeType',
        type: 'string',
        default: '',
        description: 'MIME type for the note (optional)',
      },
      {
        displayName: 'Labels',
        name: 'labels',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            displayName: 'Label',
            name: 'label',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                required: true,
                default: '',
                description: 'Label name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Label value (optional)',
              },
            ],
          },
        ],
        description: 'Labels to add to the note',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await this.executeCreate(i);
        returnData.push(...result);
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

  private async executeCreate(itemIndex: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const parentNoteId = this.getNodeParameter('parentNoteId', itemIndex) as string;
    const title = this.getNodeParameter('title', itemIndex) as string;
    const content = this.getNodeParameter('content', itemIndex) as string;
    const noteType = this.getNodeParameter('noteType', itemIndex) as string;
    const mimeType = this.getNodeParameter('mimeType', itemIndex) as string;
    const labels = this.getNodeParameter('labels', itemIndex) as any;

    // Initialize API client based on credentials
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      // This is a simplified implementation
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    // Create note based on type
    let result: any;

    if (noteType === 'data') {
      // For JSON data, use appropriate method based on API type
      throw new Error('Data note creation not yet implemented');
    } else {
      // For regular text/code notes
      const noteParams: TriliumNoteParams = {
        parentNoteId,
        title,
        content,
        type: noteType as 'text' | 'code',
        mime: mimeType || undefined,
      };

      // Add labels if provided
      if (labels && labels.label && labels.label.length > 0) {
        noteParams.attributes = labels.label.map((label: any) => ({
          type: 'label',
          name: label.name,
          value: label.value || '',
        }));
      }

      result = await apiClient.createNote(noteParams);
    }

    return [{
      json: {
        success: true,
        noteId: result.note.noteId,
        title: result.note.title,
        note: result.note,
        branch: result.branch,
      },
      pairedItem: itemIndex,
    }];
  }
}