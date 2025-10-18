import { TriliumBackendApiClient, TriliumNote, TriliumNoteParams } from '../TriliumBackendApiClient';

// Mock API object for testing
const mockApi = {
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
};

describe('TriliumBackendApiClient', () => {
  let client: TriliumBackendApiClient;

  beforeEach(() => {
    client = new TriliumBackendApiClient(mockApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when api object is not provided', () => {
      expect(() => new TriliumBackendApiClient(null as any)).toThrow(
        'Backend API object is required'
      );
    });

    it('should initialize with valid api object', () => {
      expect(() => new TriliumBackendApiClient(mockApi)).not.toThrow();
    });
  });

  describe('getAppInfo', () => {
    it('should return app info from API', () => {
      const mockAppInfo = {
        appVersion: '1.0.0',
        buildDate: '2024-01-01',
        buildRevision: 'abc123',
        clipperProtocolVersion: '1.0',
        dataDirectory: '/data',
        dbVersion: 1,
        nodeVersion: '18.0.0',
        syncVersion: 1,
        utcDateTime: '2024-01-01T00:00:00Z',
      };

      mockApi.getAppInfo.mockReturnValue(mockAppInfo);

      const result = client.getAppInfo();

      expect(result).toEqual(mockAppInfo);
      expect(mockApi.getAppInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNote', () => {
    it('should return null when note is not found', () => {
      mockApi.getNote.mockReturnValue(null);

      const result = client.getNote('nonexistent-id');

      expect(result).toBeNull();
      expect(mockApi.getNote).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should return formatted note when found', () => {
      const mockTriliumNote = {
        noteId: 'test-id',
        title: 'Test Note',
        getContent: () => 'Test content',
        type: 'text',
        mime: 'text/plain',
        isProtected: false,
        isDeleted: false,
        dateCreated: '2024-01-01',
        dateModified: '2024-01-01',
        utcDateCreated: '2024-01-01T00:00:00Z',
        utcDateModified: '2024-01-01T00:00:00Z',
        getAttributes: () => [
          {
            attributeId: 'attr1',
            noteId: 'test-id',
            type: 'label',
            name: 'test',
            value: 'value',
            position: 0,
            isInheritable: false,
          },
        ],
      };

      mockApi.getNote.mockReturnValue(mockTriliumNote);

      const result = client.getNote('test-id');

      expect(result).toEqual({
        noteId: 'test-id',
        title: 'Test Note',
        content: 'Test content',
        type: 'text',
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
            noteId: 'test-id',
            type: 'label',
            name: 'test',
            value: 'value',
            position: 0,
            isInheritable: false,
          },
        ],
      });
    });
  });

  describe('createNote', () => {
    it('should create note with basic parameters', () => {
      const noteParams: TriliumNoteParams = {
        parentNoteId: 'parent-id',
        title: 'New Note',
        content: 'Note content',
        type: 'text',
      };

      const mockCreatedNote = {
        noteId: 'new-id',
        title: 'New Note',
        getContent: () => 'Note content',
        type: 'text',
        getAttributes: () => [],
      };

      const mockResult = {
        note: mockCreatedNote,
        branch: { branchId: 'branch-id' },
      };

      mockApi.createNewNote.mockReturnValue(mockResult);

      const result = client.createNote(noteParams);

      expect(mockApi.createNewNote).toHaveBeenCalledWith({
        parentNoteId: 'parent-id',
        title: 'New Note',
        content: 'Note content',
        type: 'text',
        mime: undefined,
      });
      expect(result.note.noteId).toBe('new-id');
      expect(result.branch.branchId).toBe('branch-id');
    });

    it('should add labels when provided', () => {
      const noteParams: TriliumNoteParams = {
        parentNoteId: 'parent-id',
        title: 'New Note',
        content: 'Note content',
        attributes: [
          { type: 'label', name: 'priority', value: 'high' },
          { type: 'label', name: 'category', value: 'work' },
        ],
      };

      const mockCreatedNote = {
        noteId: 'new-id',
        title: 'New Note',
        getContent: () => 'Note content',
        type: 'text',
        getAttributes: () => [],
        setLabel: jest.fn(),
      };

      const mockResult = {
        note: mockCreatedNote,
        branch: { branchId: 'branch-id' },
      };

      mockApi.createNewNote.mockReturnValue(mockResult);

      client.createNote(noteParams);

      expect(mockCreatedNote.setLabel).toHaveBeenCalledWith('priority', 'high');
      expect(mockCreatedNote.setLabel).toHaveBeenCalledWith('category', 'work');
    });
  });

  describe('updateNote', () => {
    it('should update note with provided parameters', () => {
      const mockNote = {
        noteId: 'test-id',
        title: 'Original Title',
        setContent: jest.fn(),
        type: 'text',
        setLabel: jest.fn(),
      };

      mockApi.getNote.mockReturnValue(mockNote);

      const result = client.updateNote('test-id', {
        title: 'Updated Title',
        content: 'Updated content',
      });

      expect(mockNote.title).toBe('Updated Title');
      expect(mockNote.setContent).toHaveBeenCalledWith('Updated content');
    });

    it('should throw error when note not found', () => {
      mockApi.getNote.mockReturnValue(null);

      expect(() => client.updateNote('nonexistent-id', { title: 'New Title' }))
        .toThrow('Note with ID nonexistent-id not found');
    });
  });

  describe('deleteNote', () => {
    it('should delete note successfully', () => {
      const mockNote = {
        noteId: 'test-id',
        deleteNote: jest.fn(),
      };

      mockApi.getNote.mockReturnValue(mockNote);

      client.deleteNote('test-id');

      expect(mockNote.deleteNote).toHaveBeenCalledTimes(1);
    });

    it('should throw error when note not found', () => {
      mockApi.getNote.mockReturnValue(null);

      expect(() => client.deleteNote('nonexistent-id'))
        .toThrow('Note with ID nonexistent-id not found');
    });
  });

  describe('searchNotes', () => {
    it('should search notes with parameters', () => {
      const mockNotes = [
        {
          noteId: 'note1',
          title: 'Note 1',
          getContent: () => 'Content 1',
          type: 'text',
          getAttributes: () => [],
        },
        {
          noteId: 'note2',
          title: 'Note 2',
          getContent: () => 'Content 2',
          type: 'text',
          getAttributes: () => [],
        },
      ];

      mockApi.searchForNotes.mockReturnValue(mockNotes);

      const result = client.searchNotes({
        query: 'test query',
        includeArchivedNotes: false,
        limit: 10,
      });

      expect(mockApi.searchForNotes).toHaveBeenCalledWith('test query', {
        includeArchivedNotes: false,
        fastSearch: undefined,
      });
      expect(result).toHaveLength(2);
      expect(result[0].noteId).toBe('note1');
      expect(result[1].noteId).toBe('note2');
    });
  });

  describe('getNotesWithLabel', () => {
    it('should get notes with label name only', () => {
      const mockNotes = [
        {
          noteId: 'note1',
          title: 'Note 1',
          getContent: () => 'Content 1',
          type: 'text',
          getAttributes: () => [],
        },
      ];

      mockApi.getNotesWithLabel.mockReturnValue(mockNotes);

      const result = client.getNotesWithLabel('important');

      expect(mockApi.getNotesWithLabel).toHaveBeenCalledWith('important', undefined);
      expect(result).toHaveLength(1);
    });

    it('should get notes with label name and value', () => {
      const mockNotes = [
        {
          noteId: 'note1',
          title: 'Note 1',
          getContent: () => 'Content 1',
          type: 'text',
          getAttributes: () => [],
        },
      ];

      mockApi.getNotesWithLabel.mockReturnValue(mockNotes);

      const result = client.getNotesWithLabel('status', 'completed');

      expect(mockApi.getNotesWithLabel).toHaveBeenCalledWith('status', 'completed');
      expect(result).toHaveLength(1);
    });
  });

  describe('getNoteWithLabel', () => {
    it('should return single note with label', () => {
      const mockNote = {
        noteId: 'note1',
        title: 'Note 1',
        getContent: () => 'Content 1',
        type: 'text',
        getAttributes: () => [],
      };

      mockApi.getNoteWithLabel.mockReturnValue(mockNote);

      const result = client.getNoteWithLabel('important');

      expect(mockApi.getNoteWithLabel).toHaveBeenCalledWith('important', undefined);
      expect(result?.noteId).toBe('note1');
    });

    it('should return null when no note found', () => {
      mockApi.getNoteWithLabel.mockReturnValue(null);

      const result = client.getNoteWithLabel('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createTextNote', () => {
    it('should create text note using API', () => {
      const mockResult = {
        note: {
          noteId: 'text-note-id',
          title: 'Text Note',
          getContent: () => 'Text content',
          type: 'text',
          getAttributes: () => [],
        },
        branch: { branchId: 'branch-id' },
      };

      mockApi.createTextNote.mockReturnValue(mockResult);

      const result = client.createTextNote('parent-id', 'Text Note', 'Text content');

      expect(mockApi.createTextNote).toHaveBeenCalledWith('parent-id', 'Text Note', 'Text content');
      expect(result.note.noteId).toBe('text-note-id');
    });
  });

  describe('createDataNote', () => {
    it('should create data note using API', () => {
      const mockData = { key: 'value', number: 42 };
      const mockResult = {
        note: {
          noteId: 'data-note-id',
          title: 'Data Note',
          getContent: () => JSON.stringify(mockData),
          type: 'code',
          getAttributes: () => [],
        },
        branch: { branchId: 'branch-id' },
      };

      mockApi.createDataNote.mockReturnValue(mockResult);

      const result = client.createDataNote('parent-id', 'Data Note', mockData);

      expect(mockApi.createDataNote).toHaveBeenCalledWith('parent-id', 'Data Note', mockData);
      expect(result.note.noteId).toBe('data-note-id');
    });
  });

  describe('createBackup', () => {
    it('should create backup successfully', async () => {
      const mockBackupFileName = 'backup-2024-01-01.db';
      mockApi.backupNow.mockResolvedValue(mockBackupFileName);

      const result = await client.createBackup('test-backup');

      expect(mockApi.backupNow).toHaveBeenCalledWith('test-backup');
      expect(result).toBe(mockBackupFileName);
    });
  });

  describe('exportSubtree', () => {
    it('should export subtree successfully', async () => {
      mockApi.exportSubtreeToZipFile.mockResolvedValue(undefined);

      await expect(client.exportSubtree('note-id', 'html', '/path/to/export.zip'))
        .resolves.not.toThrow();

      expect(mockApi.exportSubtreeToZipFile).toHaveBeenCalledWith('note-id', 'html', '/path/to/export.zip');
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', () => {
      mockApi.getNote.mockImplementation(() => {
        throw new Error('API Error');
      });

      expect(() => client.getNote('test-id')).toThrow('API Error');
    });

    it('should handle malformed note data', () => {
      const malformedNote = {
        noteId: 'test-id',
        // Missing required properties
      };

      mockApi.getNote.mockReturnValue(malformedNote);

      // Should not throw, but return partial data
      const result = client.getNote('test-id');
      expect(result).toBeDefined();
    });
  });
});