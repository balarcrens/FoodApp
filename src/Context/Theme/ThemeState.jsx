import { useState } from "react";
import ThemeContext from "./ThemeContext";

export default function ThemeState(props) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}
