/* Replace with your SQL commands */

CREATE TABLE public."HomePageSlider"
(
    id SERIAL PRIMARY KEY,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    slider_image character varying(255) NOT NULL,
    language_id INT REFERENCES public."Languages" (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);
ALTER TABLE public."HomePageSlider"
    OWNER TO postgres;
