// Test basic Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...\n');
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set (length: ' + supabaseAnonKey.length + ')' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  // Test a simple query that doesn't require table access
  const { data, error } = await supabase
    .from('Project')
    .select('count')
    .limit(0);

  console.log('\n📡 Connection test result:');
  if (error) {
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Error details:', error.details);
    console.log('Error hint:', error.hint);

    if (error.message.includes('permission denied')) {
      console.log('\n💡 This is a PERMISSIONS issue, not a connection issue.');
      console.log('   Your tables exist, but RLS is blocking access.');
      console.log('\n   ➡️  Run DISABLE_RLS_SIMPLE.sql in Supabase SQL Editor');
    }
  } else {
    console.log('✅ Connection successful!');
  }
}

testConnection();
