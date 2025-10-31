import { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNotes, useDeleteNote } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/components/notes/SearchBar';
import { NoteCard } from '@/components/notes/NoteCard';
import { EmptyState } from '@/components/notes/EmptyState';
import type { SearchNotesParams } from '@/types/notes';

export const NotesListPage = () => {
    const [searchParams, setSearchParams] = useState<SearchNotesParams>({
        query: '',
        sortBy: 'updatedAt',
        sortOrder: 'desc'
    });

    const { data: notesData, isLoading, error } = useNotes(searchParams);
    const deleteNoteMutation = useDeleteNote();
    const { user, logout, isLoggingOut } = useAuth();

    const handleSearchChange = (newParams: SearchNotesParams) => {
        setSearchParams(newParams);
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNoteMutation.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    if (error) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className='text-center py-12'>
                    <h3 className='mt-4 text-lg font-medium text-destructive'>Something went wrong</h3>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Failed to load notes. Please try refreshing the page.
                    </p>
                </div>
            </div>
        );
    }

    const notes = notesData?.notes || [];
    const isSearching = !!searchParams.query;

    return (
        <div className='max-w-4xl mx-auto px-4 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Notes</h1>
                    <p className='text-muted-foreground mt-1'>
                        {notes.length === 0 ? 'No notes yet' : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='text-sm text-muted-foreground'>{user?.email}</div>
                    <Button asChild>
                        <Link to='/note/new'>
                            <Plus className='h-4 w-4 mr-2' />
                            New Note
                        </Link>
                    </Button>
                    <Button
                        variant='outline'
                        onClick={logout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className='h-4 w-4 mr-2' />
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            {(notes.length > 0 || isSearching) && (
                <SearchBar
                    onSearchChange={handleSearchChange}
                    searchParams={searchParams}
                />
            )}

            {/* Loading State */}
            {isLoading && (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className='animate-pulse'
                        >
                            <div className='rounded-lg border p-6'>
                                <div className='space-y-3'>
                                    <div className='h-5 bg-muted rounded'></div>
                                    <div className='h-4 bg-muted rounded w-24'></div>
                                    <div className='space-y-2'>
                                        <div className='h-3 bg-muted rounded'></div>
                                        <div className='h-3 bg-muted rounded w-3/4'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Notes Grid */}
            {!isLoading && notes.length > 0 && (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {notes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onDelete={handleDeleteNote}
                            isDeleting={deleteNoteMutation.isPending}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && notes.length === 0 && (
                <EmptyState
                    isSearching={isSearching}
                    searchQuery={searchParams.query}
                />
            )}
        </div>
    );
};
