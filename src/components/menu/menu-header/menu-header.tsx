import styled from 'styled-components';

import IconButton from '../../icon-button';
import Heading from '../../heading';

import {resetList} from '../../../utils/css';

const MenuHeaderWrapper = styled.div`
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    min-height: 32px;
`;

const LeftButton = styled(IconButton)`
    color: rgba(var(--black-rgb), 0.56);
`;
const RightButton = styled(IconButton)`
    visibility: hidden;
`;

const MenuHeader = styled.li`
    ${resetList()}

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: space-between;
    position: sticky;
    top: 0;
    padding: 0 16px;
    color: rgba(var(--black-rgb), 1);
    z-index: 2;

    &::before {
        content: '';
        position: absolute;
        top: -12px;
        bottom: 8px;
        left: 0;
        right: 0;
        background: white;
        border-radius: 12px;
        z-index: 0;
    }

    &::after {
        content: '';
        position: relative;
        margin: 8px 0;
        height: 1px;
        background: rgba(var(--black-rgb), 0.16);
    }

    @media (min-width: 900px) {
        display: none;
    }
`;

export type Props = {
    enableBackButton?: boolean;
    leftButtonGlyph?: string;
    onClose?: () => void;
};

const MenuHeaderComponent: React.FC<Props> = (props) => {
    const {children, enableBackButton = false, onClose} = props;

    const handleClickEvent = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClose?.();
    };

    return (
        <MenuHeader>
            <MenuHeaderWrapper>
                {enableBackButton && <LeftButton glyph='icon-arrow-back-ios' onClick={handleClickEvent} />}
                <Heading size='large'>{children}</Heading>
                <RightButton glyph='icon-arrow-back-ios' />
            </MenuHeaderWrapper>
        </MenuHeader>
    );
};
MenuHeaderComponent.displayName = 'MenuHeader';

export default MenuHeaderComponent;
