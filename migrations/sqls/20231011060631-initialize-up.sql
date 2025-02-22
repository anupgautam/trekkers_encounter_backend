/* Replace with your SQL commands */
CREATE TABLE public."Faq"
(
    id SERIAL PRIMARY KEY,
    faq_question text NOT NULL,
    faq_answer text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP
);

ALTER TABLE public."Faq"
    OWNER TO postgres;