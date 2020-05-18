import { waitFor } from "@testing-library/react";

import { renderTile, simulateTouch } from "../testutils";
import LockTile from "./LockTile";

test("renders", async () => {
  const { container, getByText } = renderTile(LockTile, {
    entity_id: "lock.test",
    state: "unlocked",
    attributes: {
      friendly_name: "Test Lock",
    },
  });

  expect(getByText(/Test Lock/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test("unlocks on touch event", async () => {
  const { container, hass } = renderTile(LockTile, {
    entity_id: "lock.test",
    state: "locked",
    attributes: {
      friendly_name: "Test Lock",
    },
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "lock",
      "unlock",
      {
        entity_id: "lock.test",
      },
      {
        "lock.test": { state: "unlocked" },
      }
    );
  });
});

test("locks on touch event", async () => {
  const { container, hass } = renderTile(LockTile, {
    entity_id: "lock.test",
    state: "unlocked",
    attributes: {
      friendly_name: "Test Lock",
    },
  });

  simulateTouch(container);

  await waitFor(() => {
    expect(hass.callService).toHaveBeenCalledTimes(1);
    expect(hass.callService).toHaveBeenCalledWith(
      "lock",
      "lock",
      {
        entity_id: "lock.test",
      },
      {
        "lock.test": { state: "locked" },
      }
    );
  });
});
