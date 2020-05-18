import { renderTile } from "../testutils";
import DoorControlTile from "./DoorControlTile";

test("renders", async () => {
  const { container, getByText } = renderTile(
    DoorControlTile,
    {
      entity_id: "camera.test",
      state: "idle",
      attributes: {},
    },
    {
      entityId: undefined,
      camera: "camera.test",
      title: "Test Door Control",
    }
  );

  expect(getByText(/Test Door Control/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
