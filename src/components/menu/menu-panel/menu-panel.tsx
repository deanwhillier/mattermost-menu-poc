import React, {useContext, useState, useEffect, useRef, TransitionEvent} from 'react';
import styled, {css} from 'styled-components';

import {MenuContext} from '../menu';

import {resetList} from '../../../utils/css';
import {exclude} from '../../../utils/styled-components';

type MenuPanelContextType = {
    menuPanelID: string;
};
export const MenuPanelContext = React.createContext<MenuPanelContextType | null>(null);

export type Props = {
    id: string;
    open?: boolean;
    initializing?: boolean;
    closing?: boolean;
    active?: boolean;
};

/* const MenuPanelOld = styled.ul
    .withConfig<Props>({
        shouldForwardProp: exclude(['open', 'initializing', 'closing', 'active']),
    })
    .attrs((props: Props) => ({
        'data-initializing': props.initializing === true || null,
        'data-open': props.open === true || null,
        'data-closing': props.closing === true || null,
        'data-active': props.active === true || null,
    }))`
        ${resetList()}

        display: flex;
        flex-direction: column;
        min-width: 114px;
        background: white;

        @media (max-width: 899px) {
            position: absolute;
            left: 0;
            bottom: 0;
            padding: 12px 0;
            width: 100%;
            max-height: 100%;
            border-radius: 12px 12px 0 0;
            box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
            overflow-y: auto;
            visibility: hidden;
            z-index: 1;
            transform: translateX(100%);

            will-change: transform, visibility;
            transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                visibility var(--animation-speed-normal) 0ms step-end;

            :first-child {
                transform: translateX(0%);
            }

            &[data-open='true'] {
                transform: translateX(-100%);
            }

            &[data-open='true'][data-active='true'] {
                visibility: visible;
                z-index: 2;
                transform: translateX(0%);

                transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                    visibility var(--animation-speed-normal) 0ms step-start;
            }
        }

        @media (min-width: 900px) {
            position: relative;
            padding: 8px 0;
            max-width: 496px;
            border-radius: 4px;
            box-shadow: 0px 0px 1px 1px rgba(var(--black-rgb), 0.16), 0px 6px 14px rgba(0, 0, 0, 0.12);
            opacity: 0;
            visibility: hidden;
            transform: translateX(-8px);
            overflow-y: hidden;

            will-change: transform, opacity, visibility;
            transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                opacity var(--animation-speed-shortest) 0ms ease-in-out,
                visibility var(--animation-speed-shortest) 0ms step-end;

            & + & {
                margin-inline-start: -3px;
            }

            &[data-open='true'] {
                opacity: 1;
                visibility: visible;
                transform: translateX(0px);

                transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                    opacity var(--animation-speed-shortest) 0ms ease-in-out,
                    visibility var(--animation-speed-shortest) 0ms step-start;
            }

            &[data-open='true'][data-active='true'] {
                overflow-y: auto;

                transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                    opacity var(--animation-speed-shortest) 0ms ease-in-out,
                    visibility var(--animation-speed-shortest) 0ms step-start;
            }
        }
    `; */

const MenuPanel = styled.ul
    .withConfig<Props>({
        shouldForwardProp: exclude(['open', 'initializing', 'closing', 'active']),
    })
    .attrs((props: Props) => ({
        'data-open': props.open === true || null,
        'data-initializing': props.initializing === true || null,
        'data-closing': props.closing === true || null,
        'data-active': props.active === true || null,
    }))((props: Props) => {
    return css`
        ${resetList()}

        display: flex;
        flex-direction: column;
        min-width: 114px;
        background: white;

        @media (max-width: 899px) {
            position: absolute;
            left: 0;
            bottom: 0;
            padding: 12px 0;
            width: 100%;
            max-height: 100%;
            border-radius: 12px 12px 0 0;
            box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
            overflow-y: auto;

            will-change: transform, visibility;

            // panel initial/final visibility and position
            &,
            &[data-initializing='true'],
            &[data-closing='true'] {
                visibility: hidden;
                z-index: 1;
                transform: translateX(100%);

                transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                    visibility var(--animation-speed-normal) 0ms step-end;
            }

            // panel position when fully open
            &[data-open='true']:not([data-initializing='true']):not([data-closing='true']):not([data-active='true']) {
                visibility: hidden;
                z-index: 1;
                transform: translateX(-100%);

                transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                    visibility var(--animation-speed-normal) 0ms step-end;
            }

            // panel position when active
            &[data-open='true'][data-active='true'] {
                visibility: visible;
                z-index: 2;
                transform: translateX(0%);

                transition: transform var(--animation-speed-normal) 0ms ease-in-out,
                    visibility var(--animation-speed-normal) 0ms step-start;
            }
        }

        @media (min-width: 900px) {
            position: relative;
            padding: 8px 0;
            max-width: 496px;
            max-height: 100%;
            border-radius: 4px;
            box-shadow: 0px 0px 1px 1px rgba(var(--black-rgb), 0.16), 0px 6px 14px rgba(0, 0, 0, 0.12);
            overflow-y: hidden;

            // overlap sibling panels
            & + & {
                margin-inline-start: -3px;
            }

            // panel initial/final visibility and position
            &,
            &[data-initializing='true'],
            &[data-closing='true'] {
                opacity: 0;
                visibility: hidden;
                transform: translateX(-8px);

                will-change: transform, opacity, visibility;
                transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                    opacity var(--animation-speed-shortest) 0ms ease-in-out,
                    visibility var(--animation-speed-shortest) 0ms step-end;
            }

            // panel position when fully open
            &[data-open='true']:not([data-initializing='true']):not([data-closing='true']) {
                opacity: 1;
                visibility: visible;
                transform: translateX(0px);

                transition: transform var(--animation-speed-shortest) 0ms ease-in-out,
                    opacity var(--animation-speed-shortest) 0ms ease-in-out,
                    visibility var(--animation-speed-shortest) 0ms step-start;
            }

            // allow vertical scrolling when panel is active
            &[data-open='true'][data-active='true'] {
                overflow-y: auto;
            }

            // when opening a new panel and closing this one, delay the incoming animation of the new panel
            // - better aesthetic
            // - prevents menu potition popping
            &[data-open='true'][data-closing='true'] + [data-open='true'][data-active='true'] {
                transition: transform var(--animation-speed-shortest) var(--animation-speed-shorter) ease-in-out,
                    opacity var(--animation-speed-shortest) var(--animation-speed-shorter) ease-in-out,
                    visibility var(--animation-speed-shortest) var(--animation-speed-shorter) step-start;
            }
        }
    `;
});

const MenuPanelComponent: React.FC<Props> = (props) => {
    const {children, id, initializing = false, open = false, active = false, closing = false} = props;

    const panelRef = useRef<HTMLUListElement>(null);

    const menuContext = useContext(MenuContext);

    const [containerShouldRender, setContainerShouldRender] = useState(open);
    const [panelIsOpen, setPanelIsOpen] = useState(false);

    // update panel open/close rendering state
    useEffect(() => {
        if (open && !containerShouldRender) {
            setContainerShouldRender(true);
        }
        window.requestAnimationFrame(() => {
            setPanelIsOpen(open);
        });
    }, [open]); /* eslint-disable-line react-hooks/exhaustive-deps */

    // tell the menu that the panel is ready
    useEffect(() => {
        if (panelIsOpen && initializing) {
            menuContext?.menuPanelInitialized(id);
        }
    }, [panelIsOpen, initializing]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const onTransitionEnd = (event: TransitionEvent<HTMLUListElement>) => {
        if (event.target === panelRef.current && event.propertyName === 'visibility') {
            if (closing) {
                menuContext?.menuPanelClosed(id);
            }
            if (!open) {
                setContainerShouldRender(false);
            }
        }
    };

    return containerShouldRender ? (
        <MenuPanelContext.Provider value={{menuPanelID: id}}>
            <MenuPanel
                ref={panelRef}
                id={id}
                open={panelIsOpen}
                initializing={initializing}
                closing={closing}
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
