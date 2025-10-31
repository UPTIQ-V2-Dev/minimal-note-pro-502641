import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { clearAuthData, getStoredUser, isAuthenticated } from '@/lib/api';
import type { LoginRequest, SignupRequest, User } from '@/types/user';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading: isCheckingAuth } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => {
            const storedUser = getStoredUser();
            return storedUser;
        },
        enabled: isAuthenticated(),
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: data => {
            queryClient.setQueryData(['auth', 'user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/');
        },
        onError: error => {
            console.error('Login failed:', error);
        }
    });

    const registerMutation = useMutation({
        mutationFn: (userData: SignupRequest) => authService.register(userData),
        onSuccess: data => {
            queryClient.setQueryData(['auth', 'user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/');
        },
        onError: error => {
            console.error('Registration failed:', error);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearAuthData();
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            queryClient.clear();
            navigate('/login');
        },
        onError: error => {
            // Even if logout fails on server, clear local data
            console.error('Logout failed:', error);
            clearAuthData();
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            queryClient.clear();
            navigate('/login');
        }
    });

    const login = (credentials: LoginRequest) => {
        loginMutation.mutate(credentials);
    };

    const register = (userData: SignupRequest) => {
        registerMutation.mutate(userData);
    };

    const logout = () => {
        logoutMutation.mutate();
    };

    return {
        user: user as User | null,
        isAuthenticated: isAuthenticated(),
        isCheckingAuth,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
        login,
        register,
        logout
    };
};
