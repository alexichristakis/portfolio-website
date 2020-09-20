import styled, { css } from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from "styled-system";

export type TextComponentProps = BorderProps &
  ColorProps &
  LayoutProps &
  PositionProps &
  SpaceProps &
  TextAlignProps;

const baseTextStyles = css`
    margin: 0;
    ${border}
    ${color}
    ${layout}
    ${position}
    ${space}
    ${textAlign}
  `;

export const H1 = styled("h1")<TextComponentProps>`
  ${baseTextStyles}
  ${({ theme }) => theme.fontStyles.h1}
`;

export const H2 = styled("h2")<TextComponentProps>`
  ${baseTextStyles}
  ${({ theme }) => theme.fontStyles.h2}
`;

export const H3 = styled("h3")<TextComponentProps>`
  ${baseTextStyles}
  ${({ theme }) => theme.fontStyles.h3}
`;

export const Body = styled("p")<TextComponentProps>`
  ${baseTextStyles}
  ${({ theme }) => theme.fontStyles.body}
`;

export const BodySmall = styled("p")<TextComponentProps>`
  ${baseTextStyles}
  ${({ theme }) => theme.fontStyles.bodySmall}
`;
