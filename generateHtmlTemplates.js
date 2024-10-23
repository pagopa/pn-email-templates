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
  return mergedJSON;
}

// generazione template BILINGUA
async function generateHtmlTemplates() {
  const languages = ["it", "fr", "sl"]; // Elenca le lingue supportate
  const templates = [
    // "NotificationAAR_RADDalt",
    // "NotificationAAR",
    // "NotificationAAR_RADD",
    "NotificationReceivedLegalFact",
    // "PecDeliveryWorkflowLegalFact",
    "NotificationViewedLegalFact",
    // "PdfLegalFact",
    "AnalogDeliveryWorkflowFailureLegalFact",
    "NotificationCancelledLegalFact",
  ];

  for (const template of templates) {
    const templatePath = path.join(
      __dirname,
      "resources/templates",
      template,
      "index.html"
    );
    const templateContent = await fs.readFile(templatePath, "utf8");

    for (const language of languages) {
      const fileName = language === "it" ? template : `${template}_${language}`;
      const templateLang =
        language === "it"
          ? templateContent.replaceAll(
              /<[^>]*data-hide-on-it="true"[^>]*>[\s\S]*?<\/[^>]*>/g,
              ""
            )
          : templateContent;

      const translations = await loadTranslations(language, template);
      const renderedHtml = ejs.render(templateLang, translations);
      const outputDir = path.join(__dirname, "output/templates", template);
      await fs.ensureDir(outputDir);
      const outputPath = path.join(outputDir, `${fileName}.html`);
      await fs.writeFile(outputPath, renderedHtml, "utf8");

      console.log(`Template HTML generato per la lingua: ${language}`);
    }
  }
}

async function copyAssets() {
  const fontDir = path.join(__dirname, "resources/fonts");
  const imagesDir = path.join(__dirname, "resources/images");
  const outputDir = path.join(__dirname, "output");

  await fs.copy(fontDir, path.join(outputDir, "fonts"));
  await fs.copy(imagesDir, path.join(outputDir, "images"));
}

// Esegui la generazione dei template HTML e la copia degli assets
generateHtmlTemplates()
  .then(() => {
    // TODO: Uncomment when development is complete
    // copyAssets()
    //   .then(() => {
    //     console.log(
    //       "Tutti i template HTML e gli assets sono stati generati con successo"
    //     );
    //   })
    //   .catch((err) => {
    //     console.error("Errore nella copia degli assets", err);
    //   });

    console.log(
      "Tutti i template HTML e gli assets sono stati generati con successo"
    );
  })
  .catch((err) => {
    console.error("Errore nella generazione dei template HTML", err);
  });
