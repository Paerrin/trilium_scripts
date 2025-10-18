import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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

export class TriliumApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, apiToken?: string) {
    this.baseURL = baseURL.replace(/\/$/, '');

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { 'Authorization': `Bearer ${apiToken}` }),
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          throw new Error('Unauthorized: Invalid API token');
        }
        if (error.response?.status === 404) {
          throw new Error(`Not found: ${error.response.data?.message || 'Resource not found'}`);
        }
        if (error.response?.status >= 500) {
          throw new Error(`Server error: ${error.response.data?.message || 'Internal server error'}`);
        }
        throw new Error(error.response?.data?.message || error.message);
      }
    );
  }

  /**
   * Get application information
   */
  async getAppInfo(): Promise<TriliumAppInfo> {
    const response: AxiosResponse<TriliumAppInfo> = await this.client.get('/api/app-info');
    return response.data;
  }

  /**
   * Get a specific note by ID
   */
  async getNote(noteId: string): Promise<TriliumNote> {
    const response: AxiosResponse<TriliumNote> = await this.client.get(`/api/notes/${noteId}`);
    return response.data;
  }

  /**
   * Create a new note
   */
  async createNote(params: TriliumNoteParams): Promise<{ note: TriliumNote; branch: any }> {
    const response: AxiosResponse<{ note: TriliumNote; branch: any }> = await this.client.post('/api/notes', params);
    return response.data;
  }

  /**
   * Update an existing note
   */
  async updateNote(noteId: string, updates: Partial<TriliumNoteParams>): Promise<TriliumNote> {
    const response: AxiosResponse<TriliumNote> = await this.client.patch(`/api/notes/${noteId}`, updates);
    return response.data;
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    await this.client.delete(`/api/notes/${noteId}`);
  }

  /**
   * Search for notes
   */
  async searchNotes(params: TriliumSearchParams): Promise<TriliumNote[]> {
    const response: AxiosResponse<TriliumNote[]> = await this.client.post('/api/notes/search', params);
    return response.data;
  }

  /**
   * Get notes with specific label
   */
  async getNotesWithLabel(name: string, value?: string): Promise<TriliumNote[]> {
    const endpoint = value
      ? `/api/notes/labels/${encodeURIComponent(name)}/${encodeURIComponent(value)}`
      : `/api/notes/labels/${encodeURIComponent(name)}`;

    const response: AxiosResponse<TriliumNote[]> = await this.client.get(endpoint);
    return response.data;
  }

  /**
   * Create a backup
   */
  async createBackup(backupName: string): Promise<string> {
    const response: AxiosResponse<string> = await this.client.post('/api/backup', { backupName });
    return response.data;
  }

  /**
   * Export subtree as ZIP
   */
  async exportSubtree(noteId: string, format: 'html' | 'markdown', zipFilePath: string): Promise<void> {
    await this.client.post(`/api/notes/${noteId}/export`, {
      format,
      zipFilePath,
    });
  }

  /**
   * Import notes from ZIP file
   * Note: This would require additional file handling in Node.js environment
   */
  async importNotes(zipFilePath: string, parentNoteId: string): Promise<void> {
    // Note: In Node.js environment, we'd need to handle file upload differently
    // This is a placeholder for the actual implementation
    await this.client.post(`/api/notes/${parentNoteId}/import`, { zipFilePath });
  }
}