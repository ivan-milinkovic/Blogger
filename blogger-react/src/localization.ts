import LocalizedStrings from "react-localization";

const strings = new LocalizedStrings({
  en: {
    title: "Blogger",
    loading: "Loading...",
    confirmDeletion: "Really delete {0} (id: {1})?",
    newPostTitle: "New",
    newPostContent: "Content",
    saveActionText: "Save",
    preview: "Preview:",
    homeLinkText: "Home",
    loginLinkText: "Login",
    registerLinkText: "Register",
    logoutLinkText: "Logout",
    builtWithReact: "Built with React and ASP.NET",
    errorShortMessage: "Stuff fell appart.",
    loginEmailLabel: "Email",
    loginPasswordLabel: "Password",
  },
  sr: {
    title: "Блогер",
    loading: "Учитавање...",
    confirmDeletion: "Заиста обрисати {0} (id: {1})?",
    newPostTitle: "Нови",
    newPostContent: "Садржај",
    saveActionText: "Сачувај",
    preview: "Преглед:",
    homeLinkText: "Почетна",
    loginLinkText: "Пријава",
    registerLinkText: "Регистрација",
    logoutLinkText: "Одјава",
    builtWithReact: "Направљено помоћу React-а и ASP.NET-а",
    errorShortMessage: "Ствари су се распале.",
    loginEmailLabel: "Е-пошта",
    loginPasswordLabel: "Лозинка",
  },
});

// Simplify the native function return (string | string[]) to just string
function formatString(key: string, ...args: string[]): string {
  const formatted = strings.formatString(strings.getString(key), ...args);
  let result: string;
  if (formatted instanceof Array) {
    result = formatted.join(" ");
  } else {
    result = formatted;
  }
  return result;
}

const LOCALE_KEY = "blogger-locale";
function setupSavedLocale() {
  const lang = window.localStorage.getItem(LOCALE_KEY);
  if (lang) {
    strings.setLanguage(lang);
  }
}

function saveLocale(locale: string) {
  window.localStorage.setItem(LOCALE_KEY, locale);
}

export { strings, formatString, setupSavedLocale, saveLocale };
