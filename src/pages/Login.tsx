import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

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
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) {
            console.error("Login failed:", error.message);
            alert("Login failed. Check console for details.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">LogKerja</h1>
                <p className="text-gray-600 mb-8">Sign in to access your dashboard</p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
