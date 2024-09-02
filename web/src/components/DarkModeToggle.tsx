import { useTernaryDarkMode } from 'usehooks-ts'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useEffect } from 'react'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button.tsx'

export default function DarkModeToggle() {
    const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode()

    useEffect(() => {
        const html = document.querySelector('html') as HTMLHtmlElement
        if (isDarkMode) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }, [isDarkMode])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">
                        Toggle theme
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTernaryDarkMode('light')}>
                    Hell
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTernaryDarkMode('dark')}>
                    Dunkel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTernaryDarkMode('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
