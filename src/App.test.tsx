import React from "react";
import { render } from "@testing-library/react";

import App from "./App";
import { DEFAULT_CONFIG } from "./testutils";

jest.mock("./hass");

test("renders connecting message", () => {
  const { getByText } = render(<App config={DEFAULT_CONFIG} />);

  expect(getByText(/Connecting to Home Assistant.../i)).toBeInTheDocument();
});

test("renders with config error", () => {
  const configError = new ErrorEvent("ConfigError", {
    filename: "./config.js",
    message: "this is a config error",
  });

  const { getByText } = render(
    <App config={DEFAULT_CONFIG} configError={configError} />
  );

  expect(getByText(/this is a config error/i)).toBeInTheDocument();
});
