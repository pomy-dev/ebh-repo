import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fmitluvqrrjwfemjmomb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaXRsdXZxcnJqd2ZlbWptb21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI3OTYsImV4cCI6MjA2MjYxODc5Nn0.huwQS2sIKFX1nucLTOPPKwKziaJsm1ZqhCqaAyB8Jmc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
