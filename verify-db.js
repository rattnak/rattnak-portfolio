// Simple script to verify Supabase database setup
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase database setup...\n');

  let allPassed = true;

  // Test Project table
  console.log('📋 Testing Project table...');
  const { data: projects, error: projectError } = await supabase
    .from('Project')
    .select('*')
    .limit(1);

  if (projectError) {
    console.error('❌ Project table error:', projectError.message);
    allPassed = false;
  } else {
    console.log('✅ Project table exists and is accessible');
    console.log(`   Found ${projects?.length || 0} sample records`);
  }

  // Test Competition table
  console.log('\n📋 Testing Competition table...');
  const { data: competitions, error: competitionError } = await supabase
    .from('Competition')
    .select('*')
    .limit(1);

  if (competitionError) {
    console.error('❌ Competition table error:', competitionError.message);
    allPassed = false;
  } else {
    console.log('✅ Competition table exists and is accessible');
    console.log(`   Found ${competitions?.length || 0} sample records`);
  }

  // Test BlogPost table
  console.log('\n📋 Testing BlogPost table...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('BlogPost')
    .select('*')
    .limit(1);

  if (blogError) {
    console.error('❌ BlogPost table error:', blogError.message);
    allPassed = false;
  } else {
    console.log('✅ BlogPost table exists and is accessible');
    console.log(`   Found ${blogPosts?.length || 0} sample records`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ All tables are properly set up!');
    console.log('\nYour database is ready to use. You can now:');
    console.log('  • Add data through Supabase dashboard');
    console.log('  • Use the database functions in lib/database.ts');
    console.log('  • Run your Next.js app with: npm run dev');
  } else {
    console.log('❌ Some tables have issues. Please check the errors above.');
    console.log('\nTroubleshooting:');
    console.log('  1. Make sure you ran RUN_THIS_IN_SUPABASE.sql in Supabase SQL Editor');
    console.log('  2. Check that your .env.local has correct credentials');
    console.log('  3. Verify your Supabase project is active');
  }
  console.log('='.repeat(50));
}

verifyDatabase().catch(console.error);
