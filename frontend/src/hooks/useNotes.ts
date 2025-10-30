import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import type { SearchNotesParams, CreateNoteInput, UpdateNoteInput } from '@/types/notes';

export const useNotes = (params?: SearchNotesParams) => {
    return useQuery({
        queryKey: ['notes', params],
        queryFn: () => notesService.getNotes(params),
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
};

export const useNote = (id: string) => {
    return useQuery({
        queryKey: ['note', id],
        queryFn: () => notesService.getNote({ id }),
        enabled: !!id,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateNoteInput) => notesService.createNote(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) => notesService.updateNote(id, input),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
        }
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notesService.deleteNote({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });
};
