import React from "react";
import styled from "styled-components";

const Header = styled.div`
  height: 110px;
  padding: 20px 20px 0;
  font-size: 20pt;
  margin-bottom: 10px;
  color: var(--white);
  display: flex;
  align-items: flex-end;
`;

const DateTime = styled.div``;

const Clock = styled.div``;

const Date = styled.div`
  font-size: 16pt;
`;

const Colon = styled.span`
  animation: blink 2s step-start 0s infinite;
  font-size: 0.93em;
  margin: 0 3px;
`;

export default ({ ...props }) => {
  return (
    <Header {...props}>
      <DateTime>
        <Clock>
          14<Colon>:</Colon>54
        </Clock>
        <Date>Monday, May 11</Date>
      </DateTime>
    </Header>
  );
};
