import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import type { LoginRequest } from '@/types/user';

export const LoginForm = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const { login, isLoggingIn, loginError } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.email && formData.password) {
            login(formData);
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className='space-y-4'
                >
                    <div className='space-y-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                            disabled={isLoggingIn}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            id='password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                            required
                            disabled={isLoggingIn}
                        />
                    </div>

                    {loginError && (
                        <Alert variant='destructive'>
                            <AlertDescription>
                                {loginError.message || 'Login failed. Please check your credentials.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type='submit'
                        className='w-full'
                        disabled={!isFormValid || isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
