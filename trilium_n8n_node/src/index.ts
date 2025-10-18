import { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { TriliumNote } from './nodes/TriliumNote';
import { TriliumNoteCreate } from './nodes/TriliumNoteCreate';
import { TriliumNoteRead } from './nodes/TriliumNoteRead';
import { TriliumNoteUpdate } from './nodes/TriliumNoteUpdate';
import { TriliumNoteDelete } from './nodes/TriliumNoteDelete';
import { TriliumNoteSearch } from './nodes/TriliumNoteSearch';
import { TriliumNoteTrigger } from './nodes/TriliumNoteTrigger';
import { TriliumBackup } from './nodes/TriliumBackup';
import { TriliumExport } from './nodes/TriliumExport';

// Export all node types for n8n community node package
export const nodeTypes: INodeType[] = [
  new TriliumNote(),
  new TriliumNoteCreate(),
  new TriliumNoteRead(),
  new TriliumNoteUpdate(),
  new TriliumNoteDelete(),
  new TriliumNoteSearch(),
  new TriliumNoteTrigger(),
  new TriliumBackup(),
  new TriliumExport(),
];

// Export API clients and credentials
export { TriliumApiClient } from './TriliumApiClient';
export { TriliumBackendApiClient } from './TriliumBackendApiClient';
export { TriliumApi } from './credentials/TriliumApi.credentials';

// Export types (handling conflicts by using specific exports)
export type {
  TriliumNote,
  TriliumNoteParams,
  TriliumSearchParams,
  TriliumAppInfo
} from './TriliumApiClient';