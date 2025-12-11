'use client';

import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Eye, EyeOff, User, Mail, CreditCard, Lock, Check } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { RegisterFormData } from "@/types/registerform.types";
import { registerSchema } from "@/zod/registerform";
import { userService } from "@/services/authService";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";

export default function RegisterForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        reset,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const password = watch('password');
    const confirmPassword = watch('confirm_password');

    // Calculate password strength
    const calculatePasswordStrength = (pwd: string) => {
        if (!pwd) return 0;
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;
        return strength;
    };

    // Update password strength when password changes
    useState(() => {
        setPasswordStrength(calculatePasswordStrength(password));
    });

    const getStrengthColor = (strength: number) => {
        if (strength <= 1) return 'bg-red-500';
        if (strength === 2) return 'bg-yellow-500';
        if (strength === 3) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 1) return 'Weak';
        if (strength === 2) return 'Fair';
        if (strength === 3) return 'Good';
        return 'Strong';
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await userService.register(data);
            setSubmitStatus({
                type: 'success',
                message: response.message || 'Registration successful! Welcome aboard!',
            });
            reset();
            setPasswordStrength(0);
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCNIC = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 5) return numbers;
        if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-2xl border-0">
                <CardHeader className="space-y-1 pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        Join us today! Fill in your details to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-sm font-medium">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="full_name"
                                    placeholder="Enter your full name"
                                    {...register('full_name')}
                                    className={`pl-10 transition-all ${errors.full_name
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touchedFields.full_name && !errors.full_name
                                            ? 'border-green-500 focus:ring-green-500'
                                            : ''
                                        }`}
                                />
                                {touchedFields.full_name && !errors.full_name && (
                                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                            </div>
                            {errors.full_name && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.full_name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...register('email')}
                                    className={`pl-10 transition-all ${errors.email
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touchedFields.email && !errors.email
                                            ? 'border-green-500 focus:ring-green-500'
                                            : ''
                                        }`}
                                />
                                {touchedFields.email && !errors.email && (
                                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* CNIC and Gender Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-medium">
                                    Gender <span className="text-red-500">*</span>
                                </Label>
                                <Select onValueChange={(value) => setValue('gender', value as any, { shouldValidate: true })}>
                                    <SelectTrigger className={`transition-all ${errors.gender
                                        ? 'border-red-500 focus:ring-red-500'
                                        : watch('gender')
                                            ? 'border-green-500'
                                            : ''
                                        }`}>
                                        <SelectValue placeholder="Select your gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Date of Birth <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!watch("dob")}
                                        className={`w-full justify-between font-normal transition-all ${errors.dob
                                            ? "border-red-500"
                                            : watch("dob")
                                                ? "border-green-500"
                                                : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            <span className={watch("dob") ? "text-foreground" : "text-muted-foreground"}>
                                                {watch("dob")
                                                    ? new Date(watch("dob")).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : "Select your date of birth"}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-lg">
                                    <Calendar
                                        mode="single"
                                        selected={watch("dob") ? new Date(watch("dob")) : undefined}
                                        onSelect={(date) =>
                                            setValue("dob", date ? date.toISOString() : "", { shouldValidate: true })
                                        }
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.dob && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.dob.message}
                                </p>
                            )}
                        </div>

                        {/* Password and Confirm Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        {...register('password', {
                                            onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value))
                                        })}
                                        className={`pl-10 pr-10 transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password && password.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Password strength: <span className="font-medium">{getStrengthText(passwordStrength)}</span>
                                        </p>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirm_password" className="text-sm font-medium">
                                    Confirm Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirm_password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        {...register('confirm_password')}
                                        className={`pl-10 pr-10 transition-all ${errors.confirm_password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : confirmPassword && password === confirmPassword
                                                ? 'border-green-500 focus:ring-green-500'
                                                : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    {confirmPassword && password === confirmPassword && !errors.confirm_password && (
                                        <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                </div>
                                {errors.confirm_password && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.confirm_password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Status Alert */}
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
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating your account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                </>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                Sign in
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}