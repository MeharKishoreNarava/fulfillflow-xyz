# FulfillFlow — XYZ Fulfillment Hub

A lightweight fulfillment operations dashboard built for the **XYZ Take-Home Project**.

## 1. Problem understood

XYZ currently uses spreadsheets and shared folders to manage order fulfillment. The brief highlights five recurring operational risks:

- Order status is difficult to see at a glance.
- Delays can go unnoticed.
- Priority orders can get mixed with regular work.
- Inventory can be inaccurate or unavailable at the shelf.
- Packed boxes and courier pickups can be missed.
- Informal issue handling makes problems easy to forget.

## 2. Product decision

I focused the first version on **visibility + prioritisation + exception handling**, rather than trying to automate the whole warehouse.

The application has five simple areas:

1. **Overview** — a manager's starting point with KPIs, priority queue, operational health and fulfillment flow.
2. **Orders** — searchable/filterable order list with risk and promise visibility.
3. **Inventory** — available/reserved stock, location and mismatch/low-stock warnings.
4. **Exceptions** — a visible action list for problems that otherwise get lost.
5. **Staging & courier** — boxes grouped by courier and pickup cut-off.

This keeps the interface simple enough for an experienced warehouse team that is not very comfortable with technology.

## 3. Run locally

No installation or internet connection is required.

### Windows
1. Download/unzip this project.
2. Open the folder.
3. Double-click `index.html`.
4. The application opens in your browser.

### Mac / Linux
Open the project folder and run:
```bash
python3 -m http.server 8000
```
Then open:
`http://localhost:8000`

## 4. Files

- `index.html` — page structure and application sections.
- `styles.css` — responsive visual design.
- `app.js` — sample data, rendering, filters, order detail modal and issue logging.
- `AI_USAGE.md` — one-page AI usage note for submission.
- `WALKTHROUGH.md` — five-minute video walkthrough script.
- `README.md` — project explanation and run instructions.

## 5. Sample data

The brief does not provide live store/courier integrations, so the app uses realistic dummy operational data as requested. Sample orders cover Shopify, Amazon and Wholesale channels, while inventory includes main/overflow locations and courier staging.

## 6. Design choices

- Dark operations sidebar to visually separate navigation from work.
- Light workspace to keep tables and alerts readable.
- Green as the main action/status color.
- Amber for watch items and red for blocking issues.
- Short labels and large click targets to reduce cognitive load.
- No external libraries or APIs, so the reviewer can run it immediately.

## 7. Submission

For a code submission, upload this folder to GitHub and share the repository URL.

For a hosted submission, GitHub Pages can host this static application directly from the repository.

Before recording the video, open the app in a clean browser tab and demonstrate:
Overview → Priority order → Orders search/filter → Inventory critical item → Exceptions → Staging.
