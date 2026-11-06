-- Store password hashes for API authentication without exposing plaintext passwords.
ALTER TABLE `User` ADD COLUMN `passwordHash` VARCHAR(191) NULL;