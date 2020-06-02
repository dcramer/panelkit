import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";

const Header = styled.div`
  height: 90px;
  padding: 20px 20px 0;
  font-size: 20pt;
  margin-bottom: 0;
  color: var(--white);
  display: flex;
  align-items: flex-end;
`;

const DateContainer = styled.div`
  font-size: 16pt;
`;

type DateTimeProps = {};

class DateTime<DateTimeProps> extends Component {
  readonly state: {
    time: number | null;
  } = {
    time: null,
  };

  timer: number | null = null;

  componentDidMount() {
    this.setState({ time: new Date().getTime() });
    this.timer = setTimeout(() => {
      this.setState({ time: new Date().getTime() });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    if (!this.state.time) return null;
    return (
      <div {...this.props}>
        <div>{moment(this.state.time).format("LT")}</div>
        <DateContainer>
          {moment(this.state.time).format("dddd, MMMM Do")}
        </DateContainer>
      </div>
    );
  }
}

export default ({ ...props }) => {
  return (
    <Header {...props}>
      <DateTime />
    </Header>
  );
};
