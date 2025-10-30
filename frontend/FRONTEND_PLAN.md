# Notetaker App - Technical Implementation Plan

## Tech Stack

- React 19
- Vite
- shadcn/ui components
- Tailwind v4
- TypeScript
- React Query for state management
- Local Storage for persistence

## Application Structure

### 1. Notes List Page (`/`)

**Purpose**: Main dashboard showing all notes with search and filtering

**Components**:

- `NotesList` - Main container component
- `NoteCard` - Individual note preview card
- `SearchBar` - Search and filter functionality
- `EmptyState` - When no notes exist

**Features**:

- Search notes by title/content
- Sort by date created/modified
- Quick preview of note content
- Create new note button

**API**:

- GET `/api/notes` - Fetch all notes
- DELETE `/api/notes/:id` - Delete note

**Types**:

- `Note` interface (id, title, content, createdAt, updatedAt)
- `NotesListProps`, `NoteCardProps`

### 2. Note Editor Page (`/note/:id`, `/note/new`)

**Purpose**: Create and edit individual notes

**Components**:

- `NoteEditor` - Main editor container
- `EditorToolbar` - Save, delete, back navigation
- `TextEditor` - Rich text input area

**Features**:

- Auto-save functionality
- Character/word count
- Last saved timestamp
- Markdown support (optional)

**API**:

- GET `/api/notes/:id` - Fetch specific note
- POST `/api/notes` - Create new note
- PUT `/api/notes/:id` - Update existing note

**Utils**:

- `debounce` - For auto-save
- `formatDate` - Date formatting

### 3. Common Components & Layout

**Layout Components**:

- `AppLayout` - Main app wrapper
- `Header` - App title and navigation
- `Sidebar` - Navigation (if needed)

**Common Components**:

- `ConfirmDialog` - Delete confirmations
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling

### 4. Hooks & Utils

**Custom Hooks**:

- `useNotes` - Notes CRUD operations
- `useAutoSave` - Auto-save functionality
- `useDebounce` - Debounce hook

**Utils**:

- `storage.ts` - Local storage helpers
- `date.ts` - Date formatting utilities
- `validation.ts` - Form validation schemas

### 5. Types & Interfaces

**Core Types**:

```typescript
interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

interface NotesContextType {
    notes: Note[];
    createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
}
```

### 6. Services & API Layer

**Services**:

- `notesService.ts` - Notes CRUD operations
- `storageService.ts` - Local storage management

### 7. Styling & Theme

**Styling**:

- Tailwind v4 utility classes
- Custom CSS variables for theme
- Responsive design patterns

**Components from shadcn/ui**:

- Button, Input, Textarea
- Card, Sheet, Dialog
- Command (for search)
- Badge, Separator

## Implementation Phases

### Phase 1: Core Structure

- Setup routing with React Router
- Create basic layout components
- Setup TypeScript types
- Configure local storage service

### Phase 2: Notes List

- Implement notes list view
- Add search functionality
- Create note card components
- Add empty state

### Phase 3: Note Editor

- Build note editor interface
- Implement auto-save
- Add character count
- Setup validation

### Phase 4: Polish & UX

- Add loading states
- Implement error boundaries
- Add confirmations for destructive actions
- Mobile responsiveness

## Key Features

- Minimal, clean interface
- Fast search and filtering
- Auto-save functionality
- Responsive design
- Keyboard shortcuts
- Data persistence via localStorage

## File Structure

```
src/
├── components/
│   ├── notes/
│   │   ├── NotesList.tsx
│   │   ├── NoteCard.tsx
│   │   ├── NoteEditor.tsx
│   │   └── SearchBar.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── Header.tsx
│   └── ui/ (existing shadcn components)
├── hooks/
│   ├── useNotes.ts
│   ├── useAutoSave.ts
│   └── useDebounce.ts
├── services/
│   ├── notesService.ts
│   └── storageService.ts
├── types/
│   └── notes.ts
├── utils/
│   ├── date.ts
│   └── validation.ts
└── pages/
    ├── NotesListPage.tsx
    └── NoteEditorPage.tsx
```
