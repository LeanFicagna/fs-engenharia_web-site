# Apps Script do formulário de contato

Registra cada pedido numa planilha do Google Sheets e avisa a empresa por email.
Também tem uma leitura protegida por token (`doGet`) que devolve os pedidos em JSON.

A planilha e o script ficam na conta `fsengenhariarural.ti@gmail.com`, que é quem envia os avisos.
Quem recebe fica na propriedade `RECIPIENT_EMAILS` (passo 3), e não no código, que é público.

## Como publicar

1. Crie uma planilha no Google Sheets (pode ser em branco).
2. Abra **Extensões > Apps Script** e substitua o conteúdo de `Code.gs` pelo arquivo `Code.gs` desta pasta.
3. Em **Configurações do projeto > Propriedades do script**, crie `RECIPIENT_EMAILS` com os emails que recebem
   os avisos, separados por vírgula (ex.: `a@gmail.com, b@gmail.com`). Vazia, o aviso vai para a própria conta do script.
   Para mudar a lista depois, basta editar a propriedade: não precisa de nova versão nem de mexer no site.
4. Na mesma tela, crie `API_TOKEN` com um texto longo e aleatório.
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

## Migrar para outra conta Google

1. Na conta nova, siga **Como publicar** acima, com uma planilha nova.
2. Copie os pedidos antigos: na planilha antiga, clique com o botão direito na aba `Solicitações` >
   **Copiar para > Planilha existente**, escolha a planilha nova, apague a aba vazia criada pelo script
   (se houver) e renomeie a cópia para `Solicitações`.
3. Troque `sheetsEndpoint` no `script/config.js` pela URL nova e publique o site.
4. Envie um pedido de teste pelo site e confira a linha na planilha e o email.
5. Só então arquive a implantação antiga (**Implantar > Gerenciar implantações > Arquivar**).
   Até o site novo estar no ar, a antiga continua recebendo os pedidos.

## Observações

- A URL é pública, por isso o script valida os campos e o formulário tem um campo honeypot contra bots.
- O site envia como `text/plain` (sem preflight de CORS) e lê a resposta: com `ok: true` mostra "Pedido enviado!"; senão, mostra erro e sugere o WhatsApp. O detalhe dos erros fica em **Execuções** no painel do Apps Script.
- Limite do `MailApp`: cerca de 100 destinatários/dia em conta Gmail comum e 1500 em Google Workspace. Cada email da lista conta: com 3 emails, são uns 33 pedidos por dia.
- A aba `Solicitações` e o cabeçalho são criados automaticamente no primeiro envio.
