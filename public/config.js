/* global TILE, ICON */

window.CONFIG = {
  tiles: [
    {
      width: 2,
      tiles: [
        {
          type: TILE.DOOR_CONTROL,
          camera: "camera.front_door_exterior",
          name: "Front Door",
        },
        {
          type: TILE.ALARM,
          entityId: "alarm_control_panel.home",
        },
        {
          type: TILE.SWITCH,
          entityId: "switch.pi_hole",
          icon: ICON.PI_HOLE,
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
          name: "Turn Off Lights",
          icon: ICON.LIGHTBULB_GROUP_OFF,
        },
        {
          type: TILE.LIGHT,
          entityId: "light.master_bedroom_lights",
          name: "Master Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.guest_bedroom_lights",
          name: "Guest Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.hallway_lights",
          name: "Hallway",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.office_lights",
          name: "Office",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.dining_room_lights",
          name: "Dining",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.kitchen_lights",
          name: "Kitchen",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.entryway_lights",
          name: "Entryway",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.front_door_lights",
          name: "Front Door",
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
        },
      ],
    },
  ],
};
