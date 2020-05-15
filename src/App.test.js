import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

const DEFAULT_CONFIG = {
  url: "http://localhost:8123",
  accessToken: "invalid",
  tiles: [],
};

test("renders learn react link", () => {
  const { getByText } = render(<App config={DEFAULT_CONFIG} />);

  expect(getByText(/Connecting to Home Assistant.../i)).toBeInTheDocument();
});
