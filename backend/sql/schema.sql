-- Dummy table --
DROP TABLE IF EXISTS mail;
CREATE TABLE mail(
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    mailbox VARCHAR(32),
    mail jsonb,
    starred BOOLEAN DEFAULT FALSE,
    unread BOOLEAN DEFAULT TRUE
);

-- Your database schema goes here --
