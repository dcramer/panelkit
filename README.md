# panelkit

PanelKit is a tablet-focused UI built on top of Home Assistant.

It's heavily inspired by [tileboard](https://github.com/resoai/TileBoard), but built using a modern React stack.

## Config

Configuration currently lives in `public/config.js`. In an ideal world this would live in the root of the directory, and will utlimately be part of the `.gitignore` file.

There's a few things to note in config:

- `TILE` defines the type of tile to render - they're all hardcoded. Each `TILE` is actually a React component.
- Any tile which defines `tiles` becomes a group and the tile widget is ignored.
- `ICON` is currently a global reference to icons we're using in the example, but isn't the long term solution.

## Tiles

Every tile is a React component. A few common attributes are shared:

`name`

: The name (or label) to make visible for the tile. Inferred from the entity when available.

`entityId`

: Required by some tiles, this will couple the state of the tile to the given entity.

`icon`

: Optional icon component to override the default.

### AlarmTile

**NOT FINISHED**

A basic alarm control, showing the current state of the alarm and allowing disarm, armed_home, and armed_away state changes.

`type`

: `TILE.ALARM`

`entityId`

: The `alarm_control_panel` entity ID.

### CameraTile

A still capture of a camera, refreshed every few seconds. A single tap goes into a full screen video (progressive from gif -> video as loadable), and gives access to other defined cameras.

`type`

: `TILE.CAMERA`

`entityId`

: The `camera` entity ID.

`refreshInterval`

: The refresh interval for the camera still in milliseconds. Defaults to `3000` (3s).

### DoorControlTile

**NOT FINISHED**

A tile designed for a door control system, including a main camera feed as well as various actions. A single tap opens the full screen camera feed with door controls.

`type`

: `TILE.DOOR_CONTROL`

`camera`

: The `camera` entity ID.

### LightTile

**NOT FINISHED**

A simple light switch. A single tap toggles the light switch, a long press brings up a brightness slider.

`type`

: `TILE.LIGHT`

`entityId`

: The `light` entity ID.

### SceneTile

A tile which can be clicked to activate a scene.

`type`

: `TILE.SCENE`

`entityId`

: The `scene` entity ID.

### SwitchTile

A simple switch. A single tap toggles the switch.

`type`

: `TILE.SCENE`

`entityId`

: The `switch` entity ID.
