import React, {useState, useEffect} from 'react';
import styled, {css} from 'styled-components';

import {resetList} from '../../utils/css';

type MenuContextType = {
    openMenuPanel: (parentMenuPanelID: string, menuPanelID: string) => void;
    closeMenuPanel: (menuPanelID: string) => void;
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

const Menu = styled.div.withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) => !['open'].includes(prop) && defaultValidatorFn(prop),
})((props: Props) => {
    const {open = false} = props;

    return css`
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: ${open === true ? 'auto' : 'none'};
        visibility: ${open === true ? 'visible' : 'hidden'};

        will-change: visibility;

        transition: visibility var(--animation-speed-shortest) 0ms ${open === true ? 'step-start' : 'step-end'};

        @media (max-width: 899px) {
            background: ${open === true ? 'rgba(var(--black-rgb), 0.4)' : 'transparent'};

            will-change: visibility, background;

            transition: background var(--animation-speed-normal) 0ms ease-in-out,
                visibility var(--animation-speed-normal) 0ms ${open === true ? 'step-start' : 'step-end'};
        }

        ${MenuPanels} {
            ${open === true &&
            css`
                > * {
                    pointer-events: auto;
                }
            `}

            @media (max-width: 899px) {
                transform: ${open === true ? 'translateY(0%)' : 'translateY(100%)'} !important;

                will-change: transform;

                transition: transform var(--animation-speed-normal) 0ms ${open === true ? 'ease-in' : 'ease-out'};
            }

            @media (min-width: 900px) {
                opacity: ${open === true ? 1 : 0};
                visibility: ${open === true ? 'visible' : 'hidden'};
                transform: ${open === true ? 'translateY(0px)' : 'translateY(-8px)'};

                will-change: opacity, visibility, transform;

                transition: opacity var(--animation-speed-shortest) 0ms ${open === true ? 'ease-out' : 'ease-in'},
                    visibility var(--animation-speed-shortest) 0ms ${open === true ? 'step-end' : 'step-start'},
                    transform var(--animation-speed-shortest) 0ms ${open === true ? 'ease-out' : 'ease-in'};
            }
        }
    `;
});

const MenuComponent: React.FC<Props> = (props) => {
    const {children, open, onClose} = props;

    const [menuPanels, setMenuPanels] = useState<React.ReactNode[]>([]);
    const [menuPanelIDs, setMenuPanelIDs] = useState<string[]>([]);

    const [menuPanelStackIDs, setMenuPanelStackIDs] = useState<string[]>([]);
    const [menuPanelClosingStackIDs, setMenuPanelClosingStackIDs] = useState<string[]>([]);

    const [openMenuPanels, setOpenMenuPanels] = useState<React.ReactNode[]>([]);
    const [closingMenuPanels, setClosingMenuPanels] = useState<React.ReactNode[]>([]);
    const [closedMenuPanels, setClosedMenuPanels] = useState<React.ReactNode[]>([]);

    const [orderedMenuPanels, setOrderedMenuPanels] = useState<React.ReactNode[]>([]);

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    // handle children updates
    useEffect(() => {
        // ensure all children are legit react elements and have an id
        const filteredMenuPanels = React.Children.toArray(children).filter((child: React.ReactNode) => {
            if (!React.isValidElement(child)) {
                return false;
            }
            if (!child.props.id) {
                return false;
            }
            return true;
        });
        setMenuPanels(filteredMenuPanels);
        setMenuPanelIDs(filteredMenuPanels.map((menuPanel) => (menuPanel as React.ReactElement).props.id));
        // determine if open menu panel stack is still valid, update as needed
        let stackDiffersAtIndex = -1;
        const newPanelIDs = filteredMenuPanels.map((panel) => (panel as React.ReactElement).props.id);
        const updatedMenuPanelStackIDs = menuPanelStackIDs.filter((menuPanelStackID, index) => {
            const panelFound = newPanelIDs.includes(menuPanelStackID) && stackDiffersAtIndex < 0;
            if (!panelFound) {
                stackDiffersAtIndex = index;
            }
            return panelFound;
        });
        setMenuPanelStackIDs(updatedMenuPanelStackIDs.length > 0 ? updatedMenuPanelStackIDs : [newPanelIDs[0]]);
    }, [children]);

    // handle menu open/close
    useEffect(() => {
        setMenuIsOpen(open === true);
        if (!open && menuPanelStackIDs.length > 0) {
            setMenuPanelStackIDs([menuPanelStackIDs[0]]);
        }
    }, [open]);

    // handle menu panel updates
    useEffect(() => {
        if (menuPanels?.length === 0 || menuPanelStackIDs?.length === 0) {
            return;
        }
        // pull list of child panels that map to menu panel stack id's
        const openPanels = menuPanelStackIDs.map((menuPanelID, index) => {
            const menuPanel: React.ReactNode = menuPanels.find(
                (panel) => (panel as React.ReactElement).props.id === menuPanelID
            );
            return React.cloneElement(menuPanel as React.ReactElement, {
                key: (menuPanel as React.ReactElement).props.id,
                open: true,
                active: index === menuPanelStackIDs.length - 1,
            });
        });
        setOpenMenuPanels(openPanels);
        // pull list of child panels that are closing
        const closingPanels = menuPanelClosingStackIDs.map((menuPanelID, index) => {
            const menuPanel: React.ReactNode = menuPanels.find(
                (panel) => (panel as React.ReactElement).props.id === menuPanelID
            );
            return React.cloneElement(menuPanel as React.ReactElement, {
                key: (menuPanel as React.ReactElement).props.id,
                open: false,
                active: false,
            });
        });
        setClosingMenuPanels(closingPanels);
        // pull the rest of the child panels
        const closedPanels = menuPanels
            .filter(
                (menuPanel) =>
                    ![...menuPanelStackIDs, ...menuPanelClosingStackIDs].includes(
                        (menuPanel as React.ReactElement).props.id
                    )
            )
            .map((menuPanel) => {
                return React.cloneElement(menuPanel as React.ReactElement, {
                    key: (menuPanel as React.ReactElement).props.id,
                    open: false,
                    active: false,
                });
            });
        setClosedMenuPanels(closedPanels);
        // order menu panels
    }, [menuPanels, menuPanelStackIDs, menuPanelClosingStackIDs]);

    const handleMenuClickEvent = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClose?.();
    };

    const openMenuPanel = (parentMenuPanelID: string, menuPanelID: string) => {
        if (!parentMenuPanelID || !menuPanelID) {
            return;
        }

        const openStack = [
            ...menuPanelStackIDs.slice(0, menuPanelStackIDs.indexOf(parentMenuPanelID) + 1),
            menuPanelID,
        ];
        setMenuPanelStackIDs(openStack);

        const closingStack = menuPanelStackIDs
            .slice(menuPanelStackIDs.indexOf(parentMenuPanelID) + 1)
            .filter((panelID) => panelID !== menuPanelID);
        setMenuPanelClosingStackIDs(closingStack);
    };

    const closeMenuPanel = (menuPanelID: string) => {
        if (!menuPanelID) {
            return;
        }
        console.log('[DEBUG]', 'closing menu panel');
    };

    const menuContext: MenuContextType = {
        openMenuPanel,
        closeMenuPanel,
    };

    return (
        <Menu open={menuIsOpen} onClick={handleMenuClickEvent}>
            <MenuContext.Provider value={menuContext}>
                <MenuPanels>{[...openMenuPanels, ...closingMenuPanels, ...closedMenuPanels]}</MenuPanels>
            </MenuContext.Provider>
        </Menu>
    );
};
MenuComponent.displayName = 'Menu';

export default MenuComponent;
