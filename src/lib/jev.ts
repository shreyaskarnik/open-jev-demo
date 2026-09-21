import { OpenJev } from "open-jev";
import type {
  LoadProgress,
  ModelAlias,
  OpenJevDevice,
  OpenJevDtype,
  OpenJevInfo,
} from "open-jev";

export interface LoadConfig {
  model: ModelAlias;
  dtype: OpenJevDtype | "auto";
  device: OpenJevDevice | "auto";
}

let instance: OpenJev | null = null;
let warmedUp = false;

export function getJev(): OpenJev | null {
  return instance;
}

export function hasWarmedUp(): boolean {
  return warmedUp;
}

export function markWarmedUp(): void {
  warmedUp = true;
}

export function isWebGpuAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

export async function inspectModel(config: LoadConfig): Promise<OpenJevInfo> {
  return OpenJev.info(config);
}

export async function loadJev(
  config: LoadConfig,
  onProgress: (progress: LoadProgress) => void
): Promise<OpenJev> {
  if (instance) {
    await instance.dispose();
    instance = null;
    warmedUp = false;
  }
  instance = await OpenJev.load({ ...config, onProgress });
  return instance;
}

export async function disposeJev(): Promise<void> {
  if (!instance) return;
  await instance.dispose();
  instance = null;
  warmedUp = false;
}
