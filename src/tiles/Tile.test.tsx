import { renderTile } from "../testutils";
import Tile from "./Tile";

describe("renderStatus", () => {
  test("uses states when available", async () => {
    const { container, getByText } = renderTile(
      Tile,
      {
        entity_id: "alarm_control_panel.test",
        state: "disarmed",
        attributes: {
          friendly_name: "Test Alarm",
        },
      },
      {
        states: {
          disarmed: "Really Disarmed",
        },
      }
    );

    expect(getByText(/Really Disarmed/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("title cases state by default", async () => {
    const { container, getByText } = renderTile(
      Tile,
      {
        entity_id: "alarm_control_panel.test",
        state: "not_armed",
        attributes: {
          friendly_name: "Test Alarm",
        },
      },
      {
        states: {
          disarmed: "Really Disarmed",
        },
      }
    );

    expect(getByText(/Not armed/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
