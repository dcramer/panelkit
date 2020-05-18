import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import ScriptTile from "./ScriptTile";

test("renders", async () => {
  const { container, getByText } = renderTile(ScriptTile, {
    entity_id: "script.test",
    state: "off",
    attributes: {},
  });

  expect(getByText(/script.test/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("activates on touch event", async () => {
  const { container, hass } = renderTile(ScriptTile, {
    entity_id: "script.test",
    state: "off",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "script",
      "test",
      undefined,
      undefined
    );
  });
});
