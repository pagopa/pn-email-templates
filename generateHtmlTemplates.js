const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");



// funzione per ricavare le traduzioni dalla cartella i18n corrispondente
async function loadTranslations(language, template) {
  const filePath = path.join(
    __dirname,
    "resources/templates/" + template,
    "/i18n",
    `${language}.json`
  );
  const result = await fs.readJson(filePath);

  const itaText = path.join(
    __dirname,
    "resources/templates/" + template,
    "/i18n",
    `it.json`
  );
  const itaResult = await fs.readJson(itaText);

  const mergedJSON = Object.assign({}, result, itaResult);
  return mergedJSON
}

// generazione template BILINGUA

async function generateHtmlTemplates() {
  const languages = ["it","de", "fr", "sl"]; // Elenca le lingue supportate
  const templates = [

  //   "NotificationAAR_RADDalt",
  //   "NotificationAAR",
  //   "NotificationAAR_RADD",
  //   "NotificationReceivedLegalFact",
  //   "PecDeliveryWorkflowLegalFact",
  //   "NotificationViewedLegalFact",
  //   "PdfLegalFact",
    "AnalogDeliveryWorkflowFailureLegalFact",
    
  ];

for(const template of templates) {
  const templatePath = path.join(
    __dirname,
    "resources/templates",
    template,
    "index.html"
  );
  const templateContent = await fs.readFile(templatePath, "utf8");
  for (const language of languages) {
    // se la lingua è italiano, devi mostrare solo una stampa
    const translations = await loadTranslations(language, template);
    const renderedHtml = ejs.render(templateContent, translations);
    const outputDir = path.join(__dirname, "output", template);
    await fs.ensureDir(outputDir);
    const outputPath = path.join(outputDir, `${template}_${language}.html`);
    await fs.writeFile(outputPath, renderedHtml, "utf8");  
  
    console.log(`Template HTML generato per la lingua: ${language}`);
  }
}

}

// generazione template ITALIANO

async function generateItaHtmlTemplates() {
  const languages = ["it"]; // Elenca le lingue supportate
  const templates = [

  //   "NotificationAAR_RADDalt",
  //   "NotificationAAR",
  //   "NotificationAAR_RADD",
  //   "NotificationReceivedLegalFact",
  //   "PecDeliveryWorkflowLegalFact",
  //   "NotificationViewedLegalFact",
  //   "PdfLegalFact",
    "AnalogDeliveryWorkflowFailureLegalFact",
    
  ];

for(const template of templates) {
  const templatePath = path.join(
    __dirname,
    "resources/templates",
    template,
    "index.html"
  );
  const templateContent = await fs.readFile(templatePath, "utf8");
  for (const language of languages) {
    // se la lingua è italiano, devi mostrare solo una stampa
    const translations = await loadTranslations(language, template);
    const renderedHtml = ejs.render(templateContent, translations);
    const outputDir = path.join(__dirname, "output", template);
    await fs.ensureDir(outputDir);
    const outputPath = path.join(outputDir, `${template}_${language}.html`);
    await fs.writeFile(outputPath, renderedHtml, "utf8");  
  
    console.log(`Template HTML generato per la lingua: ${language}`);
  }
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

generateItaHtmlTemplates()
.then(() =>
  console.log("Tutti i template ITA HTML sono stati generati con successo")
)
.catch((err) =>
  console.error("Errore nella generazione dei template HTML", err)
);
