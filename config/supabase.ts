import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseURL, supabaseKey);

export default supabase;
