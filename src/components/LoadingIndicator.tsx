import React from "react";
import styled from "styled-components";

export default styled(({ className }) => (
  <div className={className}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
))`
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;

  display: inline-block;
  position: relative;

  div {
    position: absolute;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: #fff;
    animation: lds-grid 1.2s linear infinite;
  }
  div:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  div:nth-child(2) {
    top: 10%;
    left: 43%;
    animation-delay: -0.4s;
  }
  div:nth-child(3) {
    top: 10%;
    left: 76%;
    animation-delay: -0.8s;
  }
  div:nth-child(4) {
    top: 43%;
    left: 10%;
    animation-delay: -0.4s;
  }
  div:nth-child(5) {
    top: 43%;
    left: 43%;
    animation-delay: -0.8s;
  }
  div:nth-child(6) {
    top: 43%;
    left: 76%;
    animation-delay: -1.2s;
  }
  div:nth-child(7) {
    top: 76%;
    left: 10%;
    animation-delay: -0.8s;
  }
  div:nth-child(8) {
    top: 76%;
    left: 43%;
    animation-delay: -1.2s;
  }
  div:nth-child(9) {
    top: 76%;
    left: 76%;
    animation-delay: -1.6s;
  }
  @keyframes lds-grid {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
