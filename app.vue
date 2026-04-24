<script setup lang="ts">
type Stamp = {
  top: number
  left: number
  w: number
  rotate: 0 | 180
  opacity: number
}

const stamps: Stamp[] = [
  { top: 2,  left: 74, w: 58, rotate: 180, opacity: 0.3},
  { top: 5,  left: 22, w: 66, rotate: 0,   opacity: 0.3},
  { top: 9,  left: 54, w: 50, rotate: 180, opacity: 0.3},
  { top: 13, left: 8,  w: 62, rotate: 0,   opacity: 0.3},
  { top: 17, left: 88, w: 56, rotate: 180, opacity: 0.3},
  { top: 21, left: 38, w: 60, rotate: 0,   opacity: 0.3},
  { top: 25, left: 68, w: 54, rotate: 180, opacity: 0.3},
  { top: 29, left: 12, w: 64, rotate: 0,   opacity: 0.3},
  { top: 33, left: 82, w: 52, rotate: 180, opacity: 0.3},
  { top: 37, left: 30, w: 68, rotate: 0,   opacity: 0.3},
  { top: 41, left: 6,  w: 50, rotate: 180, opacity: 0.3},
  { top: 45, left: 60, w: 66, rotate: 0,   opacity: 0.3},
  { top: 49, left: 86, w: 58, rotate: 180, opacity: 0.3},
  { top: 53, left: 18, w: 62, rotate: 0,   opacity: 0.3},
  { top: 57, left: 48, w: 54, rotate: 180, opacity: 0.3},
  { top: 61, left: 78, w: 60, rotate: 0,   opacity: 0.3},
  { top: 65, left: 10, w: 56, rotate: 180, opacity: 0.3},
  { top: 69, left: 44, w: 64, rotate: 0,   opacity: 0.3},
  { top: 73, left: 84, w: 52, rotate: 180, opacity: 0.3},
  { top: 77, left: 24, w: 68, rotate: 0,   opacity: 0.3},
  { top: 80, left: 58, w: 58, rotate: 180, opacity: 0.3},
  { top: 83, left: 4,  w: 62, rotate: 0,   opacity: 0.3},
  { top: 87, left: 72, w: 54, rotate: 180, opacity: 0.3},
  { top: 90, left: 34, w: 66, rotate: 0,   opacity: 0.3},
  { top: 93, left: 80, w: 50, rotate: 180, opacity: 0.3},
  { top: 96, left: 14, w: 60, rotate: 0,   opacity: 0.3},
  { top: 98, left: 52, w: 56, rotate: 180, opacity: 0.3}
]

const { showStamps, stampBlue } = useAppState()
</script>

<template>
  <div v-show="showStamps" class="stamps" :class="{ 'stamps--blue': stampBlue }" aria-hidden="true">
    <div
      v-for="(s, i) in stamps"
      :key="i"
      class="stamp"
      :style="{
        top: s.top + '%',
        left: s.left + '%',
        width: s.w + 'vw',
        transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
        opacity: s.opacity
      }"
    />
  </div>

  <NuxtPage />
  <DebugPanel />
</template>

<style>
html.hide-paper body {
  background: #ffffff !important;
}
html.hide-paper body::before,
html.hide-paper body::after {
  display: none !important;
}
.stamps--blue .stamp {
  filter: sepia(1) saturate(4) hue-rotate(190deg);
}
</style>
