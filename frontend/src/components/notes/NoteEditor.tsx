import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Clock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeDate } from '@/utils/date';
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types/notes';

interface NoteEditorProps {
    note?: Note;
    onSave: (data: CreateNoteInput | UpdateNoteInput) => void;
    onDelete?: (id: string) => void;
    isLoading?: boolean;
    isSaving?: boolean;
    isDeleting?: boolean;
    autoSaveEnabled?: boolean;
}

export const NoteEditor = ({
    note,
    onSave,
    onDelete,
    isLoading,
    isSaving,
    isDeleting,
    autoSaveEnabled = true
}: NoteEditorProps) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const { user, logout, isLoggingOut } = useAuth();

    // Update local state when note prop changes
    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setHasUnsavedChanges(false);
        }
    }, [note]);

    // Track changes
    useEffect(() => {
        if (note) {
            const hasChanges = title !== note.title || content !== note.content;
            setHasUnsavedChanges(hasChanges);
        } else {
            // For new notes, mark as changed if there's any content
            setHasUnsavedChanges(title.trim() !== '' || content.trim() !== '');
        }
    }, [title, content, note]);

    // Auto-save functionality
    useAutoSave({
        value: JSON.stringify({ title, content }),
        onSave: value => {
            const data = JSON.parse(value);
            if (data.title.trim() || data.content.trim()) {
                onSave(data);
                setLastSaved(new Date().toISOString());
            }
        },
        delay: 2000,
        enabled: autoSaveEnabled && hasUnsavedChanges
    });

    const handleManualSave = () => {
        const data = { title: title.trim() || 'Untitled Note', content };
        onSave(data);
        setLastSaved(new Date().toISOString());
    };

    const handleDelete = () => {
        if (note && onDelete) {
            onDelete(note.id);
        }
    };

    const getWordCount = (text: string): number => {
        return text
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0).length;
    };

    const getCharCount = (text: string): number => {
        return text.length;
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
                    <p className='mt-2 text-sm text-muted-foreground'>Loading note...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <Button
                        variant='ghost'
                        size='icon'
                        asChild
                    >
                        <Link to='/'>
                            <ArrowLeft className='h-4 w-4' />
                            <span className='sr-only'>Back to notes</span>
                        </Link>
                    </Button>
                    <h1 className='text-xl font-semibold'>{note ? 'Edit Note' : 'New Note'}</h1>
                </div>

                <div className='flex items-center gap-2'>
                    <div className='text-sm text-muted-foreground mr-2'>{user?.email}</div>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={logout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className='h-4 w-4 mr-1' />
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                    </Button>
                </div>
            </div>

            {/* Action Bar */}
            <div className='flex items-center justify-end mb-6'>
                <div className='flex items-center gap-2'>
                    {hasUnsavedChanges && (
                        <Badge
                            variant='secondary'
                            className='text-xs'
                        >
                            Unsaved changes
                        </Badge>
                    )}
                    {isSaving && (
                        <Badge
                            variant='secondary'
                            className='text-xs'
                        >
                            Saving...
                        </Badge>
                    )}
                    {lastSaved && (
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            Saved {formatRelativeDate(lastSaved)}
                        </div>
                    )}

                    <Button
                        onClick={handleManualSave}
                        disabled={!hasUnsavedChanges || isSaving}
                        size='sm'
                    >
                        <Save className='h-4 w-4 mr-1' />
                        Save
                    </Button>

                    {note && onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    disabled={isDeleting}
                                >
                                    <Trash2 className='h-4 w-4 mr-1' />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this note? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            {/* Editor Form */}
            <div className='space-y-4'>
                <Input
                    placeholder='Note title...'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className='text-lg font-medium border-none shadow-none px-0 placeholder:text-muted-foreground focus-visible:ring-0'
                />

                <Textarea
                    placeholder='Start writing your note...'
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className='min-h-[400px] resize-none border-none shadow-none px-0 placeholder:text-muted-foreground focus-visible:ring-0 text-base leading-relaxed'
                />

                {/* Stats */}
                <div className='flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t'>
                    <span>{getWordCount(content)} words</span>
                    <span>{getCharCount(content)} characters</span>
                    {note && (
                        <>
                            <span>Created {formatRelativeDate(note.createdAt)}</span>
                            <span>Modified {formatRelativeDate(note.updatedAt)}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
