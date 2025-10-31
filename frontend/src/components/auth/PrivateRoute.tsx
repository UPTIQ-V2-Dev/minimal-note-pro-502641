import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const location = useLocation();

    if (isCheckingAuth) {
        // Show loading spinner while checking authentication
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return (
            <Navigate
                to='/login'
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};
