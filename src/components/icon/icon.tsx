import styled, {css} from 'styled-components';

const sizes: Record<string, number> = {
    '12': 12,
    '16': 16,
    '20': 20,
    '28': 28,
};

const fontSizes: Record<string, number> = {
    '12': 14,
    '16': 18,
    '20': 24,
    '28': 31.2,
};

type Props = {
    glyph: string;
    size: string;
};

const Icon = styled.i
    .withConfig({
        shouldForwardProp: (prop, defaultValidatorFn) => !['size'].includes(prop) && defaultValidatorFn(prop),
    })
    .attrs((props: Props) => ({className: `icon ${props.glyph}`}))((props: Props) => {
    const size = sizes[props.size] || sizes['20'];
    const fontSize = fontSizes[props.size] || fontSizes['20'];

    return css`
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        padding: 0;
        width: ${size}px;
        height: ${size}px;
        -webkit-font-smoothing: subpixel-antialiased;

        &::before {
            margin: 0; // remove margins added by fontello
            font-size: ${fontSize}px;
            leter-spacing: ${fontSize}px;
            line-height: 1;
        }

        // animation
        transition: color var(--animation-speed-shorter) 0s ease-in-out;
    `;
});

export default Icon;
