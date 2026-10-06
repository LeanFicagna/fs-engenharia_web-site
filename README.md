# FS Engenharia Rural: site institucional

Site estático (HTML, CSS e JavaScript puros) da FS Engenharia Rural, consultoria rural no oeste do Pará.
Publicado em <https://www.fsengenhariarural.com.br> (domínio no arquivo `CNAME`).

## Como rodar localmente

Não há build nem dependências. Abra a pasta no VS Code e use a extensão **Live Server** no `index.html`,
ou rode qualquer servidor estático na raiz, por exemplo:

```bash
python -m http.server 5500
```

O Swiper (carrossel) e o Font Awesome (ícones) vêm de CDN, então é preciso internet.

## Estrutura

```
index.html            página única
404.html              página de erro (o GitHub Pages usa automaticamente)
robots.txt, sitemap.xml
CNAME                 domínio personalizado
css/
  pages/home.css      ponto de entrada: importa reset, base, variáveis e componentes
  reset.css, base.css, variables.css
  components/         um arquivo por seção (navbar, hero, services, contact-form...)
script/
  config.js           WhatsApp e URL da planilha: o que costuma mudar
  layout.js           menu e ano do rodapé
  contact.js          formulário de contato e links do WhatsApp
  projects.js         trabalhos por serviço
  video.js            vídeo de apresentação
  services-carousel.js  carrossel de "Nossos serviços"
img/                  logo, hero, servicos, equipe, trabalhos, fundos
apps-script/          script do Google que registra o formulário na planilha e envia email
```

Os arquivos de `script/` são scripts comuns (sem `import`), carregados com `defer` na ordem do `index.html`.
O `config.js` precisa vir primeiro.

## Configurações

| O quê | Onde |
|---|---|
| Número do WhatsApp | `script/config.js` → `whatsappNumber` |
| URL do formulário na planilha | `script/config.js` → `sheetsEndpoint` (passo a passo em `apps-script/README.md`) |
| Cores, fontes, altura da barra | `css/variables.css` |
| Vídeo de apresentação | `index.html`, bloco `video-block`: coloque o arquivo em `video/` e descomente o `<source>` |
| Fotos por serviço | `index.html`, bloco `projects-grid`: cada `<img>` tem `data-service` (`georreferenciamento`, `credito`, `topografia`, `lar`) |

Enquanto `sheetsEndpoint` estiver vazio, o formulário só abre o WhatsApp e não registra na planilha.

## Convenções

- **Imagens:** nomes em minúsculas, com hífen e sem acento (`dia-a-dia-1.webp`), dentro da subpasta do uso.
  Prefira WebP e comprima antes de subir; fotos grandes pesam no carregamento.
- **CSS:** um arquivo por seção em `css/components/`, importado em `components.css`. Cores da marca como variável
  (`--color-logo-green`, `--color-neutral-10`) em vez de valor solto.
- **Variantes de layout:** para testar uma ideia visual, crie uma página separada (por exemplo `xx_nome.html`) e só aplique
  no `index.html` quando aprovada. Não deixe essas páginas no repositório.

## Publicação

O site é servido pelo GitHub Pages a partir da branch `main`. O trabalho do dia a dia fica na `develop`;
ao publicar, faça o merge da `develop` na `main` e envie.

## Pendências conhecidas

- Publicar o Apps Script e preencher `sheetsEndpoint`.
- Colocar o vídeo de apresentação (hoje há só a capa com o botão de play).
- Fotos reais para cada serviço em "Veja alguns dos nossos trabalhos" (hoje repetem as mesmas três imagens).
