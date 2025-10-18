import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient } from '../TriliumBackendApiClient';

/**
 * Trilium Note Search node
 * Advanced search functionality for finding notes in Trilium
 */
export class TriliumNoteSearch implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Search Trilium Notes',
    name: 'triliumNoteSearch',
    icon: 'fa:search',
    group: ['input'],
    version: 1,
    description: 'Search for notes in Trilium using advanced query filters',
    defaults: {
      name: 'Search Notes',
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
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        required: true,
        default: '',
        description: 'Search query using Trilium search syntax (e.g., "#todo AND #urgent")',
        placeholder: '#label OR "search text"',
      },
      {
        displayName: 'Search Type',
        name: 'searchType',
        type: 'options',
        options: [
          {
            name: 'Notes',
            value: 'notes',
            description: 'Search in note content and titles',
          },
          {
            name: 'Templates',
            value: 'templates',
            description: 'Search for template notes',
          },
          {
            name: 'Archived',
            value: 'archived',
            description: 'Include archived/deleted notes',
          },
        ],
        default: 'notes',
        description: 'Type of content to search',
      },
      {
        displayName: 'Include Archived Notes',
        name: 'includeArchived',
        type: 'boolean',
        default: false,
        description: 'Include archived/deleted notes in search results',
      },
      {
        displayName: 'Fast Search',
        name: 'fastSearch',
        type: 'boolean',
        default: true,
        description: 'Use fast search (may be less accurate but faster)',
      },
      {
        displayName: 'Max Results',
        name: 'maxResults',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 1000,
        },
        default: 50,
        description: 'Maximum number of results to return (1-1000)',
      },
      {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'options',
        options: [
          {
            name: 'Relevance',
            value: 'relevance',
            description: 'Sort by search relevance score',
          },
          {
            name: 'Date Created',
            value: 'dateCreated',
            description: 'Sort by creation date (newest first)',
          },
          {
            name: 'Date Modified',
            value: 'dateModified',
            description: 'Sort by modification date (newest first)',
          },
          {
            name: 'Title',
            value: 'title',
            description: 'Sort alphabetically by title',
          },
        ],
        default: 'relevance',
        description: 'How to sort the search results',
      },
      {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'options',
        options: [
          {
            name: 'Descending',
            value: 'desc',
            description: 'Sort in descending order',
          },
          {
            name: 'Ascending',
            value: 'asc',
            description: 'Sort in ascending order',
          },
        ],
        default: 'desc',
        description: 'Sort order direction',
      },
      {
        displayName: 'Return Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: true,
        description: 'Include creation/modification dates and other metadata',
      },
      {
        displayName: 'Return Content',
        name: 'includeContent',
        type: 'boolean',
        default: true,
        description: 'Include note content in results (disable for better performance)',
      },
      {
        displayName: 'Return Attributes',
        name: 'includeAttributes',
        type: 'boolean',
        default: true,
        description: 'Include labels and relations in results',
      },
      {
        displayName: 'Content Preview Length',
        name: 'previewLength',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 1000,
        },
        default: 200,
        description: 'Length of content preview in characters (0 for no preview)',
        displayOptions: {
          show: {
            includeContent: [true],
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
        const results = await this.executeSearch(i);
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

  private async executeSearch(itemIndex: number): Promise<INodeExecutionData[]> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
    const searchType = this.getNodeParameter('searchType', itemIndex) as string;
    const includeArchived = this.getNodeParameter('includeArchived', itemIndex) as boolean;
    const fastSearch = this.getNodeParameter('fastSearch', itemIndex) as boolean;
    const maxResults = this.getNodeParameter('maxResults', itemIndex) as number;
    const sortBy = this.getNodeParameter('sortBy', itemIndex) as string;
    const sortOrder = this.getNodeParameter('sortOrder', itemIndex) as string;
    const includeMetadata = this.getNodeParameter('includeMetadata', itemIndex) as boolean;
    const includeContent = this.getNodeParameter('includeContent', itemIndex) as boolean;
    const includeAttributes = this.getNodeParameter('includeAttributes', itemIndex) as boolean;
    const previewLength = this.getNodeParameter('previewLength', itemIndex) as number;

    // Initialize API client
    let apiClient: TriliumBackendApiClient;

    if (credentials.apiType === 'backend') {
      // For backend API, we would need the global api object
      throw new Error('Backend Script API not yet supported in this implementation');
    } else {
      // For ETAPI, we would use HTTP client
      throw new Error('ETAPI not yet supported in this implementation');
    }

    // Prepare search parameters
    const searchParams: any = {
      includeArchivedNotes: includeArchived,
      fastSearch,
    };

    // Execute search
    const notes = await apiClient.searchNotes({
      query: searchQuery,
      includeArchivedNotes: includeArchived,
      limit: maxResults,
    });

    // Apply sorting
    let sortedNotes = [...notes];
    this.applySorting(sortedNotes, sortBy, sortOrder);

    // Apply max results limit
    const limitedNotes = sortedNotes.slice(0, maxResults);

    const results: INodeExecutionData[] = [];

    for (const note of limitedNotes) {
      const result: any = {
        noteId: note.noteId,
        title: note.title,
        type: note.type,
        isProtected: note.isProtected,
        isDeleted: note.isDeleted,
        relevanceScore: Math.random(), // Placeholder for search relevance
      };

      // Include content if requested
      if (includeContent) {
        result.content = note.content;
        if (previewLength > 0 && note.content.length > previewLength) {
          result.contentPreview = note.content.substring(0, previewLength) + '...';
        }
      }

      // Include metadata if requested
      if (includeMetadata) {
        result.dateCreated = note.dateCreated;
        result.dateModified = note.dateModified;
        result.utcDateCreated = note.utcDateCreated;
        result.utcDateModified = note.utcDateModified;
      }

      // Include attributes if requested
      if (includeAttributes && note.attributes) {
        result.attributes = note.attributes;
      }

      results.push({
        json: result,
        pairedItem: itemIndex,
      });
    }

    return results;
  }

  private applySorting(notes: any[], sortBy: string, sortOrder: string): void {
    notes.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateCreated':
          comparison = new Date(a.dateCreated || 0).getTime() - new Date(b.dateCreated || 0).getTime();
          break;
        case 'dateModified':
          comparison = new Date(a.dateModified || 0).getTime() - new Date(b.dateModified || 0).getTime();
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'relevance':
        default:
          // For relevance, use search score if available, otherwise fall back to dateModified
          const scoreA = a.searchScore || new Date(a.dateModified || 0).getTime();
          const scoreB = b.searchScore || new Date(b.dateModified || 0).getTime();
          comparison = scoreB - scoreA; // Higher scores first
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }
}