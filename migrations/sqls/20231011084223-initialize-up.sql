CREATE TABLE `IncludeExcludePackage` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `include_exclude_id` INT,
    `package_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`include_exclude_id`) REFERENCES `IncludeExclude` (`id`),
    FOREIGN KEY (`package_id`) REFERENCES `Package` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
