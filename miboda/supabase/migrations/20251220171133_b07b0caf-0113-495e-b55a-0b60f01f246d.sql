-- Remove email column from guests table to reduce sensitive data exposure
ALTER TABLE public.guests DROP COLUMN IF EXISTS email;