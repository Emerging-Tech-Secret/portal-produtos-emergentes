-- Add new tables and modify existing ones

-- Add authorId and access control to prototypes
ALTER TABLE prototypes
ADD COLUMN author_id VARCHAR(255) NOT NULL,
ADD COLUMN access_level VARCHAR(20) NOT NULL DEFAULT 'public',
ADD COLUMN allowed_users TEXT;

-- Create users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create product market fit analysis table
CREATE TABLE product_market_fit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id UUID NOT NULL REFERENCES prototypes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  analysis TEXT NOT NULL,
  recommendations TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metrics JSONB NOT NULL
);

-- Add detailed feedback categories
ALTER TABLE feedback
ADD COLUMN categories JSONB;

-- Create indexes
CREATE INDEX idx_prototypes_author ON prototypes(author_id);
CREATE INDEX idx_prototypes_access ON prototypes(access_level);
CREATE INDEX idx_pmf_prototype ON product_market_fit(prototype_id);
CREATE INDEX idx_users_role ON users(role);

-- Function to check user access to prototype
CREATE OR REPLACE FUNCTION can_access_prototype(
  p_user_id VARCHAR(255),
  p_prototype_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_access_level VARCHAR(20);
  v_author_id VARCHAR(255);
  v_allowed_users TEXT;
  v_user_role VARCHAR(20);
BEGIN
  -- Get prototype access info
  SELECT access_level, author_id, allowed_users
  INTO v_access_level, v_author_id, v_allowed_users
  FROM prototypes
  WHERE id = p_prototype_id;

  -- Get user role
  SELECT role
  INTO v_user_role
  FROM users
  WHERE id = p_user_id;

  -- Admin always has access
  IF v_user_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- Author always has access
  IF v_author_id = p_user_id THEN
    RETURN TRUE;
  END IF;

  -- Check access level
  CASE v_access_level
    WHEN 'public' THEN
      RETURN TRUE;
    WHEN 'private' THEN
      RETURN FALSE;
    WHEN 'restricted' THEN
      RETURN v_allowed_users LIKE '%' || p_user_id || '%';
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;