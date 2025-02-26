CREATE TABLE `PackageBooking` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `package_id` INT,
    `user_id` INT,
    `booked_date` TIMESTAMP NOT NULL,
    `no_of_people` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `contact_no` VARCHAR(255) NOT NULL,
    `is_confirm` BOOLEAN DEFAULT FALSE,
    `is_cancelled` BOOLEAN DEFAULT FALSE,
    `status` VARCHAR(255) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`package_id`) REFERENCES `Package` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
