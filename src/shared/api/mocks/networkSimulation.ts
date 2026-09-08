import { delay } from 'msw'
import { readAppSettings } from '@/shared/config/appSettings'

type NetworkResult =
  | { ok: true }
  | { ok: false; status: 500; message: string }

let mutationCounter = 0

/**
 * Latency + демо-сбой при включённой network simulation (Settings).
 * Каждый 2-й вызов → 500, чтобы сбой было легко воспроизвести.
 */
export async function applyNetworkSimulation(
  baseDelayMs = 220,
): Promise<NetworkResult> {
  const { networkSimulation } = readAppSettings()

  if (!networkSimulation) {
    await delay(baseDelayMs)
    return { ok: true }
  }

  mutationCounter += 1
  await delay(baseDelayMs + 700 + Math.floor(Math.random() * 500))

  if (mutationCounter % 2 === 0) {
    return {
      ok: false,
      status: 500,
      message: 'Simulated network failure',
    }
  }

  return { ok: true }
}

/** Для тестов. */
export function resetNetworkSimulationCounter() {
  mutationCounter = 0
}
