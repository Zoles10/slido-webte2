"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation"; // Correct the import if necessary
import { LanguageContext } from "@/components/languages/LanguageProvider"; // Adjust the path as necessary
import { Select } from "./select"; // Import your custom Select component

const LanguageSwitcher = () => {
  const { locale, changeLanguage } = useContext(LanguageContext);
  const router = useRouter();

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    changeLanguage(newLocale); // Use the function from context to change the language
  };

  return (
    <div className="flex items-center">
      <Select
        value={locale}
        onChange={handleLocaleChange}
        aria-label="Select language"
      >
        <option value="en">🇺🇸 EN</option>
        <option value="sk">🇸🇰 SK</option>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
