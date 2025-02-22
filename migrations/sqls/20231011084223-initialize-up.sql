/* Replace with your SQL commands */
CREATE TABLE public."IncludeExcludePackage"
(
    id SERIAL PRIMARY KEY,
    include_exclude_id INT REFERENCES public."IncludeExclude" (id),
    package_id INT REFERENCES public."Package" (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP
);

ALTER TABLE public."IncludeExcludePackage"
    OWNER TO postgres;
