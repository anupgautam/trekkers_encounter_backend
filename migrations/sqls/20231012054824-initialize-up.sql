/* Replace with your SQL commands */

CREATE TABLE public."PackageBooking" (
    id serial PRIMARY KEY,
    package_id INT REFERENCES public."Package" (id),
    user_id INT REFERENCES public."Users" (id),
    booked_date TIMESTAMPTZ NOT NULL,
    no_of_people INT NOT NULL,
    description character varying NOT NULL,
    contact_no character varying NOT NULL,
    is_confirm BOOLEAN DEFAULT false,
    is_cancelled BOOLEAN DEFAULT false,
    status character varying DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    update_at TIMESTAMPTZ DEFAULT NULL
);

ALTER TABLE public."PackageBooking"
    OWNER TO postgres;