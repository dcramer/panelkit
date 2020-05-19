/* global TILE, React */

window.CONFIG = {
  url: "http://localhost:8123",
  accessToken: "",
  tiles: [
    {
      width: 2,
      tiles: [
        {
          type: TILE.DOOR_CONTROL,
          camera: "camera.front_door_exterior",
          title: "Front Door",
        },
        {
          type: TILE.ALARM,
          entityId: "alarm_control_panel.home",
        },
        {
          type: TILE.SWITCH,
          entityId: "switch.pi_hole",
          icon: "pi-hole",
        },
        {
          type: TILE.FAN,
          entityId: "fan.master_bedroom",
        },
        {
          type: TILE.LOCK,
          entityId: "lock.garage_storage_deadbolt",
        },
        {
          type: TILE.SCRIPT,
          entityId: "script.sonos_say",
          data: {
            entity_id: "media_player.office",
            volume: 0.5,
            message: "Test",
            delay: "00:00:05",
          },
        },
        {
          type: TILE.INPUT_SELECT,
          entityId: "input_select.house_mode",
        },
        {
          type: TILE.SENSOR,
          entityId: "sensor.dryer_power",
          subtitle: "Garage",
        },
        {
          type: TILE.AUTOMATION,
          entityId: "automation.start_homekit",
        },
        {
          type: TILE.CLIMATE,
          entityId: "climate.master_bedroom",
          unit: "F",
        },
        {
          type: function (props) {
            var e = React.createElement;

            return e("div", null, "Test");
          },
        },
      ],
    },
    {
      width: 2,
      tiles: [
        {
          width: 2,
          type: TILE.SCENE,
          entityId: "scene.lights_off",
          title: "Turn Off Lights",
          icon: "lightbulb-group-off",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.master_bedroom_lights",
          title: "Master Bd",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.guest_bedroom_lights",
          title: "Guest Bd",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.hallway_lights",
          title: "Hallway",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.office_lights",
          title: "Office",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.dining_room_lights",
          title: "Dining",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.kitchen_lights",
          title: "Kitchen",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.entryway_lights",
          title: "Entryway",
        },
        {
          height: 0.5,
          type: TILE.LIGHT,
          entityId: "light.front_door_lights",
          title: "Front Door",
        },
      ],
    },
    {
      width: 4,
      tiles: [
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.front_door_exterior",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.garage_exterior",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.garage",
        },
        {
          width: 4,
          type: TILE.CAMERA,
          entityId: "camera.backyard",
          cameraList: [],
        },
      ],
    },
  ],
};
