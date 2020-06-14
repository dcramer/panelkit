import React from "react";

export interface TileComponentConfig {
  entityId?: string;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  icon?: string;
  icons?: {
    [state: string]: string;
  };
  states?: {
    [state: string]: string;
  };
  [key: string]: any;
}

type _TileConfig<T> = {
  type: any;
  tiles: T[];
} & TileComponentConfig;

export interface TileConfig extends _TileConfig<TileConfig> {}

export interface ModalConfig {
  type: any;
  title?: string;
  [key: string]: any;
}

export interface EventConfig {
  entityId: string;
  state: string;
  modal: ModalConfig;
}

export interface Config {
  readonly url?: string;
  readonly sentryDsn?: string;
  readonly accessToken?: string;
  readonly events?: EventConfig[];
  readonly tiles: TileConfig[];
}

export type ConfigError = Error & { filename?: string };

export interface EntityAttributes {
  friendly_name?: string;
  [key: string]: any;
}

export interface Entity {
  entity_id: string;
  state: any;
  attributes: EntityAttributes;
  [key: string]: any;
}
