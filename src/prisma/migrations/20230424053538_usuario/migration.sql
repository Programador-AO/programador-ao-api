-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `nomeUsuario` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `telefone_verificado` BOOLEAN NOT NULL DEFAULT false,
    `senha_hash` TEXT NOT NULL,
    `avatar` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ADMIN', 'MEMBRO') NOT NULL DEFAULT 'MEMBRO',
    `recuperar_senha_token` VARCHAR(191) NULL DEFAULT 'null',
    `recuperar_senha_data_expiracao` VARCHAR(191) NULL DEFAULT 'null',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `usuarios_nomeUsuario_key`(`nomeUsuario`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_telefone_key`(`telefone`),
    INDEX `usuarios_email_telefone_idx`(`email`, `telefone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
