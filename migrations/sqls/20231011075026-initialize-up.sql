CREATE TABLE `Package` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT,
    `sub_category_id` INT,
    `sub_sub_category_id` INT
    `language_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `short_description` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `duration` VARCHAR(255) NOT NULL,
    `currency` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `package_image` VARCHAR(255) NOT NULL,
    `overall_ratings` DECIMAL(5, 2) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`),
    FOREIGN KEY (`sub_category_id`) REFERENCES `Subcategory` (`id`),
    FOREIGN KEY (`sub_sub_category_id`) REFERENCES `Subcategory` (`id`),
    FOREIGN KEY (`language_id`) REFERENCES `Languages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
