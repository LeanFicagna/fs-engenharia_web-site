/**
 * Recebe os pedidos de atendimento do site, registra na planilha e avisa a empresa por email.
 * Também registra os cliques nos botões do WhatsApp, na aba "Cliques WhatsApp".
 * Publicar como Web App (ver README.md desta pasta).
 */

// Quem recebe os avisos fica nas Propriedades do script, fora do código.
// NÃO coloque os emails nesta linha: ela é só o NOME da propriedade. Em Configurações do projeto >
// Propriedades do script, crie RECIPIENT_EMAILS com o valor "a@gmail.com, b@gmail.com".
const RECIPIENTS_PROPERTY = "RECIPIENT_EMAILS";
const SHEET_NAME = "Solicitações";
const HEADERS = ["Data", "Nome", "Email", "Cidade", "UF", "Telefone", "Mensagem"];
const MAX_LENGTH = 2000;

// Cliques nos botões do WhatsApp: só dados do clique, nenhum dado pessoal
const CLICK_TYPE = "whatsapp_click";
const CLICKS_SHEET_NAME = "Cliques WhatsApp";
const CLICK_HEADERS = ["Data", "Página", "Botão", "Origem (utm_source)", "Mídia (utm_medium)", "Campanha (utm_campaign)", "Dispositivo"];
const CLICK_FIELD_LENGTH = 100;

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = parseBody(e);

    if (data && data.type === CLICK_TYPE) {
      const click = parseClick(data);
      if (!click) return jsonResponse({ ok: false, error: "invalid" });

      getOrCreateSheet(CLICKS_SHEET_NAME, CLICK_HEADERS).appendRow([
        new Date(),
        safeCell(click.page),
        safeCell(click.button),
        safeCell(click.utmSource),
        safeCell(click.utmMedium),
        safeCell(click.utmCampaign),
        safeCell(click.device),
      ]);
      return jsonResponse({ ok: true });
    }

    const lead = parseLead(data);
    if (!lead) return jsonResponse({ ok: false, error: "invalid" });

    const sheet = getOrCreateSheet(SHEET_NAME, HEADERS);
    sheet.appendRow([
      new Date(),
      safeCell(lead.name),
      safeCell(lead.email),
      safeCell(lead.city),
      safeCell(lead.uf),
      safeCell(lead.phone),
      safeCell(lead.message),
    ]);

    sendNotificationEmail(lead);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Corpo do POST em JSON; null se vier vazio ou inválido
function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return null;

  try {
    const data = JSON.parse(e.postData.contents);
    return data && typeof data === "object" ? data : null;
  } catch (error) {
    return null;
  }
}

function parseClick(data) {
  const click = {
    page: clean(data.page).slice(0, CLICK_FIELD_LENGTH),
    button: clean(data.button).slice(0, CLICK_FIELD_LENGTH),
    utmSource: clean(data.utmSource).slice(0, CLICK_FIELD_LENGTH),
    utmMedium: clean(data.utmMedium).slice(0, CLICK_FIELD_LENGTH),
    utmCampaign: clean(data.utmCampaign).slice(0, CLICK_FIELD_LENGTH),
    device: clean(data.device).slice(0, CLICK_FIELD_LENGTH),
  };

  if (!click.page || !click.button) return null;
  return click;
}

function parseLead(data) {
  if (!data) return null;

  const lead = {
    name: clean(data.name),
    email: clean(data.email),
    city: clean(data.city),
    uf: clean(data.uf).slice(0, 2).toUpperCase(),
    phone: clean(data.phone),
    message: clean(data.message),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  if (!lead.name || !emailOk || !lead.phone || !lead.message) return null;

  return lead;
}

function clean(value) {
  return String(value == null ? "" : value).trim().slice(0, MAX_LENGTH);
}

// Evita que o Sheets interprete o texto como fórmula (=, +, -, @)
function safeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

// Cria a aba e o cabeçalho na primeira vez
function getOrCreateSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Lista da propriedade RECIPIENT_EMAILS; vazia = a própria conta do script, para nenhum aviso se perder
function getRecipients() {
  const value = PropertiesService.getScriptProperties().getProperty(RECIPIENTS_PROPERTY) || "";
  const recipients = value
    .replace(/[\[\]"']/g, "") // aceita também o formato ["a@gmail.com", "b@gmail.com"]
    .split(",")
    .map(function (email) {
      return email.trim();
    })
    .filter(function (email) {
      return email;
    });

  return recipients.length ? recipients : [Session.getEffectiveUser().getEmail()];
}

function sendNotificationEmail(lead) {
  const body = [
    "Novo pedido de atendimento pelo site:",
    "",
    "Nome: " + lead.name,
    "Email: " + lead.email,
    "Telefone: " + lead.phone,
    "Cidade/UF: " + lead.city + " - " + lead.uf,
    "",
    "Mensagem:",
    lead.message,
  ].join("\n");

  MailApp.sendEmail({
    to: getRecipients().join(","),
    replyTo: lead.email,
    subject: "Novo pedido de atendimento - " + lead.name,
    body: body,
  });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Devolve as solicitações registradas na planilha, em JSON.
 * Exige o token salvo nas Propriedades do script (API_TOKEN).
 *
 * Uso: GET <URL do Web App>?token=SEU_TOKEN
 * Filtros opcionais: &cidade=Rurópolis  &uf=PA  &limite=50
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  const tokenEsperado = PropertiesService.getScriptProperties().getProperty("API_TOKEN");

  if (!tokenEsperado || params.token !== tokenEsperado) {
    return jsonResponse({ ok: false, error: "unauthorized" });
  }

  const sheet = getOrCreateSheet(SHEET_NAME, HEADERS);
  const valores = sheet.getDataRange().getValues();
  const linhas = valores.slice(1); // pula o cabeçalho

  let solicitacoes = linhas.map(function (linha, i) {
    return {
      id: i + 2, // número da linha na planilha
      data: linha[0] instanceof Date ? linha[0].toISOString() : String(linha[0]),
      nome: String(linha[1]),
      email: String(linha[2]),
      cidade: String(linha[3]),
      uf: String(linha[4]),
      telefone: String(linha[5]),
      mensagem: String(linha[6]),
    };
  });

  // Filtros opcionais
  if (params.cidade) {
    const cidade = params.cidade.toLowerCase();
    solicitacoes = solicitacoes.filter(function (s) {
      return s.cidade.toLowerCase().indexOf(cidade) !== -1;
    });
  }
  if (params.uf) {
    const uf = params.uf.toUpperCase();
    solicitacoes = solicitacoes.filter(function (s) {
      return s.uf === uf;
    });
  }

  // Mais recentes primeiro
  solicitacoes.reverse();

  const limite = parseInt(params.limite, 10);
  if (limite > 0) solicitacoes = solicitacoes.slice(0, limite);

  return jsonResponse({ ok: true, total: solicitacoes.length, solicitacoes: solicitacoes });
}
