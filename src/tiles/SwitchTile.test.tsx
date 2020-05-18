import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import SwitchTile from "./SwitchTile";

test("renders", async () => {
  const { container, getByText } = renderTile(SwitchTile, {
    entity_id: "switch.test",
    state: "off",
    attributes: {
      friendly_name: "Test Switch",
    },
  });

  expect(getByText(/Test Switch/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("turns on on touch event", async () => {
  const { container, hass } = renderTile(SwitchTile, {
    entity_id: "switch.test",
    state: "off",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "switch",
      "turn_on",
      {
        entity_id: "switch.test",
      },
      {
        "switch.test": { state: "on" },
      }
    );
  });
});

test("turns off on touch event", async () => {
  const { container, hass } = renderTile(SwitchTile, {
    entity_id: "switch.test",
    state: "on",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "switch",
      "turn_off",
      {
        entity_id: "switch.test",
      },
      {
        "switch.test": { state: "off" },
      }
    );
  });
});
