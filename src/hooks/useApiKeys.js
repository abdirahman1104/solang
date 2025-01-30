import { useState, useEffect, useCallback } from 'react';
import { apiKeyService } from '@/services/apiKeyService';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const keys = await apiKeyService.fetchApiKeys();
      setApiKeys(keys);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createApiKey = async (name, tier) => {
    try {
      const newKey = await apiKeyService.createApiKey(name, tier);
      setApiKeys(prev => [newKey, ...prev]);
      return newKey;
    } catch (err) {
      throw err;
    }
  };

  const updateApiKey = async (id, name) => {
    try {
      await apiKeyService.updateApiKey(id, name);
      setApiKeys(prev => prev.map(key => 
        key.id === id ? { ...key, name } : key
      ));
    } catch (err) {
      throw err;
    }
  };

  const deleteApiKey = async (id) => {
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey
  };
} 