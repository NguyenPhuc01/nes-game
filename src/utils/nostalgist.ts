// Nostalgist utilities

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NostalgistType = any

declare global {
  interface Window {
    Nostalgist: NostalgistType
  }
}

// Wait for Nostalgist to be ready
export async function waitForNostalgist(): Promise<NostalgistType> {
  while (typeof window.Nostalgist === 'undefined') {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return window.Nostalgist
}

// Launch game with Nostalgist
export async function launchGame(romSource: string | File): Promise<unknown> {
  const Nostalgist = await waitForNostalgist()

  // Try using launch method with config to disable menu
  if (typeof Nostalgist.launch === 'function') {
    try {
      const rom = typeof romSource === 'string' ? romSource : URL.createObjectURL(romSource)
      const instance = await Nostalgist.launch({
        core: 'fceumm',
        rom: rom,
        retroarchConfig: {
          menu_enable: false,
        },
      })
      return instance
    } catch (e) {
      console.log('Launch không hoạt động, dùng cách cũ:', e)
    }
  }

  // Fallback: use old method
  if (typeof romSource === 'string') {
    return await Nostalgist.nes({ rom: romSource })
  } else {
    return await Nostalgist.nes({ file: romSource })
  }
}

// Type guard for emulator instance
interface EmulatorInstance {
  destroy?: () => void
  exit?: () => void
}

function isEmulatorInstance(obj: unknown): obj is EmulatorInstance {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (typeof (obj as EmulatorInstance).destroy === 'function' ||
      typeof (obj as EmulatorInstance).exit === 'function')
  )
}

// Clean up emulator instance
export function cleanupEmulator(instance: unknown) {
  if (!instance) return

  try {
    if (isEmulatorInstance(instance)) {
      if (typeof instance.destroy === 'function') {
        instance.destroy()
      } else if (typeof instance.exit === 'function') {
        instance.exit()
      }
    }
  } catch (e) {
    console.log('Không thể destroy instance:', e)
  }

  // Remove emulator elements
  const emulatorElements = document.querySelectorAll(
    'canvas, iframe, #nostalgist-container',
  )
  emulatorElements.forEach((el) => {
    if (
      el.id &&
      (el.id.includes('nostalgist') || el.id === 'nostalgist-container')
    ) {
      el.remove()
    } else if (el.tagName === 'CANVAS' || el.tagName === 'IFRAME') {
      const parent = el.parentElement
      if (
        parent &&
        (parent.id === 'nostalgist-container' ||
          parent.classList.contains('nostalgist'))
      ) {
        parent.remove()
      } else {
        el.remove()
      }
    }
  })
}

