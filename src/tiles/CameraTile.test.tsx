import { renderTile } from "../testutils";
import CameraTile from "./CameraTile";

test("renders", async () => {
  const { container, getByText } = renderTile(CameraTile, {
    entity_id: "camera.test",
    state: "idle",
    attributes: {
      friendly_name: "Test Camera",
    },
  });

  expect(getByText(/Test Camera/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
