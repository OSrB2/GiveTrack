CREATE TYPE campaign_status AS ENUM (
  'active',
  'goal_reached',
  'closed'
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  goal DECIMAL(12, 2) NOT NULL
    CHECK (goal > 0),
  amount_collected DECIMAL(12, 2) NOT NULL DEFAULT 0
    CHECK (amount_collected >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
    CHECK (end_date > start_date),
  status campaign_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);