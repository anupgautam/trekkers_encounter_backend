/* Replace with your SQL commands */
CREATE TABLE public."Package" (
    id serial PRIMARY KEY,
    category_id INT REFERENCES public."Categories" (id),
    sub_category_id INT REFERENCES public."Subcategory"(id),
    language_id INT REFERENCES public."Languages"(id),
    title character varying NOT NULL,
    short_description character varying NOT NULL,
    description character varying NOT NULL,
    duration character varying NOT NULL,
    currency character varying NOT NULL,
    price numeric NOT NULL,
    package_image character varying NOT NULL,
    overall_ratings numeric,
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp
);
ALTER TABLE public."Package"
    OWNER TO postgres;