import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

const EyeIcon = ({ open }) => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {open ? (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        ) : (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

const MountainIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="3 20 21 20 12 4 3 20" />
        <polyline points="3 20 8 11 11 15" />
        <line x1="15" y1="13" x2="18" y2="20" />
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            email: '',
            password: '',
            remember: false,
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <img
                            src="/images/logo.png"
                            alt="Back to Nature logo"
                            className="mx-auto mb-5 h-14 w-14 rounded-full object-cover shadow-md"
                        />
                        <h1
                            className="text-3xl font-light text-gray-800 tracking-wide"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Back to Nature
                        </h1>                
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-9">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                            Welcome back
                        </h2>
                        <p className="text-sm text-gray-400 mb-7">
                            Sign in to your account to continue your journey
                        </p>

                        {status && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} noValidate>
                            <div className="mb-5">
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        setData('email', e.target.value);
                                        clearErrors('email');
                                    }}
                                    placeholder="you@example.com"
                                    autoComplete="username"
                                    className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                        errors.email
                                            ? 'border-red-400 bg-red-50'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        htmlFor="password"
                                        className="text-xs font-semibold text-gray-500 uppercase tracking-widest"
                                    >
                                        Password
                                    </label>               
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => {
                                            setData(
                                                'password',
                                                e.target.value,
                                            );
                                            clearErrors('password');
                                        }}
                                        placeholder="********"
                                        autoComplete="current-password"
                                        className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.password
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wider uppercase rounded-lg py-3.5 transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <MountainIcon />
                                        Sign In to Your Account
                                    </>
                                )}
                            </button>
                        </form>
                    </div>           
                </div>
            </div>
        </>
    );
}
