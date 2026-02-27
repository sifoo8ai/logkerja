import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setSession(session);
                setUser(session?.user || null);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, session, loading };
}
