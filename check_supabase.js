const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log('🔍 Checking Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // 1. Check Users table
    const { data: users, error: userError } = await supabase.from('users').select('*').limit(1);
    if (userError) {
      console.error('❌ Users table error:', userError.message);
      console.log('💡 Tip: Make sure you ran the SQL to create the "users" table.');
    } else {
      console.log('✅ Users table is ready!');
    }

    // 2. Check Analytics table
    const { data: analytics, error: analError } = await supabase.from('analytics').select('*').limit(1);
    if (analError) {
      console.error('❌ Analytics table error:', analError.message);
      console.log('💡 Tip: Make sure you ran the SQL to create the "analytics" table.');
    } else {
      console.log('✅ Analytics table is ready!');
      if (!analytics || analytics.length === 0) {
        console.log('ℹ️ Analytics table is empty. Initializing first record...');
        await supabase.from('analytics').insert([{ total_views: 0, chat_messages: 0 }]);
        console.log('✅ Initialized analytics record.');
      }
    }

    // 3. Check Permissions
    const { data: test, error: testError } = await supabase.from('users').upsert([{ email: 'test@test.com', name: 'Test' }], { onConflict: 'email' });
    if (testError) {
      console.error('❌ Upsert test failed:', testError.message);
    } else {
      console.log('✅ Permissions verified! Write access confirmed.');
    }

  } catch (err) {
    console.error('❌ Critical connection error:', err.message);
  }
}

checkConnection();
