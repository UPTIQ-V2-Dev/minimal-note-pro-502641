import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NotesListPage } from './pages/NotesListPage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { LoginPage } from './pages/LoginPage';
import { PrivateRoute } from './components/auth/PrivateRoute';

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
                                path='/login'
                                element={<LoginPage />}
                            />
                            <Route
                                path='/'
                                element={
                                    <PrivateRoute>
                                        <NotesListPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/note/:id'
                                element={
                                    <PrivateRoute>
                                        <NoteEditorPage />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
