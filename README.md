# UI5 Speech Input Demo

A small OpenUI5 application that streams speech input (Web Speech API) live into an input field and automatically adds it as a list entry after detecting a silence threshold.

## Features

- Real-time speech-to-text conversion
- Automatic detection of speech pauses
- Dynamic list creation from voice input
- Simple and intuitive user interface
- No server-side processing required

## Prerequisites

- Modern web browser with Web Speech API support
- No additional server or backend required

## Quick Start

- Open `webapp/index.html` directly in your browser (recommended: Chrome / Edge / Safari).

## Start with UI5 Tooling (optional)

If you want to use the UI5 tooling for development:

```bash
npm i --global @ui5/cli
ui5 serve --open index.html --config ui5.yaml
```

> Note: This project uses the CDN version of OpenUI5 referenced in `index.html`.

## Project Structure

- `webapp/util/SpeechStream.js` – UI5 module class that wraps the Web Speech API.
- `webapp/view/Main.view.xml` – XML view defining the user interface.
- `webapp/controller/Main.controller.js` – Controller containing the application logic.
- `webapp/index.html` – Application entry point with OpenUI5 bootstrap via CDN.

## How It Works

The application leverages the browser's Web Speech API to convert speech to text in real-time. When a user speaks, the text is immediately displayed in an input field. After a brief pause in speech (silence threshold), the application automatically adds the transcribed text as a new entry in a list.

## Browser Compatibility

- Chrome: Full support
- Edge: Full support
- Safari: Good support (may require permission)
- Firefox: Limited support (check latest version)

## Troubleshooting

- Ensure microphone permissions are granted to the browser
- If speech recognition doesn't start, refresh the page
- For best results, speak clearly and at a moderate pace
