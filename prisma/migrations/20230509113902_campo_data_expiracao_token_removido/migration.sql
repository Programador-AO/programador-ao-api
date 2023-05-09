/*
  Warnings:

  - You are about to drop the column `recuperar_senha_data_expiracao` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `recuperar_senha_token` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `recuperar_senha_data_expiracao`,
    DROP COLUMN `recuperar_senha_token`,
    ADD COLUMN `token_recuperar_senha` TEXT NULL;
