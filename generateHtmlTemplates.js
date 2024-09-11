const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");

async function loadTranslations(language, template) {
  const filePath = path.join(
    __dirname,
    "templates/" + template,
    "/i18n",
    `${language}.json`
  );
  return await fs.readJson(filePath);
}

async function generateHtmlTemplates() {
  const languages = ["de"]; // Elenca le lingue supportate
  const templates = [
    "NotificationAAR_RADDalt",
    "NotificationReceivedLegalFact",
    "PecDeliveryWorkflowLegalFactSuccess",
    "PecDeliveryWorkflowLegalFactError",
    "NotificationViewedLegalFact",
    "PdfLegalFact",
  ];

  const templatePath = path.join(
    __dirname,
    "templates",
    templates[0], // sostituisci con la cartella che contiene il file che vuoi generare
    "index.html"
  );
  const templateContent = await fs.readFile(templatePath, "utf8");
  const template = templates[0]; // sostituisci col tipo di template che vuoi generare

  for (const language of languages) {
    const translations = await loadTranslations(language, template);
    const renderedHtml = ejs.render(templateContent, translations);

    const outputDir = path.join(__dirname, "output", template);
    await fs.ensureDir(outputDir);
    const outputPath = path.join(outputDir, `${template}_${language}.html`);
    await fs.writeFile(outputPath, renderedHtml, "utf8");

    console.log(`Template HTML generato per la lingua: ${language}`);
  }
}

// Esegui la generazione dei template HTML
generateHtmlTemplates()
  .then(() =>
    console.log("Tutti i template HTML sono stati generati con successo")
  )
  .catch((err) =>
    console.error("Errore nella generazione dei template HTML", err)
  );
