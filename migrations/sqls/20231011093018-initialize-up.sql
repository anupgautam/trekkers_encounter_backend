/* Replace with your SQL commands */

CREATE TABLE public."PackageImage" (
    id serial PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    image character varying NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    update_at timestamp
);

ALTER TABLE public."PackageImage"
    OWNER TO postgres;