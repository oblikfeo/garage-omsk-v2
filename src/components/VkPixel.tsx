/* eslint-disable @next/next/no-img-element */
import { VK_PIXEL_ID } from "@/lib/counters";

/**
 * VK Ads pixel (Top.Mail.Ru counter), exactly as issued by VK, rendered
 * straight into the server HTML near the top of <body>. Mounted only in the
 * public site layout, so the admin panel is not counted.
 */
const PIXEL_CODE = `var _tmr = window._tmr || (window._tmr = []);
_tmr.push({id: "${VK_PIXEL_ID}", type: "pageView", start: (new Date()).getTime()});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "tmr-code");`;

export default function VkPixel() {
  return (
    <>
      <script
        id="vk-pixel"
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: PIXEL_CODE }}
      />
      <noscript>
        <div>
          <img
            src={`https://top-fwz1.mail.ru/counter?id=${VK_PIXEL_ID};js=na`}
            style={{ position: "absolute", left: "-9999px" }}
            alt="Top.Mail.Ru"
          />
        </div>
      </noscript>
    </>
  );
}
