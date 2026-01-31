import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlroxnttmumlyckeqlit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscm94bnR0bXVtbHlja2VxbGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODAzNDAsImV4cCI6MjA4NTQ1NjM0MH0.fSrqDoJgiuBwlurrmoFcgrHXyU3l1bD6B0pbY6huviM';

export const supabase = createClient(supabaseUrl, supabaseKey);
