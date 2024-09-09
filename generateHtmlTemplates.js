const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");

async function loadTranslations(language, template) {
  console.log("siamoq qui pre path");

  const filePath = path.join(
    __dirname,
    "templates/" + template,
    "/i18n",
    `${language}.json`
  );
  console.log("siamoq qui " + filePath);
  return await fs.readJson(filePath);
}

async function generateHtmlTemplates() {
  // Definisci le lingue supportate
  const languages = ["en", "it", "fr", "de"]; // Aggiungi altre lingue se necessario
  // definisci i template
  const templates = ["aar", "AO3"];
  console.log("siamo qui 2");

  // Carica il template HTML di base
  const templatePath = path.join(
    __dirname,
    "templates",
    "aar",
    "documento_base.html"
  );
  const templateContent = await fs.readFile(templatePath, "utf8");

  for (const language of languages) {
    console.log("siamoq qui " + language);

    const template = templates[0];
    // Carica le traduzioni per la lingua corrente per il template in esame
    // es language = de, template = AAR
    const translations = await loadTranslations(language, template);

    // Renderizza il template con le traduzioni
    const renderedHtml = ejs.render(templateContent, translations);

    // Salva il template HTML renderizzato in una cartella di output
    const outputDir = path.join(__dirname, "output");
    await fs.ensureDir(outputDir); // Assicura che la cartella di output esista

    const outputPath = path.join(outputDir, `documento_${language}.html`);
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
