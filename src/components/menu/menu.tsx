import React, {useState, useEffect, MouseEvent, TransitionEvent} from 'react';
import styled, {css} from 'styled-components';

import {resetList} from '../../utils/css';
import {exclude} from '../../utils/styled-components';

type MenuContextType = {
    openMenuPanelIDs: React.ReactNode[];
    openMenuPanel: (parentMenuPanelID: string, menuPanelID: string) => void;
    closeMenuPanel: (menuPanelID: string) => void;
    menuPanelInitialized: (menuPanelID: string) => void;
    menuPanelClosed: (menuPanelID: string) => void;
};

export const MenuContext = React.createContext<MenuContextType | null>(null);

const MenuPanels = styled.div(() => {
    return css`
        ${resetList()}

        display: flex;
        position: absolute;
        pointer-events: none;

        @media (max-width: 899px) {
            flex-direction: column;
            justify-content: flex-end;
            width: 100%;
            height: calc(100% - 80px);

            // overide popper.js inline css
            inset: unset !important;
            bottom: 0 !important;
            left: 0 !important;
        }

        @media (min-width: 900px) {
            flex-direction: row;
            align-items: flex-start;

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

        @media (max-width: 899px) {
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

        @media (min-width: 900px) {
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

    // state to manage primary menu rendering/visibility
    const [containerShouldRender, setContainerShouldRender] = useState(false);
    const [menuIsVisible, setMenuIsVisible] = useState(false);

    // state to store filtered menu panel components and ids
    const [menuPanels, setMenuPanels] = useState<React.ReactNode[]>([]);
    const [menuPanelIDs, setMenuPanelIDs] = useState<string[]>([]);

    // state to manage menu panel rendering
    const [initializingPanelIDs, setInitializingPanelIDs] = useState<string[]>([]);
    const [openPanelIDs, setOpenPanelIDs] = useState<string[]>([]);
    const [closingPanelIDs, setClosingPanelIDs] = useState<string[]>([]);

    // current menu panel stack
    const [menuPanelStack, setMenuPanelStack] = useState<React.ReactNode[]>([]);

    // update menu open/close rendering state
    useEffect(() => {
        if (open) {
            setContainerShouldRender(true);
        }
        window.requestAnimationFrame(() => {
            setMenuIsVisible(open);
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

        // is the primary (first) menu panel unchanged?
        const primaryPanelIsDifferent = menuPanelIDs[0] !== filteredPanelIDs[0];

        // have existing menu panels been orphaned?
        const panelsHaveBeenOrphaned =
            menuPanels.filter((panel) => !filteredPanelIDs.includes((panel as React.ReactElement).props.id)).length > 0;

        // update menu state
        setMenuPanels(filteredPanels);
        setMenuPanelIDs(filteredPanelIDs);

        // reset menu panel rendering state if menu structure has changed
        if (primaryPanelIsDifferent || panelsHaveBeenOrphaned) {
            console.log('[DEBUG] children updates', {primaryPanelIsDifferent, panelsHaveBeenOrphaned});
            resetMenu(filteredPanelIDs[0]);
        }
    }, [children]); /* eslint-disable-line react-hooks/exhaustive-deps */

    // update menu panel rendering state
    useEffect(() => {
        if (!initializingPanelIDs && !openPanelIDs && !closingPanelIDs) {
            setMenuPanelStack(menuPanels);
            return;
        }
        const initializingPanels = initializingPanelIDs.map((panelID) =>
            cloneMenuPanel(menuPanels[menuPanelIDs.indexOf(panelID)] as React.ReactElement, true, false, false, false)
        );
        const openPanels = openPanelIDs.map((panelID, index) =>
            cloneMenuPanel(
                menuPanels[menuPanelIDs.indexOf(panelID)] as React.ReactElement,
                false,
                true,
                index === openPanelIDs.length - 1,
                false
            )
        );
        const closingPanels = closingPanelIDs.map((panelID) =>
            cloneMenuPanel(menuPanels[menuPanelIDs.indexOf(panelID)] as React.ReactElement, false, false, false, true)
        );
        const combinedPanelIDs = [...openPanelIDs, ...initializingPanelIDs, ...closingPanelIDs];
        const closedPanels = menuPanels.filter((_, index) => !combinedPanelIDs.includes(menuPanelIDs[index]));
        console.log('[DEBUG] update stack', {initializingPanels, openPanels, closingPanels, closedPanels});
        setMenuPanelStack([...openPanels, ...closingPanels, ...initializingPanels, ...closedPanels]);
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
        setClosingPanelIDs([]);
        setInitializingPanelIDs([]);
        setOpenPanelIDs([primaryMenuPanelID]);
    }

    function cloneMenuPanel(
        menuPanel: React.ReactElement,
        initializing = false,
        open = false,
        active = false,
        closing = false
    ): React.ReactElement {
        return React.cloneElement(menuPanel, {
            key: menuPanel.props.id + (closing ? '_closing' : ''),
            initializing,
            open,
            active,
            closing,
        });
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
        if ([...openPanelIDs, ...initializingPanelIDs].includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] openMenuPanel', {parentMenuPanelID, menuPanelID});
        // mark new panel as initializing
        setInitializingPanelIDs([...initializingPanelIDs, menuPanelID]); // should prevent duplicates
        // new panel replaces all following panels
        if (openPanelIDs.includes(parentMenuPanelID)) {
            const parentPanelIndex = openPanelIDs.indexOf(parentMenuPanelID);
            setOpenPanelIDs(openPanelIDs.slice(0, parentPanelIndex + 1));
            // mark orphaned panels as closing
            setClosingPanelIDs([...closingPanelIDs, ...openPanelIDs.slice(parentPanelIndex + 1)]); // should prevent duplicates
        }
    };
    const closeMenuPanel = (menuPanelID: string) => {
        if (!openPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] closeMenuPanel', {menuPanelID});
        setOpenPanelIDs(openPanelIDs.filter((panelID) => panelID !== menuPanelID));
        setClosingPanelIDs([...closingPanelIDs, menuPanelID]); // should prevent duplicates
    };

    const menuPanelInitialized = (menuPanelID: string) => {
        if (!initializingPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] menuPanelOpened', {menuPanelID});
        setInitializingPanelIDs(initializingPanelIDs.filter((panelID) => panelID !== menuPanelID));
        setOpenPanelIDs([...openPanelIDs, menuPanelID]);
    };
    const menuPanelClosed = (menuPanelID: string) => {
        console.log('[DEBUG] menuPanelClosed', {menuPanelID, closingPanelIDs});
        if (!closingPanelIDs.includes(menuPanelID)) {
            return;
        }
        console.log('[DEBUG] menuPanelClosed', {menuPanelID});
        setClosingPanelIDs(closingPanelIDs.filter((panelID) => panelID !== menuPanelID));
    };

    const menuContext: MenuContextType = {
        openMenuPanelIDs: openPanelIDs,
        openMenuPanel,
        closeMenuPanel,
        menuPanelInitialized,
        menuPanelClosed,
    };

    return true ? (
        <Menu open={menuIsVisible} onClick={handleOnClickEvent}>
            <MenuContext.Provider value={menuContext}>
                <MenuPanels onTransitionEnd={handleOnTransitionEnd}>{menuPanelStack}</MenuPanels>
            </MenuContext.Provider>
        </Menu>
    ) : null;
};
MenuComponent.displayName = 'Menu';

export default MenuComponent;
