import { supabase } from '@/utils/supabase';

export const apiKeyService = {
  async fetchApiKeys() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return keys || [];
  },

  async createApiKey(name, tier) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newKey = {
        name,
        key_value: `solang_${Math.random().toString(36).substr(2, 9)}`,
        tier,
        credits_used: 0,
        user_id: user.id
      };

      console.log('Creating new key:', newKey); // Debug log

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) {
        console.error('Error creating key:', error);
        throw error;
      }

      console.log('Created key:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error in createApiKey:', error);
      throw error;
    }
  },

  async updateApiKey(id, name) {
    const { error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteApiKey(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 