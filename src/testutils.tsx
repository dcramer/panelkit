import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Entity } from "./types";
import HomeAssistant, { SuggestedChanges } from "./hass";

export const URL = "http://localhost:8123";

export const ACCESS_TOKEN = "example.access.token";

export const DEFAULT_CONFIG = {
  url: URL,
  accessToken: ACCESS_TOKEN,
  tiles: [],
};

export const simulateTouch = (container: any) => {
  userEvent.click(container);
};

export const getTileProps = (entity: Entity) => {
  const hass = new HomeAssistant(DEFAULT_CONFIG);

  hass.callService = jest
    .fn()
    .mockImplementation(
      (
        domain: string,
        service: string,
        serviceData: any,
        suggestedChanges: SuggestedChanges | null = null
      ) => {
        return Promise.resolve();
      }
    );
  hass.sendMessage = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });

  hass.populateEntityCache([entity]);

  return {
    entityId: entity.entity_id,
    hass,
    cameraList: [],
  };
};

export const renderTile = (
  Component: any,
  entity: Entity,
  props: { [key: string]: any } = {}
) => {
  const tileProps = {
    ...getTileProps(entity),
    ...props,
  };

  const result = render(<Component {...tileProps} />);

  return {
    ...result,
    hass: tileProps.hass,
    container: result.container.firstChild,
  };
};
