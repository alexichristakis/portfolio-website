import React from "react";
import styled from "styled-components";

import { H2 } from "./text";

const Container = styled.div`
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  padding: ${({ theme }) => theme.space[32]}px;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Footer: React.FC = () => {
  return (
    <Container>
      <H2>Alexi Christakis</H2>
    </Container>
  );
};
