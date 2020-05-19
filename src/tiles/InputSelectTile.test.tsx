import { renderTile } from "../testutils";
import InputSelectTile from "./InputSelectTile";

test("renders", async () => {
  const { container, getByText } = renderTile(InputSelectTile, {
    entity_id: "input_select.test",
    state: "Afternoon",
    attributes: {
      friendly_name: "Test Input Select",
      editable: false,
      icon: "mdi:house",
      options: ["Morning", "Afternoon", "Evening", "Sleep"],
    },
  });

  expect(getByText(/Test Input Select/i)).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
