'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Lock, CreditCard, Check, LogIn } from 'lucide-react';
import { LoginFormData, loginSchema } from '@/zod/loginform';
import { useLogin } from '@/hooks/useLogin';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginForm() {
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const loginMutation = useLogin();
    const isSubmitting = loginMutation.isPending;

    const formatCNIC = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 5) return numbers;
        if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
    };

    const onSubmit = async (data: LoginFormData) => {
        setSubmitStatus(null);
        loginMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Login successful!');
                setSubmitStatus({ type: 'success', message: 'Welcome back! Redirecting...' });
            },
            onError: (err: any) => setSubmitStatus({
                type: 'error',
                message: err.error || 'Invalid credentials. Please try again.'
            }),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50">
            <Card className="w-full max-w-lg shadow-2xl border-0">
                <CardHeader className="space-y-1 pb-6">
                    <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* CNIC */}
                        <div className="space-y-2">
                            <Label htmlFor="cnic" className="text-sm font-medium">
                                CNIC <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="cnic"
                                    placeholder="12345-1234567-1"
                                    maxLength={15}
                                    inputMode="numeric"
                                    {...register('cnic')}
                                    onChange={(e) => {
                                        const formatted = formatCNIC(e.target.value);
                                        e.target.value = formatted;
                                        register('cnic').onChange(e);
                                    }}
                                    className={`pl-10 transition-all ${errors.cnic
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touchedFields.cnic && !errors.cnic
                                            ? 'border-green-500 focus:ring-green-500'
                                            : ''
                                        }`}
                                />
                                {touchedFields.cnic && !errors.cnic && (
                                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                            </div>
                            {errors.cnic && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.cnic.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <Link
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="pointer-events-none text-xs text-gray-400 cursor-not-allowed"
                                    aria-disabled="true"
                                >
                                    Forgot password?
                                </Link>

                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register('password')}
                                    className={`pl-10 pr-10 transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm font-normal text-gray-700 cursor-pointer select-none"
                            >
                                Remember me for 30 days
                            </Label>
                        </div>

                        {/* Submit Status */}
                        {submitStatus && (
                            <Alert
                                variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
                                className={submitStatus.type === 'success' ? 'border-green-500 bg-green-50' : ''}
                            >
                                {submitStatus.type === 'success' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertDescription className={submitStatus.type === 'success' ? 'text-green-700' : ''}>
                                    {submitStatus.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                </>
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a
                                    href="/register"
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    Create one now
                                </a>
                            </p>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-center text-blue-800">
                                🔒 Your connection is secure and encrypted
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}