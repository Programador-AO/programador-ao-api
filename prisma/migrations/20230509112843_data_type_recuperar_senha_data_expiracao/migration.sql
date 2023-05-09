/*
  Warnings:

  - You are about to alter the column `recuperar_senha_data_expiracao` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `recuperar_senha_data_expiracao` DATETIME(3) NULL;
