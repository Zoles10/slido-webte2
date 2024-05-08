"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "./Switch";
import { LanguageContext } from "@/components/languages/LanguageProvider"; // Adjust the path as necessary

const LanguageSwitcher = () => {
  const { locale, changeLanguage } = useContext(LanguageContext); // Use the context
  const [checked, setChecked] = React.useState(locale === "sk");
  const router = useRouter();

  const handleToggleLocale = () => {
    const newLocale = checked ? "en" : "sk";
    changeLanguage(newLocale); // Use the function from context
    setChecked(!checked);
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={checked}
        onCheckedChange={handleToggleLocale}
        aria-label={`Switch language to ${checked ? "English" : "Slovak"}`}
      />
    </div>
  );
};

export default LanguageSwitcher;
