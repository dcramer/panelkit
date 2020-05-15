# panelkit

PanelKit is a tablet-focused UI built on top of Home Assistant.

It's heavily inspired by [tileboard](https://github.com/resoai/TileBoard), but built using a modern React stack.

## Roadmap

Some scribbles about what (hopefully) still needs done.

- Grid system needs work. It'd ideally automatically layout with a fixed width grid, and variable unit-sized tiles. Tiles can live in groups, which then cascades the grid. e.g. traditional CSS grid systems, but with a bit more control.

- Implement mobile-specific styles and metadata. A bit of work is done here, but we may still want to rethink the grid. Also need to finish up support for a standard portrait display (e.g. iPhone).

- Needs thorough testing on mobile devices and tablets. Haven't done this at all yet, though some of the behavior is already implemented (for e.g. touch controls).

- Revisit a number of design elements (like the Slider) to optimize for touch devices and smaller form factors. Some controls are likely going to be too small to tap easily, or need to respond faster to human interactions. A bunch of work is already done to make it _feel_ fast, but it's not complete yet.

- Implement missing Tile features. Notes are generally inline in the Tile list below. To some degree I'm modeling feature parity with Tileboard, but there may be things that simply aren't worth porting (such as the device tracker) unless someone else opts to do it.

- Determine how this actually ships to "prod". It's easy to develop against right now, but is the `config.js` pattern going to work well enough when we've compiled the application? The ideal scenario is that someone can just pull down a pre-built `index.html`, put that alongside a `config.js` and serve that via home assistant or their browser of choice.

- Consider migrating to `home-assistant-js-websocket`. I didn't notice it when I started development, and its got quite a lot of functionality/complexity that migration may or may not be worth it.

- Add validation for config so that it doesn't throw cryptic javascript errors when e.g. you pass an invalid `type`.

- Touch controls are not yet well implemented. Certain behaviors are incorrect (scrolling -> creates a click-style touch event when it shouldn't).

- Websockets are having some problems when the URL is pinned to home screen on iOS.

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

<dl>
  <dt><code>title</code></dt>
  <dd>The title (or name) to make visible for the tile. Inferred from the entity when available.</dd>

  <dt><code>subtitle</code></dt>
  <dd>An optional subtitle to make visible for the tile.</dd>

  <dt><code>entityId</code></dt>
  <dd>Required by some tiles, this will couple the state of the tile to the given entity.</dd>

  <dt><code>icons</code></dt>
  <dd>Optional mapping of icons to react to state changes.</dd>

  <dt><code>icon</code></dt>
  <dd>Optional icon component to override the default (and the fallback when no other icon is available).</dd>
</dl>

### AlarmTile

A basic alarm control, showing the current state of the alarm and allowing disarm, armed_home, armed_away, and armed_night state changes.

```javascript
{
  type: TILE.ALARM,
  // The `alarm_control_panel` entity ID.
  entityId: "",
}
```

### AutomationTile

A tile which to trigger an automation

```javascript
{
  type: TILE.AUTOMATION,
  // The `automation` entity ID.
  entityId: "",
  // (Optional) The action to perform: toggle (default), trigger, turn_on, and turn_off
  action: "toggle"
}
```

### CameraTile

A still capture of a camera, refreshed every few seconds. A single press goes into a full screen video, which will progressively load a streaming gif and video feed when possible. It also gives quick access to any other defined camera entities.

```javascript
{
  type: TILE.CAMERA,
  // The `camera` entity ID.
  entityId: "",
  // (Optional) The refresh interval for the camera still (in milliseconds). Defaults to `3000` (3s).
  refreshInterval: 3000,
}
```

### ClimateTile

**NOT FINISHED**

A tile designed for climate control. A single press opens climate configuration.

```javascript
{
  type: TILE.CLIMATE,
  // The `climate` entity ID.
  entityId: "",
}
```

TODO:

- Add modal for advanced climate controls

### DoorControlTile

**NOT FINISHED**

A tile designed for a door control system, including a main camera feed as well as various actions. A single press opens the full screen camera feed with door controls.

```javascript
{
  type: TILE.DOOR_CONTROL,
  // The `camera` entity ID.
  camerra: "",
}
```

TODO:

- Add controls within panel.
- Add event-based prompt to load DoorControlModal.

### FanTile

A simple fan switch. A single press toggles the fan, a long press brings up a speed control.

```javascript
{
  type: TILE.FAN,
  // The `fan` entity ID.
  entityId: "",
}
```

TODO:

- Add speed control

### LightTile

A simple light switch. A single press toggles the light, a long press brings up a brightness control.

```javascript
{
  type: TILE.LIGHT,
  // The `light` entity ID.
  entityId: "",
}
```

TODO:

- Add RGB controls

### LockTile

A simple lock swtich. A single press toggles the lock.

```javascript
{
  type: TILE.LOCK,
  // The `lock` entity ID.
  entityId: "",
}
```

### SceneTile

A tile which can be pressed to activate a scene.

```javascript
{
  type: TILE.SCENE,
  // The `scene` entity ID.
  entityId: "",
}
```

### SensorTile

A tile which displays the result of a sensor.

```javascript
{
  type: TILE.SENSOR,
  // The `sensor` entity ID.
  entityId: "",
  // (Optional) A function to format the value.
  format: function(state, attributes, unitOfMeasurement) { return state + ' ' + unitOfMeasurement }
}
```

### ScriptTile

A tile which can be pressed to activate a script.

```javascript
{
  type: TILE.SCRIPT,
  // The `script` entity ID.
  entityId: "",
  // (Optional) The payload to send along with the script.
  data: {
    // ...
  }
}
```

### SwitchTile

A simple switch. A single press toggles the switch.

```javascript
{
  type: TILE.SWITCH,
  // The `switch` entity ID.
  entityId: "",
}
```

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

### Chrome Profiles

You can use [mydevice.info](https://mydevice.info) to determine device specs, which is useful for mobile device testing.

<dl>
  <dt>Galaxy Tab A 10.5"</dt>
  <dd>1280px x 800px, 80em, 1.5 pixel ratio</dd>
</dl>
