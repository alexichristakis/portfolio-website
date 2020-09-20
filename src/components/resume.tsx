import React from "react";
import styled from "styled-components";

export interface ResumeProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const Container = styled.div``;

export const Resume: React.FC<ResumeProps> = ({ isOpen, onRequestClose }) => {
  return <Container></Container>;
};
