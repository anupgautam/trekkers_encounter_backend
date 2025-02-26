CREATE TABLE `ReviewTable` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `package_id` INT,
    `user_id` INT,
    `review_star` DECIMAL(3, 2) NOT NULL,  -- Used DECIMAL for review star ratings, adjust precision as needed
    `review_title` TEXT NOT NULL,
    `review_description` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`package_id`) REFERENCES `Package` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
