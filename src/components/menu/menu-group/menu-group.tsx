import React from 'react';
import styled, {css} from 'styled-components';

import {resetList} from '../../../utils/css';

const MenuGroup = styled.li`
    ${resetList()}

    display: flex;
    flex-direction: column;

    & + & {
        &::before {
            content: '';
            height: 1px;
            background: rgba(var(--black-rgb), 0.16);
        }
    }
    @media (max-width: 899px) {
        & + & {
            &::before {
                margin: 8px 20px;
            }
        }
    }
    @media (min-width: 900px) {
        & + & {
            &::before {
                margin: 8px 0;
            }
        }
    }
`;

const MenuGroupWrapper = styled.ul(() => {
    return css`
        ${resetList()}

        display: flex;
        flex-direction: column;
    `;
});

const MenuGroupComponent: React.FC = (props) => {
    const {children, ...rest} = props;

    return (
        <MenuGroup {...rest}>
            <MenuGroupWrapper>{children}</MenuGroupWrapper>
        </MenuGroup>
    );
};
MenuGroupComponent.displayName = 'MenuGroup';

export default MenuGroupComponent;
