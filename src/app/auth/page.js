'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import ConsentScreen from '@/components/auth/ConsentScreen';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConsent, setShowConsent] = useState(false);
  const [authData, setAuthData] = useState(null);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/dashboards');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, [router]);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/auth');
      } else if (event === 'SIGNED_IN' && !showConsent) {
        router.replace('/dashboards');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, showConsent]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has already given consent
      const hasConsent = localStorage.getItem('consent_accepted');
      
      if (!hasConsent) {
        setAuthData(data);
        setShowConsent(true);
      } else {
        try {
          // Check if user exists in our users table
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') throw userError;

          // If user doesn't exist, create their profile
          if (!existingUser) {
            const { error: profileError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  created_at: new Date().toISOString(),
                  last_login: new Date().toISOString(),
                  consent_given: true,
                  consent_date: new Date().toISOString()
                }
              ]);

            if (profileError) throw profileError;
          } else {
            // Update last login time
            const { error: updateError } = await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', data.user.id);

            if (updateError) throw updateError;
          }

          router.replace('/dashboards');
        } catch (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Error updating user profile');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConsentAccept = async () => {
    try {
      setLoading(true);
      // Create user profile after consent
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            consent_given: true,
            consent_date: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      localStorage.setItem('consent_accepted', 'true');
      router.replace('/dashboards');
    } catch (error) {
      console.error('Error creating user profile:', error);
      setError('Error creating user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentDecline = async () => {
    // Sign out if user declines
    await supabase.auth.signOut();
    setShowConsent(false);
    setError('You must accept the terms to continue');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Consent Screen */}
      {showConsent && (
        <ConsentScreen
          email={authData?.user?.email}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      )}
    </>
  );
} 