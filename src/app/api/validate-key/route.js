import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    // Create a new Supabase client with the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    const { apiKey } = await request.json();
    console.log('Validating API key:', apiKey);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all keys for the current user
    const { data: userKeys, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('User API keys:', userKeys?.map(k => ({
      key: k.key_value,
      name: k.name
    })));

    // Check if the provided key exists in user's keys
    const matchingKey = userKeys?.find(k => k.key_value === apiKey.trim());
    
    console.log('Validation check:', {
      providedKey: apiKey,
      keyFound: !!matchingKey,
      keyDetails: matchingKey ? {
        name: matchingKey.name,
        tier: matchingKey.tier
      } : null
    });

    if (!matchingKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Valid API key',
        keyInfo: {
          id: matchingKey.id,
          name: matchingKey.name,
          tier: matchingKey.tier
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in validation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 