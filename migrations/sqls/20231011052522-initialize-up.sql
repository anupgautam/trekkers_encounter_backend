CREATE TABLE `Subcategory` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT,
    `language_id` INT,
    `sub_category_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`),
    FOREIGN KEY (`language_id`) REFERENCES `Languages`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
