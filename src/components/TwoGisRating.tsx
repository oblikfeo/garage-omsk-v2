/**
 * 2GIS reviews widget ("big", dark) for Garage, Omsk, Zavodskaya 1.
 *
 * The widget is a React app from 2GIS rendered inside an iframe that we create
 * ourselves (srcDoc), so we can append our own stylesheet after theirs and
 * re-skin it to the site palette. If 2GIS renames its classes the overrides
 * simply stop applying and the widget falls back to its stock dark theme.
 */
const ORG_ID = "70000001117474939";
const BRANCH_ID = "70000001117474940";

export const TWO_GIS_REVIEWS_URL = `https://2gis.ru/omsk/firm/${BRANCH_ID}/tab/reviews`;

/** Matches the `bg-surface` card the iframe sits in (see globals.css). */
const SURFACE = "#262b31";

const overrides = `
html, body { background: transparent; }
body, .reviewCard__title, .reviewCard__reviewNumber, .reviewCard__date,
.reviewCard__review, .reviewCard__readMoreBtn, .reviewCard__defaultAvatar,
.bigWidget__ratingNumber, .bigWidget__text {
  font-family: Inter, system-ui, sans-serif !important;
}
.bigWidget, .bigWidget_dark {
  background: transparent !important;
  padding: 4px 0 0 !important;
  border-radius: 0 !important;
}
.bigWidget:before, .bigWidget_dark:before {
  background: linear-gradient(0deg, ${SURFACE} 12%, rgba(38, 43, 49, 0)) !important;
  width: 100% !important;
  height: 90px !important;
  border-radius: 0 !important;
}
.bigWidget__ratingContainer { padding: 0 2px !important; margin-left: 0 !important; }
.bigWidget__ratingNumber { font-weight: 600 !important; font-size: 18px !important; }
.bigWidget__text { color: #1faa5a !important; font-weight: 600 !important; font-size: 15px !important; }
.bigWidget__reviewContainer { gap: 12px !important; }
.reviewCard, .reviewCard_dark {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px !important;
  padding: 18px 20px !important;
}
.reviewCard__title, .reviewCard__title_dark {
  color: #f7f8fa !important; font-weight: 600 !important; font-size: 15px !important;
}
.reviewCard__reviewNumber, .reviewCard__reviewNumber_dark,
.reviewCard__date, .reviewCard__date_dark {
  color: #8a939b !important; font-size: 13px !important;
}
.reviewCard__review, .reviewCard__review_dark {
  color: #b8c0c7 !important; font-size: 14px !important; line-height: 1.6 !important;
}
.reviewCard__readMoreBtn, .reviewCard__readMoreBtn_dark {
  color: #ff6a00 !important; font-size: 14px !important;
}
.reviewCard__defaultAvatar, .reviewCard__defaultAvatar_dark {
  background: #4e5358 !important; font-size: 14px !important;
}
`;

const doc = `<!doctype html><html><head><meta charset="utf-8">
<script>
window.__size__='big';
window.__theme__='dark';
window.__branchId__='${BRANCH_ID}';
window.__orgId__='${ORG_ID}';
</script>
<script crossorigin="anonymous" type="module" src="https://disk.2gis.com/widget-constructor/assets/iframe.js"></script>
<link rel="modulepreload" crossorigin="anonymous" href="https://disk.2gis.com/widget-constructor/assets/defaults.js">
<link rel="stylesheet" crossorigin="anonymous" href="https://disk.2gis.com/widget-constructor/assets/defaults.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
<style>${overrides}</style>
</head><body><div id="iframe"></div></body></html>`;

export function TwoGisReviews({ className }: { className?: string }) {
  return (
    <iframe
      title="Отзывы о «Гараже» в 2ГИС"
      srcDoc={doc}
      sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      loading="lazy"
      className={`block w-full border-0 bg-transparent ${className ?? ""}`}
    />
  );
}
