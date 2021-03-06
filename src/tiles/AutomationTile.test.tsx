import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import AutomationTile from "./AutomationTile";

test("renders", async () => {
  const { container, getByText } = renderTile(AutomationTile, {
    entity_id: "automation.test",
    state: "off",
    attributes: {
      friendly_name: "Test Automation",
    },
  });

  expect(getByText(/Test Automation/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("activates on touch event", async () => {
  const { container, hass } = renderTile(AutomationTile, {
    entity_id: "automation.test",
    state: "off",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "automation",
      "toggle",
      {
        entity_id: "automation.test",
      },
      undefined
    );
  });
});
