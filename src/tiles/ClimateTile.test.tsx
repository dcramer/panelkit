import { renderTile } from "../testutils";
import ClimateTile from "./ClimateTile";

test("renders", async () => {
  const { container, getByText } = renderTile(ClimateTile, {
    entity_id: "climate.test",
    state: "cool",
    attributes: {
      hvac_action: "cooling",
      current_temperature: 75,
      temperature: 70,
      unit_of_measurement: "F",
      friendly_name: "Test Climate",
    },
  });

  expect(getByText(/Test Climate/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
