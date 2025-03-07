CREATE TABLE `FaqPackage` (
    `_id` INT AUTO_INCREMENT PRIMARY KEY,
    `package_id` INT,
    `faq_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`package_id`) REFERENCES `Package` (`id`),
    FOREIGN KEY (`faq_id`) REFERENCES `Faq` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
