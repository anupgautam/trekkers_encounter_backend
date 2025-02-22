/* Replace with your SQL commands */
CREATE TABLE public."IncludeExclude"
(
    id SERIAL PRIMARY KEY,
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP
);

ALTER TABLE public."IncludeExclude"
    OWNER TO postgres;
