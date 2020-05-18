import styled from "styled-components";

export type TransparentButtonProps = {
  onClick?: Function;
};

export default styled.button`
  background: inherit;
  color: inherit;
  border: 0;
  padding: 0;
  margin: 0;
  font-size: inherit;
  display: inline;
  outline: none;
  cursor: pointer;
`;
