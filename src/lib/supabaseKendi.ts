// Kendi Supabase projenize bağlanan istemci.
// Buradaki anahtar "anon public" anahtarıdır; tarayıcıya açılması normaldir.
// Veriyi koruyan şey veritabanındaki erişim kurallarıdır (RLS).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

import { SUPABASE_URL as URL, SUPABASE_ANON_KEY as ANON_KEY } from "./supabaseAyar";

export const supabase = createClient<Database>(URL, ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
