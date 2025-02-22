/* Replace with your SQL commands */
CREATE TABLE public."About" (
    id SERIAL PRIMARY KEY,
    title character varying(255) NOT NULL,
    short_description character varying(255) NOT NULL,
    description text NOT NULL,
    language_id INT REFERENCES public."Languages" (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);
ALTER TABLE public."About"
    OWNER TO postgres;
