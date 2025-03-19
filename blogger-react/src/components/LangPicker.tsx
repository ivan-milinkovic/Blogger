import { ChangeEvent, useEffect, useState } from "react";
import { saveLocale, strings } from "../localization";
import { useNavigate } from "react-router";

function LangPicker() {
  const langs = strings.getAvailableLanguages();
  const [selectedLocale, setSelectedLocale] = useState(strings.getLanguage());
  const navigate = useNavigate();

  // Loading the saved locale is done in App so that all components see the change

  useEffect(() => {
    const locale = strings.getLanguage();
    setSelectedLocale(locale);
  }, []);

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    saveLocale(lang);
    setSelectedLocale(lang);
    navigate(0);
  }

  return (
    <select value={selectedLocale} onChange={onChange}>
      {langs.map((lang) => {
        return (
          <option key={lang} value={lang}>
            {lang}
          </option>
        );
      })}
    </select>
  );
}

export default LangPicker;
