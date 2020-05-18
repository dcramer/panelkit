import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import FanTile from "./FanTile";

test("renders", async () => {
  const { container, getByText } = renderTile(FanTile, {
    entity_id: "fan.test",
    state: "off",
    attributes: {
      friendly_name: "Test Fan",
    },
  });

  expect(getByText(/Test Fan/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("turns on on touch event", async () => {
  const { container, hass } = renderTile(FanTile, {
    entity_id: "fan.test",
    state: "off",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "fan",
      "turn_on",
      {
        entity_id: "fan.test",
      },
      {
        "fan.test": {
          state: "on",
        },
      }
    );
  });
});

test("turns off on touch event", async () => {
  const { container, hass } = renderTile(FanTile, {
    entity_id: "fan.test",
    state: "on",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "fan",
      "turn_off",
      {
        entity_id: "fan.test",
      },
      {
        "fan.test": {
          state: "off",
        },
      }
    );
  });
});
