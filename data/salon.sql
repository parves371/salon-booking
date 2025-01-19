-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2024 at 11:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salon`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `profile` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `number` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `profile`, `name`, `email`, `password`, `number`) VALUES
(8, '', 'safd', 'parves.dev@gmail.com', '$2a$10$JXxbsCACS150IvCBR7CkcunHg1zOhO8FkK8XCxBcfBw71lVq0Wvya', '1235');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','manager','employee') NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_path` VARCHAR(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '\r\n' CHECK (json_valid(`skills`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Creating the Staff table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,  
    position VARCHAR(255),
    available BOOLEAN,
    skills VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);



--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `role`, `email`, `password`, `created_at`, `skills`) VALUES
(1, 'shuvo', 'superadmin', 'shuvo45@dd.com', 'sdsdsa', '2024-12-09 08:42:01', NULL),
(2, 'parves', 'superadmin', 'shuvo@gmail.com', '012546789', '2024-12-10 09:18:43', NULL),
(11, 'asda', 'superadmin', 'parves.dev@gmail.com', '$2a$10$8IAPAVZFDsVSBRDl3.gg3OmZhvqy/TLJksQ5bwbDW7vMhArF6TeKW', '2024-12-11 09:29:32', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9223372036854775807;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




-- coustom sql for category

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- coustom sql for services:

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    time VARCHAR(50),
    price DECIMAL(10, 2),
    option BOOLEAN DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- coustom sql for options:

CREATE TABLE options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    time VARCHAR(50),
    price DECIMAL(10, 2),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);




-- bookings

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- Auto-increment primary key
    customer_id BIGINT(20) NOT NULL,              -- Foreign key referencing customers table
    status ENUM('pending', 'processing', 'completed', 'cancelled', 'hold') DEFAULT 'pending', -- Status with default value
    price DECIMAL(10, 2) NOT NULL,               -- Price with two decimal places
    discount DECIMAL(10, 2) DEFAULT NULL,        -- Discount, can be NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically set the creation time
    
    -- Define foreign key constraint
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);



CREATE TABLE booking_services (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,                  -- Auto-increment primary key
  booking_id INT(11) NOT NULL,                             -- Foreign key for the booking ID
  staff_id INT(11) DEFAULT NULL,                           -- Foreign key for the staff ID (allow NULL for SET NULL)
  services_id INT(11) NOT NULL,                            -- Foreign key for the services (options ID)
  start_time DATETIME NOT NULL,                            -- Start time for the service
  end_time DATETIME NOT NULL,                              -- End time for the service
  price DECIMAL(10, 2) NOT NULL,                           -- Price of the service
  status ENUM('pending', 'processing', 'completed', 'cancelled', 'hold') DEFAULT 'pending', -- Status
  discount DECIMAL(10, 2) DEFAULT NULL,                    -- Discount, can be NULL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,          -- Record creation time
  
  -- Define foreign key constraints
  FOREIGN KEY (booking_id) REFERENCES books(id) ON DELETE CASCADE,  -- Booking ID reference
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,   -- Staff reference, allow NULL if staff is deleted
  FOREIGN KEY (services_id) REFERENCES options(id) ON DELETE CASCADE -- Services reference
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,                -- Auto-increment primary key
    book_id INT NOT NULL,                             -- Foreign key referencing the `book` table
    price DECIMAL(10, 2) NOT NULL,                    -- Price of the payment
    payment_method VARCHAR(255) NOT NULL,              -- Payment method as a string (VARCHAR)
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending', -- Payment status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Record creation timestamp
    refund DECIMAL(10, 2) DEFAULT NULL,               -- Refund amount, if applicable

    -- Define foreign key constraint
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

