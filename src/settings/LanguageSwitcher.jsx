import { useState } from "react";

const LanguageSwitcher = ({ switchLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    switchLanguage(language);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #ffc107",
          color: "#ffc107",
        }}
      >
        {selectedLanguage === "en" ? "English" : "中文"}
      </button>
      <ul className="dropdown-menu">
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("en")}
          >
            English
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("zh")}
          >
            中文
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
