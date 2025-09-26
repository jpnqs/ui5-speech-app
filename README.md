# UI5 Speech Input Demo

Eine kleine OpenUI5-App, die Spracheingabe (Web Speech API) live in ein Input-Feld streamt
und nach einer Stille-Schwelle automatisch als Listeneintrag hinzufügt.

## Start (einfach)

- Öffne `webapp/index.html` direkt im Browser (empfohlen: Chrome / Edge / Safari).

## Start mit UI5 Tooling (optional)

```bash
npm i --global @ui5/cli
ui5 serve --open index.html --config ui5.yaml
```

> Hinweis: Dieses Projekt nutzt die CDN-Variante von OpenUI5 im `index.html`.

## Dateien

- `webapp/util/SpeechStream.js` – kleine UI5-Module-Klasse als Wrapper um die Web Speech API.
- `webapp/view/Main.view.xml` & `webapp/controller/Main.controller.js` – UI und Logik.
- `webapp/index.html` – Bootstrap via CDN.
