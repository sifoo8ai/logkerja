import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/app');
            }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/app');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true); // Aktifkan loading animation
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/app`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Login failed:", error.message);
            alert("Ralat log masuk. Sila cuba lagi.");
            setIsLoggingIn(false); // Matikan loading kalau error
        }
    };

    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-[#f8f9fc] font-sans p-4">

            {/* Background Decorative Blobs - Efek Premium */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '6s' }}></div>

            {/* Login Card (Glassmorphism Effect) */}
            <div className="w-full max-w-[360px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-8 sm:p-10 text-center relative z-10">

                {/* Logo Area */}
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
                        <ShieldCheck className="text-white w-8 h-8" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2">
                    LogKerja
                </h1>
                <p className="text-sm text-gray-500 font-medium mb-10 px-2 leading-relaxed">
                    Log masuk untuk mula menyemak dan mengesahkan dokumen
                </p>

                {/* Professional Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-[15px] font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                    {isLoggingIn ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                        // SVG Logo G Google yang sebenar (Standard Industri)
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}

                    <span>{isLoggingIn ? 'Log masuk...' : 'Teruskan dengan Google'}</span>
                </button>

                {/* Subtle Footer Note */}
                <div className="mt-8">
                    <p className="text-[11px] text-gray-400 font-medium">
                        Zero Cost Production &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;