# panelkit

PanelKit is a tablet-focused UI built on top of Home Assistant.

It's heavily inspired by [tileboard](https://github.com/resoai/TileBoard), but built using a modern React stack.

## Config

Configuration currently lives in `public/config.js`. In an ideal world this would live in the root of the directory, and will utlimately be part of the `.gitignore` file.

There's a few things to note in config:

- `TILE` defines the type of tile to render - they're all hardcoded. Each `TILE` is actually a React component.
- Any tile which defines `tiles` becomes a group and the tile is ignored.
- `ICON` is currently a global reference to icons we're using in the example, but isn't the long term solution.

## Tiles

Every tile is a React component. A few common attributes are shared:

`title`

: The title (or name) to make visible for the tile. Inferred from the entity when available.

`subtitle`

: An optional subtitle to make visible for the tile.

`entityId`

: Required by some tiles, this will couple the state of the tile to the given entity.

`icons`

: Optional mapping of icons to react to state changes.

`icon`

: Optional icon component to override the default (and the fallback when no other icon is available).

### AlarmTile

A basic alarm control, showing the current state of the alarm and allowing disarm, armed_home, armed_away, and armed_night state changes.

`type`

: `TILE.ALARM`

`entityId`

: The `alarm_control_panel` entity ID.

### AutomationTile

A tile which to trigger an automation

`type`

: `TILE.AUTOMATION`

`entityId`

: The `automation` ID.

`action`

: The action to perform: `toggle` (default), `trigger`, `turn_on`, `turn_off`.

```json
{
  "volume": 0.5
}
```

### CameraTile

A still capture of a camera, refreshed every few seconds. A single tap goes into a full screen video, which will progressively load a streaming gif and video feed when possible. It also gives quick access to any other defined camera entities.

`type`

: `TILE.CAMERA`

`entityId`

: The `camera` entity ID.

`refreshInterval`

: The refresh interval for the camera still in milliseconds. Defaults to `3000` (3s).

### ClimateTile

**NOT FINISHED**

A tile designed for climate control.

`type`

: `TILE.CLIMATE`

`entityId`

: The `climate` entity ID.

### DoorControlTile

**NOT FINISHED**

A tile designed for a door control system, including a main camera feed as well as various actions. A single tap opens the full screen camera feed with door controls.

`type`

: `TILE.DOOR_CONTROL`

`camera`

: The `camera` entity ID.

### FanTile

**NOT FINISHED**

A simple fan switch. A single tap toggles the fan, a long press brings up a speed control.

`type`

: `TILE.FAN`

`entityId`

: The `fan` entity ID.

### LightTile

**NOT FINISHED**

A simple light switch. A single tap toggles the light, a long press brings up a brightness control.

`type`

: `TILE.LIGHT`

`entityId`

: The `light` entity ID.

### LockTile

A simple lock swtich. A single tap toggles the lock.

`type`

: `TILE.LOCK`

`entityId`

: The `lock` entity ID.

### SceneTile

A tile which can be clicked to activate a scene.

`type`

: `TILE.SCENE`

`entityId`

: The `scene` entity ID.

### SensorTile

A tile which displays the result of a sensor.

`type`

: `TILE.SENSOR`

`entityId`

: The `sensor` ID.

`format`

: A function to format the value.

```javascript
(state, attributes, unitOfMeasurement) => `${state} ${unitOfMeasurement}`;
```

### ScriptTile

A tile which can be clicked to activate a script.

`type`

: `TILE.SCRIPT`

`entityId`

: The `script` ID.

`data`

: The payload to send along with the script.

```json
{
  "volume": 0.5
}
```

### SwitchTile

A simple switch. A single tap toggles the switch.

`type`

: `TILE.SCENE`

`entityId`

: The `switch` entity ID.

## Development

PanelKit is built using [`create-react-app`](https://github.com/facebook/create-react-app), and you'll find your standard helper scripts available.

Install dependencies:

```shell
yarn install
```

Run the development server:

```shell
yarn start
```
