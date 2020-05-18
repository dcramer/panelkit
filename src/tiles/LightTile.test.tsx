import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import LightTile from "./LightTile";

test("renders", async () => {
  const { container, getByText } = renderTile(LightTile, {
    entity_id: "light.test",
    state: "off",
    attributes: {
      friendly_name: "Test Light",
    },
  });

  expect(getByText(/Test Light/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("turns on on touch event", async () => {
  const { container, hass } = renderTile(LightTile, {
    entity_id: "light.test",
    state: "off",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "light",
      "turn_on",
      {
        entity_id: "light.test",
      },
      {
        "light.test": {
          state: "on",
        },
      }
    );
  });
});

test("turns off on touch event", async () => {
  const { container, hass } = renderTile(LightTile, {
    entity_id: "light.test",
    state: "on",
    attributes: {},
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "light",
      "turn_off",
      {
        entity_id: "light.test",
      },
      {
        "light.test": {
          state: "off",
        },
      }
    );
  });
});
