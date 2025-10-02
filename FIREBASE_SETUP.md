# 🔥 Configuração Firebase - AnubiiX

## 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Nome: `anubiix-site`
4. Ative Google Analytics (opcional)

## 2. Configurar Authentication

1. No painel Firebase, vá em **Authentication**
2. Clique em **Começar**
3. Vá na aba **Sign-in method**
4. Ative **Google** como provedor
5. Configure domínios autorizados:
   - `localhost`
   - `seu-dominio.com`

## 3. Configurar Firestore

1. Vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de teste** (por enquanto)
4. Selecione localização (southamerica-east1)

## 4. Obter Configurações

1. Vá em **Configurações do projeto** (ícone engrenagem)
2. Role até **Seus aplicativos**
3. Clique em **</> Web**
4. Registre o app: `AnubiiX Site`
5. Copie as configurações

## 5. Atualizar firebase-config.js

Substitua as configurações no arquivo `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "anubiix-site.firebaseapp.com",
  projectId: "anubiix-site",
  storageBucket: "anubiix-site.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 6. Regras de Segurança Firestore

No Firestore, vá em **Regras** e use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tickets podem ser criados por usuários autenticados
    match /tickets/{ticketId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 7. Testar Localmente

1. Abra o site em `http://localhost:3000`
2. Clique em "Entrar"
3. Teste login com Google
4. Verifique se o usuário aparece no Firestore

## 🚀 Deploy

Para produção, configure domínios autorizados no Firebase Authentication:
- Adicione seu domínio real
- Remova `localhost` se necessário

## 📞 Suporte

Se tiver problemas:
1. Verifique console do navegador
2. Confirme configurações Firebase
3. Teste em modo incógnito