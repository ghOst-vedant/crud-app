import { Colors } from "@/constants/Colors"
import { Children, createContext, useState } from "react"
import { Appearance } from "react-native"

export const ThemeContext = createContext<any>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light
    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    )
}
