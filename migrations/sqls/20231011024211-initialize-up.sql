/* Replace with your SQL commands */
/* Replace with your SQL commands */

CREATE TABLE public."Languages"
(
    id SERIAL PRIMARY KEY,
    language VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
)

TABLESPACE pg_default;

ALTER TABLE public."Languages"
    OWNER to postgres;