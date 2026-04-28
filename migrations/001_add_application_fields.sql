-- Migration: Add applicant contact info, classification, and rejection reason to applications
-- Run with: npx wrangler d1 execute CSAS_DB --file=migrations/001_add_application_fields.sql

ALTER TABLE applications ADD COLUMN full_name TEXT;
ALTER TABLE applications ADD COLUMN email TEXT;
ALTER TABLE applications ADD COLUMN phone TEXT;
ALTER TABLE applications ADD COLUMN classification TEXT;
ALTER TABLE applications ADD COLUMN rejection_reason TEXT;
