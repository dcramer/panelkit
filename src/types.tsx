// import React from "react";

type _TileConfig<T> = {
  entityId: string;
  // TODO:
  type: any;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  icon?: string;
  icons?: Map<string, string>;
  tiles: T[];
};

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
