import {useState, useEffect } from 'react';

const ThemeButton = () => {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    })

    useEffect( () => {
        document.body.className = theme;
        localStorage.setItem('theme', theme)
    }, [theme] )

    const toggleTheme = (e) => {
        setTheme((prevTheme) => (prevTheme === 'light'? 'dark' : 'light'));
        e.target.blur();
    }

    return (
        <button
            id={'theme-button'}
            className={'default-button'}
            onClick={toggleTheme}>
            Theme
        </button>
    );
}

export default ThemeButton;