-- Add is_upcoming column to releases table
ALTER TABLE releases ADD COLUMN IF NOT EXISTS is_upcoming BOOLEAN DEFAULT FALSE;

-- Update the existing releases to have is_upcoming = false
UPDATE releases SET is_upcoming = FALSE WHERE is_upcoming IS NULL;
