/* Replace with your SQL commands */

CREATE TABLE public."Users"
(
    id serial PRIMARY KEY,
    first_name character varying(255) NOT NULL,
    email character varying(255) UNIQUE NOT NULL,
    last_name character varying(255) NOT NULL,
    contact_no character varying(255) NOT NULL,
    address text  NOT NULL,
    password character varying(255) NOT NULL,
    is_verified boolean DEFAULT FALSE,
    is_admin boolean DEFAULT FALSE,
    verification_token character varying(255) DEFAULT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
)

TABLESPACE pg_default;

ALTER TABLE public."Users"

    OWNER to postgres;