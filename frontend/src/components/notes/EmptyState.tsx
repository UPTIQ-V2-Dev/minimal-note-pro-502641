import { PlusCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
    isSearching?: boolean;
    searchQuery?: string;
}

export const EmptyState = ({ isSearching, searchQuery }: EmptyStateProps) => {
    if (isSearching) {
        return (
            <div className='text-center py-12'>
                <FileText className='mx-auto h-12 w-12 text-muted-foreground/50' />
                <h3 className='mt-4 text-lg font-medium'>No notes found</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                    No notes match "{searchQuery}". Try searching with different keywords.
                </p>
            </div>
        );
    }

    return (
        <div className='text-center py-12'>
            <FileText className='mx-auto h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-lg font-medium'>No notes yet</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
                Get started by creating your first note. Perfect for jotting down ideas, meeting notes, or reminders.
            </p>
            <div className='mt-6'>
                <Button asChild>
                    <Link to='/note/new'>
                        <PlusCircle className='mr-2 h-4 w-4' />
                        Create your first note
                    </Link>
                </Button>
            </div>
        </div>
    );
};
