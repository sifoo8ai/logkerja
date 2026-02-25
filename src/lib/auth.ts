import { supabase } from './supabaseClient';

export async function checkAndBootstrapProfile(user: any) {
    if (!user) return null;

    // Check if profile exists
    let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code === 'PGRST116') {
        // PGNRS116 is "No rows found". Let's bootstrap
        const newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
            email: user.email,
            is_active: true
        };

        // Insert new profile
        const { data: newRow, error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

        if (insertError) {
            console.error("Error bootstrapping profile:", insertError);
            return null;
        }
        return newRow;
    } else if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    // Backfill email on login if it's missing (Option A implementation)
    if (profile && !profile.email && user.email) {
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ email: user.email })
            .eq('id', user.id)
            .select()
            .single();

        if (!updateError && updatedProfile) {
            return updatedProfile;
        }
    }

    return profile;
}

export async function fetchUserRoles(userId: string) {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching roles:", error);
        return [];
    }

    return data.map((r: any) => r.role);
}

export function setActiveRole(role: string) {
    localStorage.setItem('activeRole', role);
}

export function getActiveRole() {
    return localStorage.getItem('activeRole');
}

export function clearActiveRole() {
    localStorage.removeItem('activeRole');
}

export async function signOut() {
    await supabase.auth.signOut();
    clearActiveRole();
}
