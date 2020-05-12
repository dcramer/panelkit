import styled from "styled-components";

export default styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;

  button {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  button svg {
    max-width: 100%;
    max-height: 100%;
  }

  h2 {
    display: inline-block;
    margin: 0;
  }
`;
