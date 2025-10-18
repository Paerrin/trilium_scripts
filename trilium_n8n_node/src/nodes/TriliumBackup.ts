import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { TriliumBackendApiClient } from '../TriliumBackendApiClient';

/**
 * Trilium Backup node
 * Creates backups of Trilium data
 */
export class TriliumBackup implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Trilium Backup',
    name: 'triliumBackup',
    icon: 'fa:archive',
    group: ['output'],
    version: 1,
    description: 'Create backups of your Trilium data',
    defaults: {
      name: 'Backup',
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
        displayName: 'Backup Name',
        name: 'backupName',
        type: 'string',
        required: true,
        default: 'backup-{{ $now.format("YYYY-MM-DD-HH-mm-ss") }}',
        description: 'Name for the backup file (without extension)',
      },
      {
        displayName: 'Backup Type',
        name: 'backupType',
        type: 'options',
        options: [
          {
            name: 'Full Backup',
            value: 'full',
            description: 'Complete database backup',
          },
          {
            name: 'Data Only',
            value: 'data',
            description: 'Backup only note data (excluding binaries)',
          },
        ],
        default: 'full',
        description: 'Type of backup to create',
      },
      {
        displayName: 'Compression',
        name: 'compression',
        type: 'options',
        options: [
          {
            name: 'GZIP',
            value: 'gzip',
            description: 'Compressed backup (smaller file size)',
          },
          {
            name: 'None',
            value: 'none',
            description: 'Uncompressed backup (faster)',
          },
        ],
        default: 'gzip',
        description: 'Compression level for the backup',
      },
      {
        displayName: 'Output Directory',
        name: 'outputDirectory',
        type: 'string',
        default: '',
        description: 'Directory to save the backup (leave empty for default)',
        placeholder: '/path/to/backup/directory',
      },
      {
        displayName: 'Include Metadata',
        name: 'includeMetadata',
        type: 'boolean',
        default: true,
        description: 'Include creation date and backup information in response',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const result = await this.executeBackup(i);
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

  private async executeBackup(itemIndex: number): Promise<INodeExecutionData> {
    const credentials = await this.getCredentials('triliumApi');

    // Get parameters
    const backupName = this.getNodeParameter('backupName', itemIndex) as string;
    const backupType = this.getNodeParameter('backupType', itemIndex) as string;
    const compression = this.getNodeParameter('compression', itemIndex) as string;
    const outputDirectory = this.getNodeParameter('outputDirectory', itemIndex) as string;
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

    // Create backup
    const startTime = new Date();
    const backupFileName = await apiClient.createBackup(backupName);
    const endTime = new Date();

    // Get file size (would need actual implementation)
    const fileSize = 0; // Placeholder

    const result: any = {
      success: true,
      backupName,
      backupFileName,
      backupType,
      compression,
      createdAt: startTime.toISOString(),
      completedAt: endTime.toISOString(),
      duration: endTime.getTime() - startTime.getTime(),
      fileSize,
    };

    if (outputDirectory) {
      result.outputDirectory = outputDirectory;
    }

    if (includeMetadata) {
      // Add additional metadata about the backup process
      result.metadata = {
        backupMethod: credentials.apiType,
        serverInfo: 'retrieved_at_backup_time',
        nodeVersion: process.version,
        platform: process.platform,
      };
    }

    return {
      json: result,
      pairedItem: itemIndex,
    };
  }
}