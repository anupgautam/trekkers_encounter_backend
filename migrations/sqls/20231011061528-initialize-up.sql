CREATE TABLE `HomePageSlider` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `slider_image` VARCHAR(255) NOT NULL,
    `language_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`language_id`) REFERENCES `Languages`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
