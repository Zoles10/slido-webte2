"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";

const LanguageContext = createContext<any>(null);

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadLocaleData = async (locale: any) => {
      const messages = await import(`../../translations/${locale}.json`);
      setMessages(messages.default);
    };

    loadLocaleData(locale);
  }, [locale]);

  const changeLanguage = (lang: any) => {
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
