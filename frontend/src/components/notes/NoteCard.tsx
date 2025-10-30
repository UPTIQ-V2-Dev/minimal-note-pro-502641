import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { formatRelativeDate } from '@/utils/date';
import type { Note } from '@/types/notes';
import { useState } from 'react';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const NoteCard = ({ note, onDelete, isDeleting }: NoteCardProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        onDelete(note.id);
        setShowDeleteDialog(false);
    };

    const getPreviewText = (content: string, maxLength: number = 120): string => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength).trim() + '...';
    };

    return (
        <Card className='hover:shadow-md transition-all duration-200 group'>
            <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                    <Link
                        to={`/note/${note.id}`}
                        className='flex-1 min-w-0'
                    >
                        <h3 className='font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                            {note.title || 'Untitled Note'}
                        </h3>
                        <p className='text-sm text-muted-foreground mt-1'>{formatRelativeDate(note.updatedAt)}</p>
                    </Link>

                    <AlertDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                                >
                                    <MoreHorizontal className='h-4 w-4' />
                                    <span className='sr-only'>More options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to={`/note/${note.id}`}
                                        className='flex items-center'
                                    >
                                        <Edit className='mr-2 h-4 w-4' />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        className='text-destructive focus:text-destructive'
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{note.title || 'Untitled Note'}"? This action
                                    cannot be undone.
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
                </div>
            </CardHeader>

            {note.content && (
                <CardContent className='pt-0'>
                    <Link
                        to={`/note/${note.id}`}
                        className='block'
                    >
                        <p className='text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap'>
                            {getPreviewText(note.content)}
                        </p>
                    </Link>
                </CardContent>
            )}
        </Card>
    );
};
