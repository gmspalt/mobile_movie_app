import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmmzprdlvtmbkmegscqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbXpwcmRsdnRtYmttZWdzY3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzQyNDUsImV4cCI6MjA3OTA1MDI0NX0.xCvahAlh_HRicWlQrhxrwIVd3pUqhSjvMgDkRu1GMFE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
