import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // optional: save theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // load theme on refresh
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  return (
    <div className={theme}>
      <AppRoutes theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;