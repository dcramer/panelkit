import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import AutomationTile from "./AlarmTile";

test("renders", async () => {
  const { container, getByText, hass } = renderTile(AutomationTile, {
    entity_id: "automation.test",
    state: "off",
    attributes: {
      friendly_name: "Test Automation",
    },
  });

  expect(getByText(/Test Automation/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();

  // TODO(dcramer): cant figure out why this isnt working yet
  //   simulateTouch(container);

  //   await waitFor(() => {
  //     expect(hass.callService).toHaveBeenCalledTimes(1);
  //     expect(hass.callService).toHaveBeenCalledWith("automation", "test", {
  //       entity_id: "automation.test",
  //       action: "toggle",
  //     });
  //   });
});
