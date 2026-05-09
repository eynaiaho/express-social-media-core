CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(30)  NOT NULL UNIQUE,
    display_name  VARCHAR(50)  NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url    VARCHAR(500) NULL,
    bio           TEXT         NULL,
    website       VARCHAR(255) NULL,
    role          ENUM('user', 'tester', 'moderator', 'admin', 'developer') NOT NULL DEFAULT 'user',
    is_private    TINYINT(1)   NOT NULL DEFAULT 0,
    is_verified   TINYINT(1)   NOT NULL DEFAULT 0,
    is_banned     TINYINT(1)   NOT NULL DEFAULT 0,
    email_verified_at DATETIME NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    ip_address  VARCHAR(45)  NULL,
    user_agent  VARCHAR(500) NULL,
    expires_at  DATETIME     NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_revoked TINYINT(1)    NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);