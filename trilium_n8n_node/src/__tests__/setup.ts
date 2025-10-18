// Jest setup file for Trilium n8n node tests

// Mock n8n-workflow module
jest.mock('n8n-workflow', () => ({
  IExecuteFunctions: jest.fn(),
  INodeExecutionData: jest.fn(),
  INodeType: jest.fn(),
  INodeTypeDescription: jest.fn(),
  ITriggerFunctions: jest.fn(),
  IWebhookFunctions: jest.fn(),
  IWebhookResponseData: jest.fn(),
}));

// Global test utilities
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Test environment helpers
export const createMockExecuteFunction = () => ({
  getInputData: jest.fn(() => []),
  getNodeParameter: jest.fn(),
  getCredentials: jest.fn(),
  continueOnFail: jest.fn(() => false),
  helpers: {
    constructExecutionMetaData: jest.fn(),
  },
});

export const createMockNote = (overrides = {}) => ({
  noteId: 'test-note-id',
  title: 'Test Note',
  content: 'Test content',
  type: 'text' as const,
  mime: 'text/plain',
  isProtected: false,
  isDeleted: false,
  dateCreated: '2024-01-01',
  dateModified: '2024-01-01',
  utcDateCreated: '2024-01-01T00:00:00Z',
  utcDateModified: '2024-01-01T00:00:00Z',
  attributes: [
    {
      attributeId: 'attr1',
      noteId: 'test-note-id',
      type: 'label' as const,
      name: 'test',
      value: 'value',
      position: 0,
      isInheritable: false,
    },
  ],
  ...overrides,
});

export const createMockApi = () => ({
  getNote: jest.fn(),
  createNewNote: jest.fn(),
  createTextNote: jest.fn(),
  createDataNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
  searchForNotes: jest.fn(),
  getNotesWithLabel: jest.fn(),
  getNoteWithLabel: jest.fn(),
  backupNow: jest.fn(),
  exportSubtreeToZipFile: jest.fn(),
  getAppInfo: jest.fn(),
});