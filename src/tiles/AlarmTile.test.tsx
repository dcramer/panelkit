import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import AlarmTile from "./AlarmTile";

test("renders", async () => {
  const { container, getByText } = renderTile(AlarmTile, {
    entity_id: "alarm_control_panel.test",
    state: "disarmed",
    attributes: {
      friendly_name: "Test Alarm",
    },
  });

  expect(getByText(/Test Alarm/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("disarms on touch event", async () => {
  const { container, hass } = renderTile(AlarmTile, {
    entity_id: "alarm_control_panel.test",
    state: "armed_home",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "alarm_control_panel",
      "alarm_disarm",
      {
        entity_id: "alarm_control_panel.test",
      },
      {
        "alarm_control_panel.test": { state: "disarmed" },
      }
    );
  });
});
