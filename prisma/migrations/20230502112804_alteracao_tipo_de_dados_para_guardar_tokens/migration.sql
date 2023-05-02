-- AlterTable
ALTER TABLE `usuarios` MODIFY `recuperar_senha_token` TEXT NULL,
    MODIFY `recuperar_senha_data_expiracao` TEXT NULL,
    MODIFY `token_verificacao_email` TEXT NULL;
