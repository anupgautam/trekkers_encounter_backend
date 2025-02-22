/* Replace with your SQL commands */
CREATE TABLE public."EssentialInformation" (
    id SERIAL PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    update_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public."EssentialInformation"
    OWNER TO postgres;