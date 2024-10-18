import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    ThemeProvider as MUIThemeProvider,
    createTheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type ThemeContextType = {
    toggleTheme: () => void
    mode: 'light' | 'dark'
    disableTheming: boolean
    setDisableTheming: (disable: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useThemeContext = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light')
    const [disableTheming, setDisableTheming] = useState(false)

    const toggleTheme = () => {
        if (!disableTheming) {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        }
    }

    const theme = createTheme({
        palette: {
            mode: disableTheming ? 'light' : mode,
        },
    })

    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode')
        if (savedMode) {
            setMode(savedMode as 'light' | 'dark')
        }
    }, [])

    useEffect(() => {
        if (!disableTheming) {
            localStorage.setItem('themeMode', mode)
        }
    }, [mode, disableTheming])

    return (
        <ThemeContext.Provider
            value={{ toggleTheme, mode, disableTheming, setDisableTheming }}
        >
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    )
}
