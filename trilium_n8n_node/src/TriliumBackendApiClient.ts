/**
 * Backend Script API Client for Trilium
 * This client interfaces with Trilium's JavaScript backend API
 */

export interface TriliumNote {
  noteId: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'file' | 'image' | 'search' | 'relation-map' | 'canvas';
  mime?: string;
  isProtected?: boolean;
  isDeleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  utcDateCreated?: string;
  utcDateModified?: string;
  attributes?: Array<{
    attributeId: string;
    noteId: string;
    type: 'label' | 'relation';
    name: string;
    value?: string;
    position?: number;
    isInheritable?: boolean;
  }>;
}

export interface TriliumNoteParams {
  parentNoteId: string;
  title: string;
  content: string;
  type?: 'text' | 'code' | 'file' | 'image' | 'search' | 'relation-map' | 'canvas';
  mime?: string;
  isProtected?: boolean;
  attributes?: Array<{
    type: 'label' | 'relation';
    name: string;
    value?: string;
  }>;
}

export interface TriliumSearchParams {
  query: string;
  searchType?: 'notes' | 'templates';
  limit?: number;
  includeArchivedNotes?: boolean;
}

export interface TriliumAppInfo {
  appVersion: string;
  buildDate: string;
  buildRevision: string;
  clipperProtocolVersion: string;
  dataDirectory: string;
  dbVersion: number;
  nodeVersion: string;
  syncVersion: number;
  utcDateTime: string;
}

/**
 * Backend Script API Client
 * Interfaces with Trilium's global `api` object available in backend scripts
 */
export class TriliumBackendApiClient {
  private api: any;

  constructor(api: any) {
    if (!api) {
      throw new Error('Backend API object is required. This client must be used within a Trilium backend script context.');
    }
    this.api = api;
  }

  /**
   * Get application information
   */
  getAppInfo(): TriliumAppInfo {
    return this.api.getAppInfo();
  }

  /**
   * Get a specific note by ID
   */
  getNote(noteId: string): TriliumNote | null {
    const note = this.api.getNote(noteId);
    if (!note) return null;

    return {
      noteId: note.noteId,
      title: note.title,
      content: note.getContent(),
      type: note.type,
      mime: note.mime,
      isProtected: note.isProtected,
      isDeleted: note.isDeleted,
      dateCreated: note.dateCreated,
      dateModified: note.dateModified,
      utcDateCreated: note.utcDateCreated,
      utcDateModified: note.utcDateModified,
      attributes: note.getAttributes().map((attr: any) => ({
        attributeId: attr.attributeId,
        noteId: attr.noteId,
        type: attr.type,
        name: attr.name,
        value: attr.value,
        position: attr.position,
        isInheritable: attr.isInheritable,
      })),
    };
  }

  /**
   * Create a new note
   */
  createNote(params: TriliumNoteParams): { note: TriliumNote; branch: any } {
    const result = this.api.createNewNote({
      parentNoteId: params.parentNoteId,
      title: params.title,
      content: params.content,
      type: params.type || 'text',
      mime: params.mime,
    });

    // Add attributes if provided
    if (params.attributes && params.attributes.length > 0) {
      for (const attr of params.attributes) {
        if (attr.type === 'label') {
          result.note.setLabel(attr.name, attr.value || '');
        } else if (attr.type === 'relation') {
          result.note.setRelation(attr.name, attr.value || '');
        }
      }
    }

    return {
      note: this.noteToTriliumNote(result.note),
      branch: result.branch,
    };
  }

  /**
   * Update an existing note
   */
  updateNote(noteId: string, updates: Partial<TriliumNoteParams>): TriliumNote {
    const note = this.api.getNote(noteId);
    if (!note) {
      throw new Error(`Note with ID ${noteId} not found`);
    }

    if (updates.title) note.title = updates.title;
    if (updates.content) note.setContent(updates.content);
    if (updates.type) note.type = updates.type;
    if (updates.mime) note.mime = updates.mime;

    // Update attributes if provided
    if (updates.attributes) {
      for (const attr of updates.attributes) {
        if (attr.type === 'label') {
          note.setLabel(attr.name, attr.value || '');
        } else if (attr.type === 'relation') {
          note.setRelation(attr.name, attr.value || '');
        }
      }
    }

    return this.noteToTriliumNote(note);
  }

  /**
   * Delete a note
   */
  deleteNote(noteId: string): void {
    const note = this.api.getNote(noteId);
    if (!note) {
      throw new Error(`Note with ID ${noteId} not found`);
    }
    note.deleteNote();
  }

  /**
   * Search for notes
   */
  searchNotes(params: TriliumSearchParams): TriliumNote[] {
    const notes = this.api.searchForNotes(params.query, {
      includeArchivedNotes: params.includeArchivedNotes || false,
    });

    return notes.slice(0, params.limit || 100).map((note: any) => this.noteToTriliumNote(note));
  }

  /**
   * Get notes with specific label
   */
  getNotesWithLabel(name: string, value?: string): TriliumNote[] {
    return this.api.getNotesWithLabel(name, value).map((note: any) => this.noteToTriliumNote(note));
  }

  /**
   * Get a single note with specific label
   */
  getNoteWithLabel(name: string, value?: string): TriliumNote | null {
    const note = this.api.getNoteWithLabel(name, value);
    return note ? this.noteToTriliumNote(note) : null;
  }

  /**
   * Create a backup
   */
  async createBackup(backupName: string): Promise<string> {
    return await this.api.backupNow(backupName);
  }

  /**
   * Create a text note (simplified version of createNote)
   */
  createTextNote(parentNoteId: string, title: string, content: string): { note: TriliumNote; branch: any } {
    const result = this.api.createTextNote(parentNoteId, title, content);
    return {
      note: this.noteToTriliumNote(result.note),
      branch: result.branch,
    };
  }

  /**
   * Create a data note (for JSON content)
   */
  createDataNote(parentNoteId: string, title: string, content: any): { note: TriliumNote; branch: any } {
    const result = this.api.createDataNote(parentNoteId, title, content);
    return {
      note: this.noteToTriliumNote(result.note),
      branch: result.branch,
    };
  }

  /**
   * Export subtree to ZIP file
   */
  async exportSubtree(noteId: string, format: 'html' | 'markdown', zipFilePath: string): Promise<void> {
    await this.api.exportSubtreeToZipFile(noteId, format, zipFilePath);
  }

  /**
   * Helper method to convert Trilium note object to our interface
   */
  private noteToTriliumNote(note: any): TriliumNote {
    return {
      noteId: note.noteId,
      title: note.title,
      content: note.getContent(),
      type: note.type,
      mime: note.mime,
      isProtected: note.isProtected,
      isDeleted: note.isDeleted,
      dateCreated: note.dateCreated,
      dateModified: note.dateModified,
      utcDateCreated: note.utcDateCreated,
      utcDateModified: note.utcDateModified,
      attributes: note.getAttributes().map((attr: any) => ({
        attributeId: attr.attributeId,
        noteId: attr.noteId,
        type: attr.type,
        name: attr.name,
        value: attr.value,
        position: attr.position,
        isInheritable: attr.isInheritable,
      })),
    };
  }
}