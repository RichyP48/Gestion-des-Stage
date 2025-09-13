-- Add status column to companies table
ALTER TABLE companies ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

-- Update existing companies to have ACTIVE status
UPDATE companies SET status = 'ACTIVE' WHERE status = 'PENDING';