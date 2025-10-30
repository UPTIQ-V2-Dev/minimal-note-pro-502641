import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNote, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/NoteEditor';
import type { CreateNoteInput, UpdateNoteInput } from '@/types/notes';

export const NoteEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewNote = id === 'new';

    const { data: noteData, isLoading, error } = useNote(id || '');
    const createNoteMutation = useCreateNote();
    const updateNoteMutation = useUpdateNote();
    const deleteNoteMutation = useDeleteNote();

    const note = noteData?.note;

    // Redirect to home if note not found (but not while loading)
    useEffect(() => {
        if (!isNewNote && !isLoading && !note && id) {
            navigate('/', { replace: true });
        }
    }, [isNewNote, isLoading, note, id, navigate]);

    const handleSave = async (data: CreateNoteInput | UpdateNoteInput) => {
        try {
            if (isNewNote) {
                const result = await createNoteMutation.mutateAsync(data as CreateNoteInput);
                // Navigate to the created note
                navigate(`/note/${result.note.id}`, { replace: true });
            } else if (note) {
                await updateNoteMutation.mutateAsync({
                    id: note.id,
                    input: data as UpdateNoteInput
                });
            }
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleDelete = async (noteId: string) => {
        try {
            await deleteNoteMutation.mutateAsync(noteId);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    // Show error state if note loading failed
    if (error && !isNewNote) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className='text-center py-12'>
                    <h3 className='mt-4 text-lg font-medium text-destructive'>Note not found</h3>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        The note you're looking for doesn't exist or has been deleted.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-4 py-8'>
            <NoteEditor
                note={note}
                onSave={handleSave}
                onDelete={!isNewNote ? handleDelete : undefined}
                isLoading={!isNewNote && isLoading}
                isSaving={createNoteMutation.isPending || updateNoteMutation.isPending}
                isDeleting={deleteNoteMutation.isPending}
                autoSaveEnabled={!isNewNote} // Only auto-save for existing notes
            />
        </div>
    );
};
