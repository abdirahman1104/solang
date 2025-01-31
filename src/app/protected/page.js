'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/notifications';
import { supabase } from '@/utils/supabase';
import BackToDashboard from '@/components/BackToDashboard';

export default function Protected() {
  const [alert, setAlert] = useState({ show: true, type: 'success', message: 'Valid API key, /protected can be accessed' });
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    };
    checkAuth();
  }, [router]);

  // Auto-dismiss alert
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <BackToDashboard />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Protected Route
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a protected route that can only be accessed with a valid API key.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            You can now use this API key to make authenticated requests to the Solang API.
          </p>
        </div>

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
          />
        )}
      </div>
    </div>
  );
} 