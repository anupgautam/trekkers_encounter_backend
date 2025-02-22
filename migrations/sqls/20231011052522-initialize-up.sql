/* Replace with your SQL commands */
CREATE TABLE public."Subcategory"
(
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES public."Categories" (id),
    language_id INT REFERENCES public."Languages" (id),
    sub_category_name character varying(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT NULL
);

ALTER TABLE public."Subcategory"
    OWNER TO postgres;