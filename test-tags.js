// Test script to check if tags are being fetched
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTags() {
  console.log('=== Testing Tags Setup ===\n');

  // 1. Check if Tag table exists and has data
  const { data: tags, error: tagsError } = await supabase
    .from('Tag')
    .select('*')
    .limit(5);

  console.log('1. Tags in database:');
  if (tagsError) {
    console.error('Error:', tagsError);
  } else {
    console.log(tags);
  }

  // 2. Check if ProjectTag table exists
  const { data: projectTags, error: ptError } = await supabase
    .from('ProjectTag')
    .select('*')
    .limit(5);

  console.log('\n2. ProjectTag relationships:');
  if (ptError) {
    console.error('Error:', ptError);
    console.log('⚠️  ProjectTag table might not exist! Run RESTORE_JUNCTION_TABLES.sql');
  } else {
    console.log(projectTags);
  }

  // 3. Check projects
  const { data: projects, error: projectsError } = await supabase
    .from('Project')
    .select('id, name')
    .limit(5);

  console.log('\n3. Projects in database:');
  if (projectsError) {
    console.error('Error:', projectsError);
  } else {
    console.log(projects);
  }

  // 4. Try to fetch project with tags (using junction table)
  if (!ptError && projects && projects.length > 0) {
    const projectId = projects[0].id;
    const { data: tagsForProject, error: tagsFetchError } = await supabase
      .from('ProjectTag')
      .select(`
        Tag (*)
      `)
      .eq('projectId', projectId);

    console.log(`\n4. Tags for project ${projectId}:`);
    if (tagsFetchError) {
      console.error('Error:', tagsFetchError);
    } else {
      console.log(tagsForProject);
    }
  }

  console.log('\n=== End of Test ===');
}

testTags();
