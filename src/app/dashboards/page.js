'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Toast, Alert, DeleteConfirmation } from '@/components/notifications';
import Sidebar from '@/components/layout/Sidebar';
import { useApiKeys } from '@/hooks/useApiKeys';
import { PRICING_TIERS } from '@/constants/pricing';
import CurrentPlan from '@/components/dashboard/CurrentPlan';

export default function Dashboard() {
  const [newKeyName, setNewKeyName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyCreated, setNewKeyCreated] = useState(null);
  const [userTier] = useState('FREE');
  const [visibleKeys, setVisibleKeys] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey
  } = useApiKeys();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = '/auth';
          return;
        }
        if (mounted) {
          await fetchApiKeys();
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkUser();

    return () => {
      mounted = false;
    };
  }, [fetchApiKeys]);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      const newKey = await createApiKey(newKeyName, userTier);
      setNewKeyCreated(newKey);
      setNewKeyName('');
      setIsModalOpen(true);
      setAlert({
        show: true,
        type: 'success',
        message: 'API key created successfully!'
      });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to create API key'
      });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewKeyCreated(null);
    setNewKeyName('');
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteApiKey(deleteConfirm);
      setVisibleKeys(prev => {
        const { [deleteConfirm]: _, ...rest } = prev;
        return rest;
      });
      setAlert({
        show: true,
        type: 'error',
        message: 'API key deleted successfully'
      });
      setDeleteConfirm(null);
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to delete API key'
      });
      setDeleteConfirm(null);
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setShowToast(true);
      setTimeout(() => {
        setCopySuccess('');
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startEditing = (key) => {
    setEditingKey(key.id);
    setEditName(key.name);
    setIsEditModalOpen(true);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    
    try {
      await updateApiKey(id, editName);
      setEditingKey(null);
      setEditName('');
      setIsEditModalOpen(false);
      setAlert({
        show: true,
        type: 'success',
        message: 'API key updated successfully'
      });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update API key'
      });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditName('');
    setIsEditModalOpen(false);
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const totalCreditsUsed = apiKeys.reduce((acc, key) => acc + (key.credits_used || 0), 0);
  const totalCreditsLimit = PRICING_TIERS[userTier].credits;
  const remainingCredits = totalCreditsLimit - totalCreditsUsed;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-900 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Pages / Overview
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Overview
              </h1>
            </div>

            <div className="mb-6">
              <div className="bg-gradient-to-r from-rose-100 via-purple-200 to-blue-200 dark:from-rose-500/20 dark:via-purple-500/20 dark:to-blue-500/20 p-4 sm:p-8 rounded-2xl">
                <div className="mb-4">
                  <span className="px-3 py-1 text-sm bg-white/20 dark:bg-white/10 rounded-full">
                    CURRENT PLAN
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {PRICING_TIERS[userTier].name}
                </h2>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      API Usage
                    </h3>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mb-4">
                    <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                      {totalCreditsUsed.toLocaleString()} / {totalCreditsLimit.toLocaleString()} Credits
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(totalCreditsUsed / totalCreditsLimit) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {remainingCredits.toLocaleString()} credits remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">API Keys</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The key is used to authenticate your requests to the Research API.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  + Create New Key
                </button>
              </div>

              <div className="-mx-4 sm:mx-0">
                <div className="min-w-[640px] bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="grid grid-cols-[1.5fr_1fr_2fr_0.5fr] sm:grid-cols-[2fr_1fr_3fr_1fr] gap-2 sm:gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500">NAME</div>
                    <div className="text-sm font-medium text-gray-500 hidden sm:block">USAGE</div>
                    <div className="text-sm font-medium text-gray-500">KEY</div>
                    <div className="text-sm font-medium text-gray-500">OPTIONS</div>
                  </div>

                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading API keys...</p>
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No API keys found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Create your first API key to get started</p>
                    </div>
                  ) : (
                    apiKeys.map((key) => (
                      <div key={key.id} className="grid grid-cols-[1.5fr_1fr_2fr_0.5fr] sm:grid-cols-[2fr_1fr_3fr_1fr] gap-2 sm:gap-4 p-4 border-b border-gray-100 dark:border-gray-700 items-center">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {key.name}
                        </div>
                        
                        <div className="text-gray-600 dark:text-gray-300 hidden sm:block">
                          {key.credits_used}
                        </div>

                        <div className="flex items-center gap-2 overflow-hidden">
                          <code className="text-xs sm:text-sm font-mono text-gray-600 dark:text-gray-300 truncate">
                            {visibleKeys[key.id] ? key.key_value : `solang-${'•'.repeat(20)}`}
                          </code>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 justify-end">
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title={visibleKeys[key.id] ? "Hide API key" : "Show API key"}
                          >
                            {visibleKeys[key.id] ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key_value, key.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            title="Copy API key"
                          >
                            {copySuccess === key.id ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => startEditing(key)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Edit API key name"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Delete API key"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {newKeyCreated ? 'API Key Created' : 'Create New API Key'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {newKeyCreated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      Make sure to copy your API key now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-white dark:bg-gray-900 rounded border border-green-200 dark:border-green-900 text-sm font-mono">
                        {newKeyCreated.key_value}
                      </code>
                      <button
                        onClick={() => copyToClipboard(newKeyCreated.key_value, 'new')}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400"
                      >
                        {copySuccess === 'new' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Key Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="keyName"
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter a name for your API key"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      This key will have access to {PRICING_TIERS[userTier].credits.toLocaleString()} credits per month
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim()}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Key
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit API Key
              </h3>
              
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Enter API key name"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(editingKey)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <Toast 
            message="Copied to clipboard!" 
            onClose={() => setShowToast(false)} 
          />
        )}

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmation
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
} 