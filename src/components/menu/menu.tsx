import React, {useState, useEffect, MouseEvent, TransitionEvent} from 'react';
import styled, {css} from 'styled-components';

import {resetList} from '../../utils/css';
import {exclude} from '../../utils/styled-components';

type MenuContextType = {
    openMenuPanelIDs?: React.ReactNode[];
    openMenuPanel?: (parentMenuPanelID: string, menuPanelID: string) => void;
    closeMenuPanel?: (menuPanelID: string) => void;
    menuPanelInitialized?: (menuPanelID: string) => void;
    menuPanelClosed?: (menuPanelID: string) => void;
    isMobile: boolean;
};

export const MenuContext = React.createContext<MenuContextType>({isMobile: false});

export const mobileBreakpoint = window.matchMedia('(max-width: 899px)');
export const desktopBreakpoint = window.matchMedia('(min-width: 900px)');

const MenuPanels = styled.div(() => {
    return css`
        ${resetList()}

        display: flex;
        position: absolute;
        pointer-events: none;

        @media ${mobileBreakpoint.media} {
            flex-direction: column;
            justify-content: flex-end;
            width: 100%;
            height: calc(100% - 80px);

            // overide popper.js inline css
            inset: unset !important;
            bottom: 0 !important;
            left: 0 !important;
        }

        @media ${desktopBreakpoint.media} {
            flex-direction: row;
            align-items: flex-start;
            max-height: 100%;

            & + & {
                margin-inline-start: -3px;
            }
        }
    `;
});
MenuPanels.displayName = 'MenuPanels';

type Props = {
    open?: boolean;
    onClose?: () => void;
};

const Menu = styled.div
    .withConfig<Props>({
        shouldForwardProp: exclude(['open']),
    })
    .attrs((props: Props) => ({
        'data-open': props.open === true || null,
    }))`
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        visibility: hidden;

        will-change: visibility;
        transition: visibility var(--animation-speed-shortest) 0ms step-end;

        &[data-open='true'] {
            pointer-events: auto;
            visibility: visible;

            transition: visibility var(--animation-speed-shortest) 0ms step-start;

            ${MenuPanels} {
                > * {
                    pointer-events: auto;
                }
            }
        }

        @media ${mobileBreakpoint.media} {
            background: transparent;

            will-change: visibility, background;
            transition: background var(--animation-speed-normal) 0ms ease-in-out,
                visibility var(--animation-speed-normal) 0ms step-end;

            ${MenuPanels} {
                transform: translateY(100%) !important;

                will-change: transform;
                transition: transform var(--animation-speed-normal) 0ms ease-out;
            }

            &[data-open='true'] {
                background: rgba(var(--black-rgb), 0.4);

                transition: background var(--animation-speed-normal) 0ms ease-in-out,
                    visibility var(--animation-speed-normal) 0ms step-start;

                ${MenuPanels} {
                    transform: translateY(0%) !important;

                    transition: transform var(--animation-speed-normal) 0ms ease-in;
                }
            }
        }

        @media ${desktopBreakpoint.media} {
            ${MenuPanels} {
                opacity: 0;
                visibility: hidden;
                transform: translateY(-8px);

                will-change: opacity, visibility, transform;
                transition: opacity var(--animation-speed-shortest) 0ms ease-in,
                    visibility var(--animation-speed-shortest) 0ms step-start,
                    transform var(--animation-speed-shortest) 0ms ease-in;
            }

            &[data-open='true'] {
                ${MenuPanels} {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0px);

                    transition: opacity var(--animation-speed-shortest) 0ms ease-out,
                        visibility var(--animation-speed-shortest) 0ms step-end,
                        transform var(--animation-speed-shortest) 0ms ease-out;
                }
            }
        }
    `;

const MenuComponent: React.FC<Props> = (props) => {
    const {children, open = false, onClose} = props;

    const [isMobile, setIsMobile] = useState(mobileBreakpoint.matches);

    // state to manage primary menu rendering/visibility
    const [containerShouldRender, setContainerShouldRender] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    // state to store filtered menu panel components and ids
    const [menuPanels, setMenuPanels] = useState<React.ReactNode[]>([]);
    const [menuPanelIDs, setMenuPanelIDs] = useState<string[]>([]);

    // state to manage menu panel rendering
    const [initializingPanelIDs, setInitializingPanelIDs] = useState<string[]>([]);
    const [openPanelIDs, setOpenPanelIDs] = useState<string[]>([]);
    const [closingPanelIDs, setClosingPanelIDs] = useState<string[]>([]);

    // current menu panel stack
    const [menuPanelStack, setMenuPanelStack] = useState<React.ReactNode[]>([]);

    // register media query listener
    useEffect(() => {
        if (mobileBreakpoint.addEventListener) {
            mobileBreakpoint.addEventListener('change', handleMobileBreakpointChangeEvent);
        } else if (mobileBreakpoint.addListener) {
            mobileBreakpoint.addListener(handleMobileBreakpointChangeEvent);
        }
        return () => {
            if (mobileBreakpoint.removeEventListener) {
                mobileBreakpoint.removeEventListener('change', handleMobileBreakpointChangeEvent);
            } else if (mobileBreakpoint.removeListener) {
                mobileBreakpoint.removeListener(handleMobileBreakpointChangeEvent);
            }
        };
    }, []);

    // update menu open/close rendering state
    useEffect(() => {
        if (open) {
            setContainerShouldRender(true);
        }
        window.requestAnimationFrame(() => {
            setMenuIsOpen(open);
        });
    }, [open]);

    // reset menu when fully closed
    useEffect(() => {
        if (!containerShouldRender) {
            resetMenu(menuPanelIDs[0]);
        }
    }, [containerShouldRender]); /* eslint-disable-line react-hooks/exhaustive-deps */

    // update menu panel component and id state
    useEffect(() => {
        // filter provided list of child menu panels
        const filteredPanels = filterChildren(children);
        const filteredPanelIDs = filteredPanels.map((panel) => (panel as React.ReactElement).props.id);

        // update menu state
        setMenuPanels(filteredPanels);
        setMenuPanelIDs(filteredPanelIDs);

        // is the primary (first) menu panel unchanged?
        const primaryPanelIsDifferent = menuPanelIDs[0] !== filteredPanelIDs[0];

        // have existing menu panels been orphaned?
        const panelsHaveBeenOrphaned =
            menuPanels.filter((panel) => !filteredPanelIDs.includes((panel as React.ReactElement).props.id)).length > 0;

        // reset menu panel rendering state if menu structure has changed
        if (primaryPanelIsDifferent || panelsHaveBeenOrphaned) {
            resetMenu(filteredPanelIDs[0]);
        }
    }, [children]); /* eslint-disable-line react-hooks/exhaustive-deps */

    // update menu panel rendering state
    useEffect(() => {
        if (!initializingPanelIDs && !openPanelIDs && !closingPanelIDs) {
            setMenuPanelStack(menuPanels);
            return;
        }
        console.log('[DEBUG] state update', {openPanelIDs, initializingPanelIDs, closingPanelIDs});
        const openPanels = openPanelIDs.map((panelID, index) => {
            const activePanelID = openPanelIDs
                .filter((panelID) => ![...initializingPanelIDs, ...closingPanelIDs].includes(panelID))
                .pop();
            return cloneMenuPanel(
                menuPanels[menuPanelIDs.indexOf(panelID)] as React.ReactElement,
                initializingPanelIDs.includes(panelID),
                true,
                panelID === activePanelID,
                closingPanelIDs.includes(panelID)
            );
        });
        setMenuPanelStack([...openPanels]);
    }, [menuPanels, menuPanelIDs, openPanelIDs, initializingPanelIDs, closingPanelIDs]);

    // helper functions

    function filterChildren(children: React.ReactNode) {
        return React.Children.toArray(children).filter((child: React.ReactNode) => {
            if (!React.isValidElement(child)) {
                return false;
            }
            if (!child.props.id) {
                return false;
            }
            return true;
        });
    }

    function resetMenu(primaryMenuPanelID: string) {
        setInitializingPanelIDs([]);
        setOpenPanelIDs([primaryMenuPanelID]);
        setClosingPanelIDs([]);
    }

    function cloneMenuPanel(
        menuPanel: React.ReactElement,
        initializing = false,
        open = false,
        active = false,
        closing = false
    ): React.ReactElement {
        return React.cloneElement(menuPanel, {
            key: menuPanel.props.id,
            initializing,
            open,
            active,
            closing,
        });
    }

    function handleMobileBreakpointChangeEvent(event: MediaQueryListEvent) {
        setIsMobile(event.matches === true);
    }

    // event handlers

    const handleOnClickEvent = (event: MouseEvent<HTMLDivElement>) => {
        if (open && onClose) {
            onClose();
        }
    };

    const handleOnTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        if (!open) {
            setContainerShouldRender(false);
        }
    };

    // context handlers
    const openMenuPanel = (parentMenuPanelID: string, menuPanelID: string) => {
        if (openPanelIDs.includes(menuPanelID)) {
            setClosingPanelIDs([...closingPanelIDs, ...openPanelIDs.slice(openPanelIDs.indexOf(menuPanelID) + 1)]);
            return;
        }
        console.log('[DEBUG] openMenuPanel', {parentMenuPanelID, menuPanelID});
        setOpenPanelIDs([...openPanelIDs, menuPanelID]);
        setInitializingPanelIDs([...initializingPanelIDs, menuPanelID]);
        setClosingPanelIDs([...closingPanelIDs, ...openPanelIDs.slice(openPanelIDs.indexOf(parentMenuPanelID) + 1)]);
    };
    const closeMenuPanel = (menuPanelID: string) => {
        if (!openPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] closeMenuPanel', {menuPanelID});
        setClosingPanelIDs([...closingPanelIDs, ...openPanelIDs.slice(openPanelIDs.indexOf(menuPanelID))]);
    };

    const menuPanelInitialized = (menuPanelID: string) => {
        if (!initializingPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] menuPanelInitialized', {menuPanelID});
        setInitializingPanelIDs(initializingPanelIDs.filter((panelID) => panelID !== menuPanelID));
    };
    const menuPanelClosed = (menuPanelID: string) => {
        if (!closingPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] menuPanelClosed', {menuPanelID});
        setOpenPanelIDs([...openPanelIDs.filter((panelID) => panelID !== menuPanelID)]);
        setClosingPanelIDs([...closingPanelIDs.filter((panelID) => panelID !== menuPanelID)]);
    };

    const menuContext: MenuContextType = {
        openMenuPanelIDs: openPanelIDs,
        openMenuPanel,
        closeMenuPanel,
        menuPanelInitialized,
        menuPanelClosed,
        isMobile,
    };

    return true ? (
        <Menu open={menuIsOpen} onClick={handleOnClickEvent}>
            <MenuContext.Provider value={menuContext}>
                <MenuPanels onTransitionEnd={handleOnTransitionEnd}>{menuPanelStack}</MenuPanels>
            </MenuContext.Provider>
        </Menu>
    ) : null;
};
MenuComponent.displayName = 'Menu';

export default MenuComponent;
