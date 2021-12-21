import {useContext, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';

import Icon from '../../icon';
import Text from '../../text';

import {MenuContext} from '../menu';
import {MenuPanelContext} from '../menu-panel';

import {resetList, resetButton} from '../../../utils/css';

export type Props = {
    menuPanelID?: string;
    iconGlyph?: string;
    active?: boolean;
    destructive?: boolean;
};

const MenuItem = styled.li((props: Props) => {
    const {active, destructive} = props;

    const foregroundColors = {
        default: 'rgba(var(--black-rgb), 1)',
        hover: destructive ? 'rgba(var(--destructive-rgb), 1)' : 'rgba(var(--black-rgb), 1)',
        active: 'rgba(var(--black-rgb), 1)',
        destructive: 'rgba(var(--destructive-rgb), 1)',
    };

    const backgroundColors = {
        default: 'transparent',
        hover: destructive ? 'rgba(var(--destructive-rgb), 0.08)' : 'rgba(var(--black-rgb), 0.08)',
        active: 'rgba(var(--button-bg-rgb), 0.08)',
        destructive: 'transparent',
    };

    const iconColors = {
        default: 'rgba(var(--black-rgb), 0.56)',
        hover: destructive ? 'inherit' : 'rgba(var(--black-rgb), 0.64)',
        active: 'rgba(var(--black-rgb), 0.64)',
        destructive: 'inherit',
    };

    let defaultForegroundColor;
    let defaultBackgroundColor;
    let defautlIconColor;

    switch (true) {
        case destructive:
            defaultForegroundColor = foregroundColors.destructive;
            defaultBackgroundColor = backgroundColors.destructive;
            defautlIconColor = iconColors.destructive;
            break;
        case active:
            defaultForegroundColor = foregroundColors.active;
            defaultBackgroundColor = backgroundColors.active;
            defautlIconColor = iconColors.active;
            break;
        default:
            defaultForegroundColor = foregroundColors.default;
            defaultBackgroundColor = backgroundColors.default;
            defautlIconColor = iconColors.default;
    }

    return css`
        ${resetList()}

        display: grid;
        place-items: center start;
        position: relative;
        padding: 0;
        margin: 0;
        list-style: none;
        color: ${defaultForegroundColor};
        background: ${defaultBackgroundColor};

        ${Icon} {
            color: ${defautlIconColor};
        }

        &:active {
            color: ${foregroundColors.active};
            background: ${backgroundColors.active};

            ${Icon} {
                color: ${iconColors.active};
            }
        }

        &:hover {
            color: ${foregroundColors.hover};
            background: ${backgroundColors.hover};

            ${Icon} {
                color: ${iconColors.hover};
            }
        }

        transition: color var(--animation-speed-shorter) 0ms ease-in-out,
            background var(--animation-speed-shorter) 0ms ease-in-out;

        &:hover,
        &:active {
            transition: color var(--animation-speed-shorter) 0ms ease-in-out,
                background var(--animation-speed-shorter) 0ms ease-in-out;
        }
    `;
});

const MenuItemWrapper = styled.button`
    ${resetButton()};

    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    position: relative;
    padding: 0 20px 0 48px;
    width: 100%;
    min-height: 36px;
    line-height: 36px;
`;

const MenuItemIcon = styled(Icon)`
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
`;

const MenuItemActionIcon = styled(Icon)``;

const MenuItemComponent: React.FC<Props> = (props) => {
    const {children, menuPanelID, iconGlyph, ...rest} = props;

    const {openMenuPanel, openMenuPanelIDs, isMobile} = useContext(MenuContext);
    const {menuPanelID: parentMenuPanelID} = useContext(MenuPanelContext);

    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (!openMenuPanelIDs || !menuPanelID) {
            return;
        }
        setSelected(openMenuPanelIDs.includes(menuPanelID));
    }, [openMenuPanelIDs, menuPanelID]);

    // helper functions

    const menuItemSelected = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!menuPanelID || !openMenuPanel || !parentMenuPanelID) {
            return;
        }
        event.stopPropagation();
        openMenuPanel(parentMenuPanelID, menuPanelID);
    };

    // event handlers

    const handleClickEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isMobile) {
            menuItemSelected(event);
        }
    };

    const handleMouseOverEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isMobile) {
            menuItemSelected(event);
        }
    };

    return (
        <MenuItem active={selected} {...rest}>
            <MenuItemWrapper onClick={handleClickEvent} onMouseOver={handleMouseOverEvent}>
                {iconGlyph && <MenuItemIcon glyph={iconGlyph} size='16' />}
                <Text size={'small'}>{children}</Text>
                {menuPanelID && <MenuItemActionIcon glyph='icon-chevron-right' size='16' />}
            </MenuItemWrapper>
        </MenuItem>
    );
};

export default MenuItemComponent;
