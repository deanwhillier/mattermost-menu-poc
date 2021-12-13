import styled, {css} from 'styled-components';

type Props = {
    size: 'xsmall' | 'small' | 'medium' | 'large';
    wrap?: boolean;
};

const fontSizes: Record<Props['size'], number> = {
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
};

const lineHeights: Record<Props['size'], number> = {
    xsmall: 16 / 12,
    small: 18 / 14,
    medium: 20 / 16,
    large: 22 / 18,
};

const Text = styled.span((props: Props) => {
    const {size = 'medium', wrap = false} = props;

    return css`
        position: relative;
        font-family: 'Open Sans', sans-serif;
        font-size: ${fontSizes[size]}px;
        line-height: ${lineHeights[size]};
        text-overflow: ellipsis;
        white-space: ${wrap === true ? 'normal' : 'nowrap'};
        overflow: hidden;
        user-select: none;
    `;
});

export default Text;
