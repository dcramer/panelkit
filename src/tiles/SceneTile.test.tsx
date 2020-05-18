import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import SceneTile from "./SceneTile";

test("renders", async () => {
  const { container, getByText } = renderTile(SceneTile, {
    entity_id: "scene.test",
    state: "off",
    attributes: {
      friendly_name: "Test Scene",
    },
  });

  expect(getByText(/Test Scene/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("activates on touch event", async () => {
  const { container, hass } = renderTile(SceneTile, {
    entity_id: "scene.test",
    state: "off",
    attributes: {
      friendly_name: "Test Scene",
    },
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "scene",
      "turn_on",
      {
        entity_id: "scene.test",
      },
      undefined
    );
  });
});
