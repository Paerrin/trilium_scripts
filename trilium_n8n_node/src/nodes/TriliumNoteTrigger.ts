import { ITriggerFunctions, INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { TriliumBackendApiClient, TriliumNote } from '../TriliumBackendApiClient';

/**
 * Trilium Note Trigger node
 * Triggers workflows based on Trilium events
 */
export class TriliumNoteTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Trilium Note Trigger',
    name: 'triliumNoteTrigger',
    icon: 'fa:bell',
    group: ['trigger'],
    version: 1,
    description: 'Triggers workflows when notes are created, modified, or deleted in Trilium',
    defaults: {
      name: 'Note Trigger',
      color: '#7f8c8d',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'triliumApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'trilium-webhook',
      },
    ],
    properties: [
      {
        displayName: 'Trigger Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          {
            name: 'Note Created',
            value: 'noteCreated',
            description: 'Trigger when a new note is created',
          },
          {
            name: 'Note Modified',
            value: 'noteModified',
            description: 'Trigger when a note is modified',
          },
          {
            name: 'Note Deleted',
            value: 'noteDeleted',
            description: 'Trigger when a note is deleted',
          },
          {
            name: 'Note Moved',
            value: 'noteMoved',
            description: 'Trigger when a note is moved to a different parent',
          },
        ],
        default: ['noteCreated'],
        description: 'Which events should trigger the workflow',
        required: true,
      },
      {
        displayName: 'Note Type Filter',
        name: 'noteTypeFilter',
        type: 'multiOptions',
        options: [
          {
            name: 'Text Notes',
            value: 'text',
            description: 'Trigger only for text notes',
          },
          {
            name: 'Code Notes',
            value: 'code',
            description: 'Trigger only for code notes',
          },
          {
            name: 'File Notes',
            value: 'file',
            description: 'Trigger only for file notes',
          },
          {
            name: 'Image Notes',
            value: 'image',
            description: 'Trigger only for image notes',
          },
        ],
        default: [],
        description: 'Filter by note type (leave empty for all types)',
      },
      {
        displayName: 'Label Filter',
        name: 'labelFilter',
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
                description: 'Label name to filter by',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Label value to filter by (optional)',
              },
              {
                displayName: 'Match Mode',
                name: 'matchMode',
                type: 'options',
                options: [
                  {
                    name: 'Has Label',
                    value: 'has',
                    description: 'Note must have this label',
                  },
                  {
                    name: 'Does Not Have Label',
                    value: 'not',
                    description: 'Note must not have this label',
                  },
                ],
                default: 'has',
                description: 'How to match the label',
              },
            ],
          },
        ],
        description: 'Filter events by note labels',
      },
      {
        displayName: 'Parent Note Filter',
        name: 'parentNoteFilter',
        type: 'string',
        default: '',
        description: 'Only trigger for notes under this parent note ID (optional)',
        placeholder: 'parent_note_id',
      },
      {
        displayName: 'Polling Interval',
        name: 'pollingInterval',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 3600,
        },
        default: 30,
        description: 'How often to check for new events (in seconds)',
        displayOptions: {
          hide: {
            triggerOn: ['webhook'],
          },
        },
      },
      {
        displayName: 'Trigger Mode',
        name: 'triggerMode',
        type: 'options',
        options: [
          {
            name: 'Webhook',
            value: 'webhook',
            description: 'Receive webhooks from Trilium',
          },
          {
            name: 'Polling',
            value: 'polling',
            description: 'Poll Trilium for changes',
          },
        ],
        default: 'polling',
        description: 'How to detect changes in Trilium',
      },
      {
        displayName: 'Include Note Content',
        name: 'includeContent',
        type: 'boolean',
        default: true,
        description: 'Include note content in the trigger data',
      },
      {
        displayName: 'Include Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: true,
        description: 'Include creation/modification dates and other metadata',
      },
      {
        displayName: 'Include Attributes',
        name: 'includeAttributes',
        type: 'boolean',
        default: true,
        description: 'Include labels and relations in the trigger data',
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData();

    // Process webhook data from Trilium
    const eventData = this.processWebhookEvent(body);

    return {
      workflowData: [eventData],
    };
  }

  async trigger(this: ITriggerFunctions): Promise<any> {
    const events = this.getNodeParameter('events') as string[];
    const noteTypeFilter = this.getNodeParameter('noteTypeFilter') as string[];
    const labelFilter = this.getNodeParameter('labelFilter') as any;
    const parentNoteFilter = this.getNodeParameter('parentNoteFilter') as string;
    const pollingInterval = this.getNodeParameter('pollingInterval') as number;
    const includeContent = this.getNodeParameter('includeContent') as boolean;
    const includeMetadata = this.getNodeParameter('includeMetadata') as boolean;
    const includeAttributes = this.getNodeParameter('includeAttributes') as boolean;

    // This would implement polling logic to check for changes
    // For now, return a placeholder
    await new Promise(resolve => setTimeout(resolve, pollingInterval * 1000));

    return null;
  }

  private processWebhookEvent(body: any): any {
    // Process incoming webhook data from Trilium
    // This would parse the webhook payload and format it for n8n

    return {
      json: {
        eventType: body.eventType || 'unknown',
        noteId: body.noteId,
        timestamp: body.timestamp || new Date().toISOString(),
        // Additional event data would be processed here
      },
    };
  }

  private shouldTriggerForNote(note: TriliumNote, filters: any): boolean {
    // Check if this note should trigger the workflow based on filters

    // Check note type filter
    if (filters.noteTypeFilter && filters.noteTypeFilter.length > 0) {
      if (!filters.noteTypeFilter.includes(note.type)) {
        return false;
      }
    }

    // Check label filter
    if (filters.labelFilter && filters.labelFilter.length > 0) {
      for (const labelRule of filters.labelFilter) {
        const hasLabel = note.attributes?.some(attr =>
          attr.type === 'label' &&
          attr.name === labelRule.name &&
          (!labelRule.value || attr.value === labelRule.value)
        );

        if (labelRule.matchMode === 'has' && !hasLabel) {
          return false;
        }
        if (labelRule.matchMode === 'not' && hasLabel) {
          return false;
        }
      }
    }

    // Check parent note filter
    if (filters.parentNoteFilter && note.parentNoteId !== filters.parentNoteFilter) {
      return false;
    }

    return true;
  }
}