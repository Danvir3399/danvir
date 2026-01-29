-- Add order_index column to releases table for manual sorting
ALTER TABLE releases ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Optional: Initialize order_index based on current sorting (year DESC)
-- This is just to have a starting point
DO $$
DECLARE
    r RECORD;
    idx INTEGER := 0;
BEGIN
    FOR r IN (SELECT id FROM releases ORDER BY is_upcoming DESC, year DESC) LOOP
        UPDATE releases SET order_index = idx WHERE id = r.id;
        idx := idx + 1;
    END LOOP;
END $$;
