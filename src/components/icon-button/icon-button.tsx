import React, {MouseEventHandler} from 'react';
import styled, {css} from 'styled-components';

import {color} from '../../utils/css';

import Icon from '../icon';

type Props = {
    glyph: string;
    size?: string;
    active?: boolean;
    compact?: boolean;
    destructive?: boolean;
    disabled?: boolean;
    inverted?: boolean;
    toggled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const theme = {
    foreground: '--icon-button-foreground-rgb',
    background: '--icon-button-background-rgb',
    highlight: '--icon-button-highlight-rgb',
    destructive: '--icon-button-destructive-rgb',
};

const sizes: Record<string, number> = {
    xsmall: 24,
    small: 32,
    medium: 40,
    large: 48,
};

const iconSizes: Record<string, string> = {
    xsmall: '12',
    small: '16',
    medium: '20',
    large: '28',
};

const IconButton = styled.button((props: Omit<Props, 'glyph'>) => {
    const {compact = false, inverted = false, active = false} = props;

    const size = sizes[props.size || 'small'];

    let defaultForegroundColor;
    let defaultBackgroundColor;
    switch (true) {
        case inverted && active:
            defaultForegroundColor = color(theme.highlight);
            defaultBackgroundColor = color(theme.highlight, 0.16);
            break;
        case inverted:
            defaultForegroundColor = color(theme.highlight, 0.64);
            defaultBackgroundColor = 'transparent';
            break;
        case active:
            defaultForegroundColor = color(theme.background);
            defaultBackgroundColor = color(theme.background, 0.08);
            break;
        default:
            defaultForegroundColor = color(theme.foreground, 0.56);
            defaultBackgroundColor = 'transparent';
    }

    return css`
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        flex: 0 0 auto;
        padding: 0;
        font-size: 14px;
        line-height: 1;
        border-radius: 4px;
        border: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        overflow: hidden;
        cursor: pointer;

        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            border-radius: 4px;
            border: solid 2px transparent;
            z-index: 0;
        }

        // size
        min-width: ${compact ? size - 4 : size}px;
        height: ${compact ? size - 4 : size}px;

        // states
        color: ${defaultForegroundColor};
        background: ${defaultBackgroundColor};

        &:hover {
            color: ${inverted ? color(theme.highlight) : color(theme.foreground, 0.72)};
            background: ${inverted ? color(theme.highlight, 0.08) : color(theme.foreground, 0.08)};
        }

        &:focus {
            &::before {
                border-color: ${color(theme.background)};
            }
            &::after {
                border-color: ${color(theme.highlight, 0.32)};
            }
        }
        &:focus:not(:focus-visible) {
            &::before {
                border-color: transparent;
            }
            &::after {
                border-color: transparent;
            }
        }
        &:focus-visible {
            &::before {
                border-color: ${color(theme.background)};
            }
            &::after {
                border-color: ${color(theme.highlight, 0.32)};
            }
        }

        &:active {
            color: ${inverted ? color(theme.highlight) : color(theme.background)};
            background: ${inverted ? color(theme.highlight, 0.16) : color(theme.background, 0.08)};
        }

        // animation
        transition: background-color var(--animation-speed-shorter) 0s ease-in-out;

        &::before,
        &::after {
            transition: border-color var(--animation-speed-shorter) 0s ease-in-out;
        }
    `;
});

const IconButtonComponent: React.FC<Props> = (props: Props) => {
    const {glyph = 'icon-mattermost', size = 'small', ...rest} = props;

    const iconSize = iconSizes[size] || iconSizes['small'];

    return (
        <IconButton size={size} {...rest}>
            <Icon size={iconSize} glyph={glyph} />
        </IconButton>
    );
};

export default IconButtonComponent;
