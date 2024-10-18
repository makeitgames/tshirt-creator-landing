import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '~/contexts/ThemeContext'

export default function ThemeToggleButton() {
    const theme = useTheme()
    const { toggleTheme, disableTheming } = useThemeContext()

    if (disableTheming) {
        return null
    }

    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
            ) : (
                <Brightness4Icon />
            )}
        </IconButton>
    )
}
