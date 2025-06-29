## 🚦 **Passo a Passo: Fluxo Completo de Testes da NF-e**

1. **Autentique-se na API para obter o token JWT**
   - Faça login com um usuário da seed:
     - **E-mail:** `user@localhost.com`
     - **Senha:** `123456`
   - Exemplo de requisição:
     ```bash
     curl --request POST http://localhost:3000/auth/signin \
       --header 'Content-Type: application/json' \
       --data '{"email":"user@localhost.com","password":"123456"}'
     ```
   - Copie o valor do campo `access_token` do retorno.

---

2. **Emita uma NF-e**
   - Use os valores das seeds abaixo:
     - `clientId`: **f79ce169-93e5-4158-88e4-6ddf0b8a6eb6**
     - `productId`: **f79f185a-4cc9-44da-9b4b-58b9111caeed**
   - Exemplo de requisição:
     ```bash
     curl --request POST http://localhost:3000/nfe \
       --header 'Authorization: Bearer {SEU_TOKEN_AQUI}' \
       --header 'Content-Type: application/json' \
       --data '{
         "clientId": "f79ce169-93e5-4158-88e4-6ddf0b8a6eb6",
         "userId": 2,
         "items": [
           {
             "productId": "f79f185a-4cc9-44da-9b4b-58b9111caeed",
             "quantity": 1
           }
         ]
       }'
     ```
   - Copie o valor do campo `id` da resposta (esse será o **invoiceId**).

---

3. **Simule o retorno da SEFAZ (Webhook)**
   - Exemplo usando o `invoiceId` retornado acima:
     ```bash
     curl --request POST http://localhost:3000/nfe/webhook/retorno-sefaz \
       --header 'Authorization: Bearer {SEU_TOKEN_AQUI}' \
       --header 'Content-Type: application/json' \
       --data '{
         "invoiceId": "{INVOICE_ID_AQUI}",
         "status": "AUTHORIZED",
         "protocol": "123456789",
         "xml": "<xml>...</xml>",
         "message": "Nota autorizada com sucesso"
       }'
     ```

---

4. **Consulte o status da NF-e**
   ```bash
   curl --request GET http://localhost:3000/nfe/{INVOICE_ID_AQUI} \
     --header 'Authorization: Bearer {SEU_TOKEN_AQUI}'
   ```

---

5. **Consulte o XML da NF-e**
   ```bash
   curl --request GET http://localhost:3000/nfe/{INVOICE_ID_AQUI}/xml \
     --header 'Authorization: Bearer {SEU_TOKEN_AQUI}'
   ```

---

6. **Documentação Completa**
   - Acesse o Swagger para ver detalhes de todos os endpoints:  
     👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### 💡 Dicas

- Se quiser testar fluxos de erro, envie CNPJ ou `productId` inválidos.
- Os logs detalhados aparecem no terminal onde a aplicação está rodando.
- As seeds são criadas automaticamente ao subir o projeto com o comando `yarn docker:up`.

---
