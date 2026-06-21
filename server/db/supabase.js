import { createClient } from '@supabase/supabase-js';
import { seedDestinations } from './seed.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Database endpoints will fail until they are configured.');
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  : null;

export async function initDatabase() {
  if (!supabase) {
    throw new Error('Supabase environment variables are missing.');
  }

  const { count, error } = await supabase
    .from('destinations')
    .select('id', { count: 'exact', head: true });

  if (error) {
    error.message = `${error.message}. Run server/db/schema.sql in Supabase SQL Editor first.`;
    throw error;
  }

  if (count === 0) {
    const { error: seedError } = await supabase.from('destinations').insert(seedDestinations);
    if (seedError) throw seedError;
  }
}
