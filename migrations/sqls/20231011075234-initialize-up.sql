/* Replace with your SQL commands */
CREATE TABLE public."FaqPackage" (
    _id serial PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    faq_id INT REFERENCES public."Faq" (id),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp
);

ALTER TABLE public."FaqPackage"
    OWNER TO postgres;
