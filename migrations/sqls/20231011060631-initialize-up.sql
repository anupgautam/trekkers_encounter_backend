CREATE TABLE `Faq` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `faq_question` TEXT NOT NULL,
    `faq_answer` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
