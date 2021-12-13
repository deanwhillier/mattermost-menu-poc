import styled, {css} from 'styled-components';

type Props = {
    size: 'small' | 'medium' | 'large' | 'xlarge';
    wrap?: boolean;
};

const fontSizes: Record<Props['size'], number> = {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 22,
};

const lineHeights: Record<Props['size'], number> = {
    small: 16 / 12,
    medium: 18 / 14,
    large: 24 / 16,
    xlarge: 26 / 22,
};

const Heading = styled.h1((props: Props) => {
    const {size = 'medium', wrap = false} = props;

    return css`
        position: relative;
        margin: 0;
        font-family: 'Metropolis', sans-serif;
        font-size: ${fontSizes[size]}px;
        font-weight: 600;
        line-height: ${lineHeights[size]};
        text-overflow: ellipsis;
        white-space: ${wrap === true ? 'normal' : 'nowrap'};
        overflow: hidden;
        user-select: none;
    `;
});

export default Heading;
