import { createClient } from "@supabase/supabase-js";

const url = "https://ityatiyyzfmeyigjfcbw.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eWF0aXl5emZtZXlpZ2pmY2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE3MTg4MDUsImV4cCI6MjAxNzI5NDgwNX0.tI6oplXaXr3sbY865FWo94ETkkgMR0fLCzxYtAko6Bc";

export const supabase = createClient(url, key);
