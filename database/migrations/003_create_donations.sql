CREATE TYPE payment_method AS ENUM (
  'pix',
  'credit_card',
  'debit_card',
  'boleto',
  'bank_transfer',
  'cash'
);

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value DECIMAL(12, 2) NOT NULL
    CHECK (value > 0),
  donation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_method payment_method NOT NULL,
  donor_id UUID NOT NULL, 
  campaign_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_donoation_donor
    FOREIGN KEY (donor_id)
    REFERENCES donors(id)
    ON DELETE RESTRICT,
  
  CONSTRAINT fk_donation_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE RESTRICT
);

CREATE INDEX idx_donations_donor_id
    ON donations(donor_id)

CREATE INDEX idx_donationos_campaign_id
    ON donations(campaign_id)

CREATE INDEX idx_donations_donation_date
    ON donations(donation_date)

