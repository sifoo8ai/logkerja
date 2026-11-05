# LogKerja Chrome Side Panel Extension

This Chrome Extension loads the LogKerja Progressive Web Application inside an MV3 Side Panel. It allows users to quickly approve or verify documents while browsing other tabs concurrently.

Since **v1.1.0** it also captures Requisition data from the UPM ERP (`erp.upm.edu.my`) and sends it to LogKerja (feature ERP-CAPTURE-01).

## Local Installation (Unpacked)

1. Open a Chromium-based browser (Google Chrome, MS Edge, Brave).
2. Navigate to extensions management page (e.g., `chrome://extensions/` for Chrome).
3. Enable **Developer mode** using the toggle switch located in the top right corner.
4. Click the **Load unpacked** button.
5. Select the `extension` folder inside this LogKerja project directory.
6. The extension is now installed. Pin its icon to your toolbar for easy access.
7. Click the LogKerja toolbar icon to spawn the Side Panel on the right side of your browser.

### Updating after code changes

On `chrome://extensions/`, click the **reload** (↻) icon on the LogKerja card. Then **refresh any open ERP tabs**, because content scripts only load on page load.

## ERP capture (ERP-CAPTURE-01)

- On a Requisition screen in the ERP, a small **✦ LogKerja** button appears at the bottom right.
- **Automatic:** after you click APPROVE in the ERP and your name appears in the **first row** of the **Approved By** column (APPROVALS tab, Status = Approved), a card appears showing the **Ref. Nbr.** and **Creator**.
- **Manual:** click the ✦ LogKerja button at any time to open the same card.
- Click **Semak & Daftar**. The side panel opens, and LogKerja checks the reference number:
  - **New number:** the registration form opens pre-filled (Keterangan Tambahan = Creator name). Pick a **Kategori**, then submit.
  - **Your own document, REJECTED / ON_HOLD:** you get the option to **Hantar Semula**.
  - **Any other status, or another user's document:** an explanation is shown and nothing is changed.
- The result is shown back on the ERP card.
- The script is **read-only**: it never clicks, types or changes anything in the ERP.
- The LogKerja side panel must be logged in with the **PENYEMAK** role.

### Changing the approver name

The automatic detection matches the name in the "Approved By" column. The default is `MOHD NOR RIZAL BIN SULAIMAN`. To change it, open `chrome://extensions/`, go to LogKerja → **Details** → **Extension options**, enter the name exactly as it appears in the ERP, then click **Simpan**.

## Configuration

`sidepanel.html` loads the production PWA: `https://logkerja.vercel.app/app`.

For local development, temporarily change the iframe `src` in `sidepanel.html` to `http://localhost:5173/app`. Both origins are already allowed in `sidepanel.js`. Revert the change before committing.
