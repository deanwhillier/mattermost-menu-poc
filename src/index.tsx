import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createGlobalStyle, css} from 'styled-components';
import '@mattermost/compass-icons/css/compass-icons.css';

const GlobalStyles = createGlobalStyle(
    () => css`
        :root {
            // animation
            --animation-speed-shortest: 0.1s;
            --animation-speed-shorter: 0.15s;
            --animation-speed-short: 0.2s;
            --animation-speed-normal: 0.25s;
            --animation-speed-long: 0.3s;
            --animation-speed-longer: 0.35s;
            --animation-speed-longest: 0.4s;

            // general colours
            --black-rgb: 63, 67, 80;
            --button-bg-rgb: 28, 88, 217;
            --destructive-rgb: 210, 75, 78;

            // icon button colours
            --icon-button-foreground-rgb: 63, 67, 80;
            --icon-button-background-rgb: 28, 88, 217;
            --icon-button-highlight-rgb: 255, 255, 255;
            --icon-button-destructive-rgb: var(--destructive-rgb);
        }

        *,
        *:before,
        *:after {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        html {
            font-size: 10px;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            font-size: 1.6rem;
        }

        html,
        body,
        #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        // Open Sans font import
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap');

        // Metropolis font definitions
        @font-face {
            font-family: 'Metropolis';
            font-style: normal;
            font-weight: 600;
            src: url('../assets/fonts/Metropolis-SemiBold.woff') format('woff');
        }

        @font-face {
            font-family: 'Metropolis';
            font-style: italic;
            font-weight: 600;
            src: url('../assets/fonts/Metropolis-SemiBoldItalic.woff') format('woff');
        }

        @font-face {
            font-family: 'Metropolis';
            font-style: normal;
            font-weight: 400;
            src: url('../assets/fonts/Metropolis-Regular.woff') format('woff');
        }

        @font-face {
            font-family: 'Metropolis';
            font-style: italic;
            font-weight: 400;
            src: url('../assets/fonts/Metropolis-RegularItalic.woff') format('woff');
        }

        @font-face {
            font-family: 'Metropolis';
            font-style: normal;
            font-weight: 300;
            src: url('../assets/fonts/Metropolis-Light.woff') format('woff');
        }

        @font-face {
            font-family: 'Metropolis';
            font-style: italic;
            font-weight: 300;
            src: url('../assets/fonts/Metropolis-LightItalic.woff') format('woff');
        }
    `
);
ReactDOM.render(
    <React.StrictMode>
        <GlobalStyles />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
