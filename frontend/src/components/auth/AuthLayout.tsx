import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Notes App</h1>
                    <p className='text-muted-foreground mt-2'>Sign in to access your notes</p>
                </div>
                {children}
            </div>
        </div>
    );
};
