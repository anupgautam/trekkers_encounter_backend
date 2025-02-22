/* Replace with your SQL commands */

CREATE TABLE public."PackageGallery" (
    id serial PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    image character varying NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    update_at TIMESTAMPTZ
);

ALTER TABLE public."PackageGallery"
    OWNER TO postgres;