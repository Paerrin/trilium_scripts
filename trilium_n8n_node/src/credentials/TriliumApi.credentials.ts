import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TriliumApi implements ICredentialType {
  name = 'triliumApi';
  displayName = 'Trilium API';
  documentationUrl = 'https://github.com/zadam/trilium';
  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'serverUrl',
      type: 'string',
      default: 'http://localhost:37840',
      placeholder: 'http://localhost:37840',
      description: 'URL of your Trilium server',
    },
    {
      displayName: 'API Type',
      name: 'apiType',
      type: 'options',
      options: [
        {
          name: 'ETAPI (External API)',
          value: 'etapi',
          description: 'Use HTTP REST API for external integrations',
        },
        {
          name: 'Backend Script API',
          value: 'backend',
          description: 'Use JavaScript API for internal scripts',
        },
      ],
      default: 'etapi',
      description: 'Which API to use for communication with Trilium',
    },
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'API token for authentication (required for ETAPI)',
      displayOptions: {
        show: {
          apiType: ['etapi'],
        },
      },
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'Username for ETAPI authentication',
      displayOptions: {
        show: {
          apiType: ['etapi'],
        },
      },
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Password for ETAPI authentication',
      displayOptions: {
        show: {
          apiType: ['etapi'],
        },
      },
    },
  ];
}