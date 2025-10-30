export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteInput {
    title: string;
    content: string;
}

export interface UpdateNoteInput {
    title?: string;
    content?: string;
}

export interface NotesListResponse {
    notes: Note[];
    total: number;
}

export interface NoteResponse {
    note: Note;
}

export interface SearchNotesParams {
    query?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export interface DeleteNoteParams {
    id: string;
}

export interface GetNoteParams {
    id: string;
}
