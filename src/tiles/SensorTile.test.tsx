import { renderTile } from "../testutils";
import SensorTile from "./SensorTile";

test("renders", async () => {
  const { container, getByText } = renderTile(SensorTile, {
    entity_id: "sensor.test",
    state: "73",
    attributes: {
      unit_of_measurement: "F",
      friendly_name: "Test Sensor",
    },
  });

  expect(getByText(/Test Sensor/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
