# Apps Script do formulário de contato

Registra cada pedido numa planilha do Google Sheets e avisa a empresa por email.
Também tem uma leitura protegida por token (`doGet`) que devolve os pedidos em JSON.

## Como publicar

1. Crie uma planilha no Google Sheets (pode ser em branco).
2. Abra **Extensões > Apps Script** e substitua o conteúdo de `Code.gs` pelo arquivo `Code.gs` desta pasta.
3. Confira `RECIPIENT_EMAIL` no topo do script.
4. Em **Configurações do projeto > Propriedades do script**, crie `API_TOKEN` com um texto longo e aleatório.
   Sem ela, a leitura (`doGet`) recusa tudo. Guarde o token fora do Git.
5. Clique em **Implantar > Nova implantação > Tipo: App da Web**:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Autorize as permissões (Planilhas e envio de email) quando o Google pedir.
7. Copie a **URL do app da Web** e cole em `sheetsEndpoint` no `script/config.js`.

> Ao alterar o `Code.gs` depois, é preciso criar uma **nova versão** da implantação
> (Implantar > Gerenciar implantações > editar > Nova versão); a URL continua a mesma.

## Ler os pedidos (doGet)

`GET <URL do app da Web>?token=SEU_TOKEN`, com filtros opcionais `&cidade=Rurópolis`, `&uf=PA` e `&limite=50`.
A resposta vem com os mais recentes primeiro; `id` é o número da linha na planilha.

## Observações

- A URL é pública, por isso o script valida os campos e o formulário tem um campo honeypot contra bots.
- O navegador envia com `mode: "no-cors"`, então o site não lê a resposta. Para ver erros, use **Execuções** no painel do Apps Script.
- Limite do `MailApp`: cerca de 100 emails/dia em conta Gmail comum e 1500 em Google Workspace.
- A aba `Solicitações` e o cabeçalho são criados automaticamente no primeiro envio.
