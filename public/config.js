/* global TILE, ICON */

window.CONFIG = {
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
          type: TILE.SENSOR,
          entityId: "sensor.dryer_power",
          subtitle: "Garage",
        },
        {
          type: TILE.AUTOMATION,
          entityId: "automation.start_homekit",
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
          type: TILE.LIGHT,
          entityId: "light.master_bedroom_lights",
          title: "Master Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.guest_bedroom_lights",
          title: "Guest Bd",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.hallway_lights",
          title: "Hallway",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.office_lights",
          title: "Office",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.dining_room_lights",
          title: "Dining",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.kitchen_lights",
          title: "Kitchen",
        },
        {
          type: TILE.LIGHT,
          entityId: "light.entryway_lights",
          title: "Entryway",
        },
        {
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
        },
      ],
    },
  ],
};
