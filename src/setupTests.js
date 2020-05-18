// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React from "react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("./components/Icon");

jest.mock("./components/Icon", () => {
  return {
    __esModule: true,
    loadIcons: function () {},
    default: () => {
      return <svg></svg>;
    },
  };
});
