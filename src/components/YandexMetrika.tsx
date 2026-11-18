/* eslint-disable @next/next/no-img-element */
import { METRIKA_COUNTER_ID } from "@/lib/counters";

/**
 * Yandex.Metrika counter, exactly as issued by Metrika, rendered straight into
 * the server HTML near the top of <body> so the counter starts with the page (and Metrika's own
 * "check counter" finds it in the source). Mounted only in the public site
 * layout: the admin panel is not tracked or recorded by Webvisor.
 */
const COUNTER_CODE = `(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_COUNTER_ID}', 'ym');

ym(${METRIKA_COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`;

export default function YandexMetrika() {
  return (
    <>
      <script
        id="yandex-metrika"
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: COUNTER_CODE }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
