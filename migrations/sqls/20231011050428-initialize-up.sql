/* Replace with your SQL commands */


CREATE TABLE public."Categories"
(
    id serial PRIMARY KEY,
    category_name character varying(255) NOT NULL,
    language_id INT REFERENCES public."Languages"(id), 
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp
);

ALTER TABLE public."Categories"
    OWNER to postgres;