import React, {useContext, useState, useEffect, useRef, TransitionEvent} from 'react';
import styled from 'styled-components';

import {MenuContext} from '../menu';

import {resetList} from '../../../utils/css';
import {exclude} from '../../../utils/styled-components';

type MenuPanelContextType = {
    menuPanelID: string;
};
export const MenuPanelContext = React.createContext<MenuPanelContextType | null>(null);

export type Props = {
    id: string;
    initializing?: boolean;
    open?: boolean;
    closing?: boolean;
    active?: boolean;
    visible?: boolean;
};

const MenuPanel = styled.ul
    .withConfig<Props>({
        shouldForwardProp: exclude(['initializing', 'open', 'closing', 'active', 'visible']),
    })
    .attrs((props: Props) => ({
        'data-initializing': props.initializing === true || null,
        'data-open': props.open === true || null,
        'data-closing': props.closing === true || null,
        'data-active': props.active === true || null,
        'data-visible': props.active === true || null,
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
    `;

const MenuPanelComponent: React.FC<Props> = (props) => {
    const {children, id, initializing = false, open = false, active = false, closing = false} = props;

    const panelRef = useRef(null);

    const menuContext = useContext(MenuContext);

    const [containerShouldRender, setContainerShouldRender] = useState(open);
    const [panelIsVisible, setPanelIsVisible] = useState(false);

    // tell the menu that the panel is ready
    useEffect(() => {
        if (initializing) {
            menuContext?.menuPanelInitialized(id);
        }
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    useEffect(() => {
        if (initializing && !containerShouldRender) {
            setContainerShouldRender(true);
        }
        window.requestAnimationFrame(() => {
            setPanelIsVisible(initializing || open || closing);
        });
    }, [initializing, open, closing]); /* eslint-disable-line react-hooks/exhaustive-deps */

    const onTransitionEnd = (event: TransitionEvent<HTMLUListElement>) => {
        if (event.target === panelRef.current) {
            console.log('[DEBUG]', {id, property: event.propertyName, initializing, open, closing, event});
        }
        if (!(initializing || open || closing)) {
            console.log('[DEBUG] HERE!!!');
            setContainerShouldRender(false);
        }
        if (closing) {
            menuContext?.menuPanelClosed(id);
        }
    };

    return true ? (
        <MenuPanelContext.Provider value={{menuPanelID: id}}>
            <MenuPanel
                ref={panelRef}
                id={id}
                initializing={initializing}
                open={open}
                closing={closing}
                active={active}
                visible={panelIsVisible}
                onTransitionEnd={onTransitionEnd}
            >
                {children}
            </MenuPanel>
        </MenuPanelContext.Provider>
    ) : null;
};
MenuPanelComponent.displayName = 'MenuPanel';

export default MenuPanelComponent;
