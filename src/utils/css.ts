import {css} from 'styled-components';

export const color = (property: string, opacity = 1) => {
    return `rgba(var(${property}), ${opacity})`;
};

export const resetList = () => {
    return css`
        padding: 0;
        margin: 0;
        list-style: none;
    `;
};

export const resetButton = () => {
    return css`
        border: none;
        margin: 0;
        padding: 0;
        width: auto;
        overflow: visible;
        cursor: pointer;

        background: transparent;

        /* inherit font & color from ancestor */
        color: inherit;
        font: inherit;

        /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
        line-height: normal;

        /* Corrects font smoothing for webkit */
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;

        /* Corrects inability to style clickable 'input' types in iOS */
        -webkit-appearance: none;

        /* Remove excess padding and border in Firefox 4+ */
        &::-moz-focus-inner {
            border: 0;
            padding: 0;
        }
    `;
};
