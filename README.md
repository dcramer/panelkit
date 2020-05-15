# panelkit

PanelKit is a tablet-focused UI built on top of Home Assistant.

It's heavily inspired by [tileboard](https://github.com/resoai/TileBoard), but built using a modern React stack.

## Roadmap

Some scribbles about what (hopefully) still needs done.

- Grid system needs work. It'd ideally automatically layout with a fixed width grid, and variable unit-sized tiles. Tiles can live in groups, which then cascades the grid. e.g. traditional CSS grid systems, but with a bit more control.

- Implement mobile-specific styles and metadata. There's nothing responsive yet, and particularly the grid is going to need at least three views: desktop/altop friendly, landscape tablet, and portrait phone.

- Needs thorough testing on mobile devices and tablets. Haven't done this at all yet, though some of the behavior is already implemented (for e.g. touch controls).

- Revisit a number of design elements (like the Slider) to optimize for touch devices and smaller form factors. Some controls are likely going to be too small to tap easily, or need to respond faster to human interactions. A bunch of work is already done to make it _feel_ fast, but it's not complete yet.

- Implement missing Tile features. Notes are generally inline in the Tile list below. To some degree I'm modeling feature parity with Tileboard, but there may be things that simply aren't worth porting (such as the device tracker) unless someone else opts to do it.

- Determine how this actually ships to "prod". It's easy to develop against right now, but is the `config.js` pattern going to work well enough when we've compiled the application? The ideal scenario is that someone can just pull down a pre-built `index.html`, put that alongside a `config.js` and serve that via home assistant or their browser of choice.

- Consider migrating to `home-assistant-js-websocket`. I didn't notice it when I started development, and its got quite a lot of functionality/complexity that migration may or may not be worth it.

- Add validation for config so that it doesn't throw cryptic javascript errors when e.g. you pass an invalid `type`.

## Config

Configuration is read from `./config.js` - relative to your `index.html` file.

The `config.js` file must export `CONFIG` with the following baseline values:

```javascript
window.CONFIG = {
  url: "http://localhost:8123",
  accessToken: "your.long-lived.access-token",
  tiles: [],
};
```

There's a few things to note in config:

- It's just JavaScript. Which means it has to be valid, but you can execute whatever you need.
- `TILE` defines the type of tile to render - they're all hardcoded. Each `TILE` is actually a React component.
- Any tile which defines `tiles` becomes a group and the tile component itself is ignored.

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

A still capture of a camera, refreshed every few seconds. A single press goes into a full screen video, which will progressively load a streaming gif and video feed when possible. It also gives quick access to any other defined camera entities.

`type`

: `TILE.CAMERA`

`entityId`

: The `camera` entity ID.

`refreshInterval`

: The refresh interval for the camera still in milliseconds. Defaults to `3000` (3s).

### ClimateTile

**NOT FINISHED**

A tile designed for climate control. A single press opens climate configuration.

`type`

: `TILE.CLIMATE`

`entityId`

: The `climate` entity ID.

TODO:

- Add modal for advanced climate controls

### DoorControlTile

**NOT FINISHED**

A tile designed for a door control system, including a main camera feed as well as various actions. A single press opens the full screen camera feed with door controls.

`type`

: `TILE.DOOR_CONTROL`

`camera`

: The `camera` entity ID.

TODO:

- Add controls within panel.
- Add event-based prompt to load DoorControlModal.

### FanTile

**NOT FINISHED**

A simple fan switch. A single press toggles the fan, a long press brings up a speed control.

`type`

: `TILE.FAN`

`entityId`

: The `fan` entity ID.

TODO:

- Add speed control

### LightTile

A simple light switch. A single press toggles the light, a long press brings up a brightness control.

`type`

: `TILE.LIGHT`

`entityId`

: The `light` entity ID.

TODO:

- Add RGB controls

### LockTile

A simple lock swtich. A single press toggles the lock.

`type`

: `TILE.LOCK`

`entityId`

: The `lock` entity ID.

### SceneTile

A tile which can be pressed to activate a scene.

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

A tile which can be pressed to activate a script.

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

A simple switch. A single press toggles the switch.

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

Create `.env` to hold your credentials:

```bash
# .env
# see `.env.example` for more information

REACT_APP_HASS_URL=http://localhost:8123
REACT_APP_HASS_ACCESS_TOKEN=
```

In development we're currently reading config from `public/config.js`, which is version controlled and not ideal.

You may also want to disable context menu when testing against mobile profiles. This can be done in your Chrome console:

```javascript
window.oncontextmenu = function () {
  return false;
};
```

#### Chrome Profiles

Galaxy Tab A 10.5"

: 1280px x 800px, 80em, 1.5 pixel ratio
: Mozilla/5.0 (Linux; Android 9; SM-T590) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.117 Safari/537.36
