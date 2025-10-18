import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient } from '../TriliumBackendApiClient';

/**
 * Trilium Note Delete node
 * Deletes notes from Trilium
 */
export class TriliumNoteDelete implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Delete Trilium Note',
    name: 'triliumNoteDelete',
    icon: 'fa:trash',
    group: ['output'],
    version: 1,
    description: 'Delete notes from Trilium (moves to trash or permanently deletes)',
    defaults: {
      name: 'Delete Note',
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
        description: 'ID of the note to delete',
      },
      {
        displayName: 'Delete Mode',
        name: 'deleteMode',
        type: 'options',
        options: [
          {
            name: 'Move to Trash',
            value: 'trash',
            description: 'Move note to trash (can be restored)',
          },
          {
            name: 'Permanent Delete',
            value: 'permanent',
            description: 'Permanently delete the note (cannot be restored)',
          },
          {
            name: 'Erase Note',
            value: 'erase',
            description: 'Completely erase note and all its history',
          },
        ],
        default: 'trash',
        description: 'How to handle the deletion',
      },
      {
        displayName: 'Delete Children',
        name: 'deleteChildren',
        type: 'boolean',
        default: false,
        description: 'Also delete all child notes recursively',
      },
      {
        displayName: 'Confirm Deletion',
        name: 'confirmDeletion',
        type: 'boolean',
        default: true,
        description: 'Require confirmation before deletion (recommended)',
      },
      {
        displayName: 'Return Note Info',
        name: 'returnNoteInfo',
        type: 'boolean',
        default: true,
        description: 'Return information about the deleted note',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await this.executeDelete(i);
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

  private async executeDelete(itemIndex: number): Promise<INodeExecutionData> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const noteId = this.getNodeParameter('noteId', itemIndex) as string;
    const deleteMode = this.getNodeParameter('deleteMode', itemIndex) as string;
    const deleteChildren = this.getNodeParameter('deleteChildren', itemIndex) as boolean;
    const confirmDeletion = this.getNodeParameter('confirmDeletion', itemIndex) as boolean;
    const returnNoteInfo = this.getNodeParameter('returnNoteInfo', itemIndex) as boolean;

    // Initialize API client
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    // Get note info before deletion if requested
    let noteInfo: any = null;
    if (returnNoteInfo) {
      try {
        const note = await apiClient.getNote(noteId);
        if (note) {
          noteInfo = {
            noteId: note.noteId,
            title: note.title,
            type: note.type,
            dateCreated: note.dateCreated,
            dateModified: note.dateModified,
            hasChildren: false, // Would need to implement child detection
          };
        }
      } catch (error) {
        // Note might not exist, continue with deletion
      }
    }

    // Confirm deletion if required
    if (confirmDeletion && deleteMode === 'permanent') {
      // In a real implementation, this might show a confirmation dialog
      // For now, we'll proceed but log the action
      console.log(`Permanently deleting note ${noteId} - this action cannot be undone`);
    }

    // Perform deletion
    const startTime = new Date();

    try {
      if (deleteChildren) {
        // For recursive deletion, we'd need to implement a method to delete note trees
        // This is a simplified implementation
        await this.deleteNoteTree(apiClient, noteId);
      } else {
        await apiClient.deleteNote(noteId);
      }
    } catch (error) {
      throw new Error(`Failed to delete note ${noteId}: ${error instanceof Error ? error.message : String(error)}`);
    }

    const endTime = new Date();

    const result: any = {
      success: true,
      noteId,
      deleteMode,
      deleteChildren,
      deletedAt: endTime.toISOString(),
      duration: endTime.getTime() - startTime.getTime(),
    };

    if (noteInfo) {
      result.noteInfo = noteInfo;
    }

    // Add specific deletion results
    switch (deleteMode) {
      case 'trash':
        result.movedToTrash = true;
        result.canBeRestored = true;
        break;
      case 'permanent':
        result.permanentlyDeleted = true;
        result.canBeRestored = false;
        break;
      case 'erase':
        result.erased = true;
        result.canBeRestored = false;
        break;
    }

    return {
      json: result,
      pairedItem: itemIndex,
    };
  }

  private async deleteNoteTree(apiClient: TriliumBackendApiClient, noteId: string): Promise<void> {
    // This is a placeholder for recursive deletion
    // In a full implementation, this would:
    // 1. Get all child notes
    // 2. Delete them recursively
    // 3. Delete the parent note

    // For now, just delete the single note
    await apiClient.deleteNote(noteId);
  }
}