import { Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState, useRef } from 'react';
import type { SearchNotesParams } from '@/types/notes';

interface SearchBarProps {
    onSearchChange: (params: SearchNotesParams) => void;
    searchParams: SearchNotesParams;
}

export const SearchBar = ({ onSearchChange, searchParams }: SearchBarProps) => {
    const [query, setQuery] = useState(searchParams.query || '');
    const debouncedQuery = useDebounce(query, 300);
    const searchParamsRef = useRef(searchParams);

    // Update ref when searchParams change
    searchParamsRef.current = searchParams;

    useEffect(() => {
        onSearchChange({ ...searchParamsRef.current, query: debouncedQuery });
    }, [debouncedQuery, onSearchChange]);

    const handleSortChange = (sortBy: 'createdAt' | 'updatedAt' | 'title') => {
        const newOrder = searchParams.sortBy === sortBy && searchParams.sortOrder === 'desc' ? 'asc' : 'desc';
        onSearchChange({
            ...searchParams,
            sortBy,
            sortOrder: newOrder
        });
    };

    const getSortIcon = () => {
        return searchParams.sortOrder === 'desc' ? <SortDesc className='h-4 w-4' /> : <SortAsc className='h-4 w-4' />;
    };

    const getSortLabel = () => {
        switch (searchParams.sortBy) {
            case 'title':
                return 'Title';
            case 'createdAt':
                return 'Created';
            case 'updatedAt':
            default:
                return 'Modified';
        }
    };

    return (
        <div className='flex gap-2 mb-6'>
            <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                    placeholder='Search notes...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='pl-10'
                />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='outline'
                        size='default'
                        className='flex items-center gap-2'
                    >
                        {getSortIcon()}
                        {getSortLabel()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSortChange('updatedAt')}>Last Modified</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('createdAt')}>Date Created</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('title')}>Title</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
