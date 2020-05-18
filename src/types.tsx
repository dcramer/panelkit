// import React from "react";

export interface TileComponentConfig {
  entityId?: string;
  type: any;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  icon?: string;
  icons?: {
    [state: string]: string;
  };
}

type _TileConfig<T> = {
  // TODO:
  type: any;
  tiles: T[];
} & TileComponentConfig;

export interface TileConfig extends _TileConfig<TileConfig> {}

export interface Config {
  readonly url?: string;
  readonly sentryDsn?: string;
  readonly accessToken?: string;
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
