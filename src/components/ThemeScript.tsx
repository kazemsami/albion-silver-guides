import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var theme=t==="light"||t==="dark"?t:"dark";document.documentElement.setAttribute("data-theme",theme);document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
