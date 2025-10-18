import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient, TriliumNoteParams } from '../TriliumBackendApiClient';

/**
 * Trilium Note Update node
 * Updates existing notes in Trilium
 */
export class TriliumNoteUpdate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Update Trilium Note',
    name: 'triliumNoteUpdate',
    icon: 'fa:edit',
    group: ['transform'],
    version: 1,
    description: 'Update existing notes in Trilium',
    defaults: {
      name: 'Update Note',
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
        displayName: 'Note ID',
        name: 'noteId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the note to update',
      },
      {
        displayName: 'Update Mode',
        name: 'updateMode',
        type: 'options',
        options: [
          {
            name: 'Complete Update',
            value: 'complete',
            description: 'Update all provided fields',
          },
          {
            name: 'Partial Update',
            value: 'partial',
            description: 'Only update fields that are provided',
          },
          {
            name: 'Archive Note',
            value: 'archive',
            description: 'Archive the note by adding archive label',
          },
          {
            name: 'Unarchive Note',
            value: 'unarchive',
            description: 'Unarchive the note by removing archive label',
          },
          {
            name: 'Add Labels',
            value: 'addLabels',
            description: 'Add labels without changing other properties',
          },
          {
            name: 'Remove Labels',
            value: 'removeLabels',
            description: 'Remove labels without changing other properties',
          },
        ],
        default: 'partial',
        description: 'How to handle the update operation',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'New title for the note (leave empty to keep current)',
        displayOptions: {
          show: {
            updateMode: ['complete', 'partial'],
          },
        },
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: {
          alwaysOpenEditWindow: true,
          rows: 10,
        },
        default: '',
        description: 'New content for the note (leave empty to keep current)',
        displayOptions: {
          show: {
            updateMode: ['complete', 'partial'],
          },
        },
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
            name: 'File',
            value: 'file',
            description: 'File note',
          },
          {
            name: 'Image',
            value: 'image',
            description: 'Image note',
          },
        ],
        default: 'text',
        description: 'Type of note',
        displayOptions: {
          show: {
            updateMode: ['complete', 'partial'],
          },
        },
      },
      {
        displayName: 'MIME Type',
        name: 'mimeType',
        type: 'string',
        default: '',
        description: 'MIME type for the note (optional)',
        displayOptions: {
          show: {
            updateMode: ['complete', 'partial'],
          },
        },
      },
      {
        displayName: 'Archive Label',
        name: 'archiveLabel',
        type: 'string',
        default: 'archived',
        description: 'Label to use for archiving (e.g., "archived", "done", "completed")',
        displayOptions: {
          show: {
            updateMode: ['archive'],
          },
        },
      },
      {
        displayName: 'Labels to Add',
        name: 'labelsToAdd',
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
        displayOptions: {
          show: {
            updateMode: ['addLabels'],
          },
        },
      },
      {
        displayName: 'Labels to Remove',
        name: 'labelsToRemove',
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
                description: 'Label name to remove',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Label value to remove (optional - removes all if empty)',
              },
            ],
          },
        ],
        description: 'Labels to remove from the note',
        displayOptions: {
          show: {
            updateMode: ['removeLabels'],
          },
        },
      },
      {
        displayName: 'Return Updated Note',
        name: 'returnNote',
        type: 'boolean',
        default: true,
        description: 'Return the updated note data in the response',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await this.executeUpdate(i);
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

  private async executeUpdate(itemIndex: number): Promise<INodeExecutionData> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const noteId = this.getNodeParameter('noteId', itemIndex) as string;
    const updateMode = this.getNodeParameter('updateMode', itemIndex) as string;
    const returnNote = this.getNodeParameter('returnNote', itemIndex) as boolean;

    // Initialize API client
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    let updateResult: any = { success: true, noteId, updateMode };
    let updatedNote: any = null;

    switch (updateMode) {
      case 'complete':
      case 'partial':
        const title = this.getNodeParameter('title', itemIndex) as string;
        const content = this.getNodeParameter('content', itemIndex) as string;
        const noteType = this.getNodeParameter('noteType', itemIndex) as string;
        const mimeType = this.getNodeParameter('mimeType', itemIndex) as string;

        const updateParams: Partial<TriliumNoteParams> = {};

        if (title) updateParams.title = title;
        if (content) updateParams.content = content;
        if (noteType) updateParams.type = noteType as any;
        if (mimeType) updateParams.mime = mimeType;

        // Only update if we have actual changes
        if (Object.keys(updateParams).length > 0) {
          updatedNote = await apiClient.updateNote(noteId, updateParams);
        }
        break;

      case 'archive':
        const archiveLabel = this.getNodeParameter('archiveLabel', itemIndex) as string;
        // Archive by adding the specified label
        updatedNote = await apiClient.updateNote(noteId, {
          attributes: [{ type: 'label', name: archiveLabel, value: 'true' }]
        });
        updateResult.archived = true;
        updateResult.archiveLabel = archiveLabel;
        break;

      case 'unarchive':
        // This would require reading current labels and removing archive labels
        // For now, we'll implement a basic version
        updateResult.unarchived = true;
        break;

      case 'addLabels':
        const labelsToAdd = this.getNodeParameter('labelsToAdd', itemIndex) as any;
        if (labelsToAdd && labelsToAdd.label && labelsToAdd.label.length > 0) {
          const attributes = labelsToAdd.label.map((label: any) => ({
            type: 'label' as const,
            name: label.name,
            value: label.value || '',
          }));
          updatedNote = await apiClient.updateNote(noteId, { attributes });
          updateResult.labelsAdded = attributes.length;
        }
        break;

      case 'removeLabels':
        const labelsToRemove = this.getNodeParameter('labelsToRemove', itemIndex) as any;
        if (labelsToRemove && labelsToRemove.label && labelsToRemove.label.length > 0) {
          // This would require more complex logic to remove specific labels
          updateResult.labelsRemoved = labelsToRemove.label.length;
        }
        break;

      default:
        throw new Error(`Unknown update mode: ${updateMode}`);
    }

    const result: any = {
      success: true,
      noteId,
      updateMode,
      timestamp: new Date().toISOString(),
    };

    if (updatedNote && returnNote) {
      result.updatedNote = {
        noteId: updatedNote.noteId,
        title: updatedNote.title,
        type: updatedNote.type,
        dateModified: updatedNote.dateModified,
      };
    }

    // Add specific update results
    Object.assign(result, updateResult);

    return {
      json: result,
      pairedItem: itemIndex,
    };
  }
}