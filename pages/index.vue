<script setup lang="ts">
const { images } = useAppState()
const { app: { baseURL } } = useRuntimeConfig()
const asset = (path: string) => baseURL.replace(/\/$/, '') + path

const widths = [52, 40, 62, 45, 56, 38, 58, 48, 55, 42]

const progress = ref(0)

const indicator = computed(() => {
  const p = progress.value
  const scale = p < 0.5 ? p * 2 : (1 - p) * 2
  const origin = p < 0.5 ? 'top' : 'bottom'
  return {
    scale: Math.max(0, Math.min(1, scale)),
    origin
  }
})

type LenisLike = {
  on: (e: string, cb: (d: { progress: number }) => void) => void
  off?: (e: string, cb: (d: { progress: number }) => void) => void
  scrollTo: (
    target: number | string | HTMLElement,
    opts?: { duration?: number; immediate?: boolean; force?: boolean; lock?: boolean }
  ) => void
}

onMounted(() => {
  const { $lenis } = useNuxtApp() as unknown as { $lenis: LenisLike }
  const handler = ({ progress: p }: { progress: number }) => {
    progress.value = p
  }
  $lenis?.on?.('scroll', handler)
  onBeforeUnmount(() => {
    $lenis?.off?.('scroll', handler)
  })
})

const hoveringTop = ref(false)

function scrollToTop() {
  const { $lenis } = useNuxtApp() as unknown as { $lenis: LenisLike }
  $lenis?.scrollTo?.(0, { duration: 1.5, force: true, lock: true })
}
</script>

<template>
  <main class="page">
    <header class="title-bar">
      <h1>
        <span>Sabrina Djelloul</span>
        <span class="diamond" aria-hidden="true" />
        <span>Studio Fe</span>
      </h1>
      <p class="subtitle">Sabrina Djelloul, Classe 91 Artist. Born in Algeria, based in Italy</p>
    </header>

    <div class="progress-rail" aria-hidden="true">
      <div
        class="progress-fill"
        :style="{
          transform: `scaleY(${indicator.scale})`,
          transformOrigin: indicator.origin
        }"
      />
    </div>

    <section class="stack">
      <div v-for="(img, i) in images" :key="img.src" class="slot">
        <div class="slot-inner" :style="{ maxWidth: widths[i % widths.length] + 'vw' }">
          <figure class="item">
            <img
              :src="asset(img.src)"
              :alt="`Photo ${i + 1}`"
              :style="{ transform: img.rotate ? `rotate(${img.rotate}deg)` : undefined }"
            />
          </figure>
          <audio
            v-if="img.audio"
            :src="asset(`/audios/${img.audio}`)"
            controls
            class="audio-player"
          />
        </div>
      </div>
    </section>

    <button
      type="button"
      class="to-top"
      :class="{ visible: progress > 0.05 }"
      aria-label="Scroll to top"
      @mouseenter="hoveringTop = true"
      @mouseleave="hoveringTop = false"
      @click="scrollToTop"
    >
      <InkDrip :active="hoveringTop" class="ink-layer" />
    </button>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/scss/palette' as p;

.page {
  position: relative;
  z-index: 3;
  min-height: 100vh;
  padding: 0 4vw 10vh;
}

.title-bar {
  padding: 1.25rem 0;
  background: transparent;
  text-align: center;

  h1 {
    margin: 0;
    font-family: 'BTC Find Seek', serif;
    font-size: 4.5rem;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: p.$text;
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
  }

  .subtitle {
    margin: 0.4rem 0 0;
    font-family: 'Atwriter', monospace;
    font-size: 1.05rem;
    font-weight: 400;
    color: p.$text;
    letter-spacing: 0.04em;
    opacity: 0.6;
  }

  .diamond {
    display: inline-block;
    width: 0.3em;
    height: 0.3em;
    background: p.$text;
    transform: rotate(45deg);
  }
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slot {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.item {
  margin: 0;
  display: flex;
  justify-content: center;
  width: 100%;

  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 65vh;
    object-fit: contain;
  }
}

.audio-player {
  width: 100%;
  height: 36px;
}

.progress-rail {
  position: fixed;
  top: 0;
  right: 0;
  width: 2px;
  height: 100vh;
  background: p.$line-track;
  z-index: 25;
  pointer-events: none;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background: p.$line;
  transform: scaleY(0);
}

.to-top {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 30;

  &.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .ink-layer {
    display: block;
    width: 80px;
    height: 50px;
  }

}

</style>
