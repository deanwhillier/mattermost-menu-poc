import React, {useState, useEffect, TransitionEvent} from 'react';
import styled, {css} from 'styled-components';

import {resetList} from '../../../utils/css';

type MenuPanelContextType = {
    menuPanelID: string;
};
export const MenuPanelContext = React.createContext<MenuPanelContextType | null>(null);

export type Props = {
    id: string;
    open?: boolean;
    closing?: boolean;
    active?: boolean;
};

const MenuPanel = styled.ul
    .withConfig({
        shouldForwardProp: (prop, defaultValidatorFn) => !['open'].includes(prop) && defaultValidatorFn(prop),
    })
    .attrs((props: Props) => {
        return {'data-open': props.open, 'data-active': props.active};
    })((props: Props) => {
    const {open = false, closing = false, active = false} = props;

    return css`
        ${resetList()}

        display: flex;
        flex-direction: column;
        position: relative;
        min-width: 114px;
        background: white;

        @media (max-width: 899px) {
            position: ${open === true && active === true ? 'relative' : 'absolute'};
            left: 0;
            bottom: 0;
            padding: 12px 0;
            width: 100%;
            max-height: 100%;
            border-radius: 12px 12px 0 0;
            box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
            overflow-y: auto;
            visibility: ${open === true && active === true ? 'visible' : 'hidden'};
            z-index: ${open === true && active === true ? 2 : 1};
            transform: translateX(${open === true ? (active === true ? 0 : -100) : 100}%);

            will-change: transform, visibility;

            :first-child {
                transform: translateX(${open === true && active === false ? -100 : 0}%);
            }

            // animation
            transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                visibility var(--animation-speed-normal) 0ms
                    ${open === true && active === true ? 'step-start' : 'step-end'};
        }

        @media (min-width: 900px) {
            padding: 8px 0;
            max-width: 496px;
            border-radius: 4px;
            box-shadow: 0px 0px 1px 1px rgba(var(--black-rgb), 0.16), 0px 6px 14px rgba(0, 0, 0, 0.12);
            opacity: ${open === true ? 1 : 0};
            visibility: ${open === true ? 'visible' : 'hidden'};
            transform: translateX(${open === true ? 0 : -8}px);
            overflow-y: ${open === true && active === true ? 'auto' : 'hidden'};

            will-change: transform, opacity, visibility;

            & + & {
                margin-inline-start: -3px;
            }

            // animation
            transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                opacity var(--animation-speed-shortest) 0ms ease-in-out,
                visibility var(--animation-speed-shortest) 0ms
                    ${open === true && active === true ? 'step-start' : 'step-end'};
        }
    `;
});

const MenuPanelComponent: React.FC<Props> = (props) => {
    const {children, id, open = false, active = false} = props;

    const [menuShouldRender, setMenuShouldRender] = useState(open);
    const [menuIsVisible, setMenuIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setMenuShouldRender(true);
        }
        window.requestAnimationFrame(() => {
            setMenuIsVisible(open);
        });
    }, [open]);

    const onTransitionEnd = (event: TransitionEvent<HTMLUListElement>) => {
        if (!open) {
            setMenuShouldRender(false);
        }
    };

    return menuShouldRender ? (
        <MenuPanelContext.Provider value={{menuPanelID: id}}>
            <MenuPanel
                id={id}
                open={menuIsVisible}
                closing={menuShouldRender && !open}
                active={active}
                onTransitionEnd={onTransitionEnd}
            >
                {children}
            </MenuPanel>
        </MenuPanelContext.Provider>
    ) : null;
};
MenuPanelComponent.displayName = 'MenuPanel';

export default MenuPanelComponent;
