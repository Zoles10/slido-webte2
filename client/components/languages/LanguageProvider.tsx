"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";

// Create a context
const LanguageContext = createContext(null);

// Context provider component
function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadLocaleData = async (locale) => {
      const messages = await import(`../../translations/${locale}.json`);
      setMessages(messages.default);
    };

    loadLocaleData(locale);
  }, [locale]);

  const changeLanguage = (lang) => {
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
export { LanguageProvider, LanguageContext };
