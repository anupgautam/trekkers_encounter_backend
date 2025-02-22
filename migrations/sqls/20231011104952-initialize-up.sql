/* Replace with your SQL commands */
/* Replace with your SQL commands */

CREATE TABLE public."ReviewTable" (
   id serial PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    user_id INT REFERENCES public."Users" (id),
    review_star numeric NOT NULL,
    review_title Text NOT NULL,
    review_description Text NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp
);
ALTER TABLE public."ReviewTable"
    OWNER TO postgres;
