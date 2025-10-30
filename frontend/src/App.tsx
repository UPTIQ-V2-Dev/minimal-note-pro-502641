import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NotesListPage } from './pages/NotesListPage';
import { NoteEditorPage } from './pages/NoteEditorPage';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
            >
                <BrowserRouter>
                    <div className='min-h-screen bg-background text-foreground'>
                        <Routes>
                            <Route
                                path='/'
                                element={<NotesListPage />}
                            />
                            <Route
                                path='/note/:id'
                                element={<NoteEditorPage />}
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
