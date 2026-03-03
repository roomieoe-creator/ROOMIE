import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

let AsyncStorage: any = undefined;
if (
  typeof window !== "undefined" &&
  window.navigator?.product === "ReactNative"
) {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
}

const supabaseUrl = "https://ergflyvuetfsmeakixbd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZ2ZseXZ1ZXRmc21lYWtpeGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mzg2MjEsImV4cCI6MjA4NjQxNDYyMX0.iZ8bPc3DUInatBseTScJXzARqwG1VSCAFru5iphbBFU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
