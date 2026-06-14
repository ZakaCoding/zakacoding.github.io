import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import darkMode from "./dark";

export default function Switcher() {
	const [colorTheme, setTheme] = darkMode();
	const [darkSide, setDarkSide] = useState(
		colorTheme === "light" ? true : false
	);

	const toggleDarkMode = (checked) => {
		setTheme(colorTheme);
		setDarkSide(checked);
	};

	return (
		<>
            {/* toggle button dark mode */}
			<DarkModeSwitch
				style={{ marginBottom: "2rem" }}
				checked={darkSide}
				onChange={toggleDarkMode}
				size={30}
                className="swap swap-rotate fixed top-7 right-5 sm:right-7 z-20">
            </DarkModeSwitch>
		</>
	);
}
