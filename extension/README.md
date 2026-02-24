# LogKerja Chrome Side Panel Extension

This Chrome Extension loads the LogKerja Progressive Web Application inside an MV3 Side Panel. It allows users to quickly approve or verify documents while browsing other tabs concurrently.

## Local Installation (Unpacked)

1. Open a Chromium-based browser (Google Chrome, MS Edge, Brave).
2. Navigate to extensions management page (e.g., `chrome://extensions/` for Chrome).
3. Enable **Developer mode** using the toggle switch located in the top right corner.
4. Click the **Load unpacked** button.
5. Select the `extension` folder inside this LogKerja project directory.
6. The extension is now installed. Pin its icon to your toolbar for easy access.
7. Click the LogKerja toolbar icon to spawn the Side Panel on the right side of your browser.

## Configuration

For MVP and Development phases, the `sidepanel.html` iframe currently points to the local development server:
`http://localhost:5173`

Prior to deploying or publishing the extension for public/staff usage, ensure you update the `src` attribute inside `sidepanel.html` to point to the production hosted URL (e.g. `https://logkerja.app.domain/`).
