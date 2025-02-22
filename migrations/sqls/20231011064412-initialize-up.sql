/* Replace with your SQL commands */
CREATE TABLE public."ContactUs" (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    message TEXT NOT NULL,
    is_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
ALTER TABLE public."ContactUs"
    OWNER TO postgres;