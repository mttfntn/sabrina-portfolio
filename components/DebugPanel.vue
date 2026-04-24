<script setup lang="ts">
import { AUDIOS } from '~/composables/useAppState'
const { showPaper, showStamps, stampBlue, images, reset } = useAppState()

function setAudio(i: number, val: string) {
  const arr = images.value.slice()
  arr[i] = { ...arr[i], audio: val || undefined }
  images.value = arr
}

const audioUsage = computed(() => {
  const map: Record<string, number | null> = {}
  AUDIOS.forEach(a => { map[a] = null })
  images.value.forEach((img, i) => {
    if (img.audio) {
      const name = img.audio.split('/').pop()!
      map[name] = i + 1
    }
  })
  return map
})

const open = ref(false)

// drag-and-drop reorder
let dragFrom = -1
const dragOver = ref(-1)

function onDragStart(i: number) { dragFrom = i }
function onDragOver(i: number)  { dragOver.value = i }
function onDragEnd()            { dragOver.value = -1; dragFrom = -1 }
function onDrop(i: number) {
  if (dragFrom === i || dragFrom === -1) return
  const arr = images.value.slice()
  const [item] = arr.splice(dragFrom, 1)
  arr.splice(i, 0, item)
  images.value = arr
  dragOver.value = -1
  dragFrom = -1
}

function basename(src: string) {
  return src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? src
}
</script>

<template>
  <div class="debug-wrap" :class="{ open }">

    <button class="tab" @click="open = !open" title="Debug panel">
      ⚙
    </button>

    <div class="panel">
      <div class="panel-title">DEBUG</div>

      <!-- Display toggles -->
      <div class="section-label">DISPLAY</div>
      <label class="row">
        <input type="checkbox" v-model="showPaper" />
        paper.jpg
      </label>
      <label class="row">
        <input type="checkbox" v-model="showStamps" />
        Image.png
      </label>
      <label class="row" :class="{ disabled: !showStamps }">
        <input type="checkbox" v-model="stampBlue" :disabled="!showStamps" />
        Image.png — blue filter
      </label>

      <div class="divider" />

      <!-- Image order -->
      <div class="section-label">
        IMAGE ORDER
        <button class="reset-btn" @click="reset">reset</button>
      </div>

      <div class="img-list">
        <div
          v-for="(img, i) in images"
          :key="img.src"
          class="img-row"
          :class="{ 'drag-target': dragOver === i }"
          draggable="true"
          @dragstart="onDragStart(i)"
          @dragover.prevent="onDragOver(i)"
          @dragleave="dragOver = -1"
          @drop.prevent="onDrop(i)"
          @dragend="onDragEnd"
        >
          <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <img
            :src="img.src"
            :style="img.rotate ? `transform:rotate(${img.rotate}deg)` : ''"
            class="thumb"
            draggable="false"
          />
          <span class="name" :title="img.src">{{ basename(img.src) }}</span>
          <select
            class="audio-select"
            :value="img.audio ? img.audio.split('/').pop() : ''"
            @change="setAudio(i, ($event.target as HTMLSelectElement).value)"
            title="Assign audio"
          >
            <option value="">—</option>
            <option v-for="a in AUDIOS" :key="a" :value="a">{{ a }}</option>
          </select>
          <span class="drag-handle">⠿</span>
        </div>
      </div>

      <div class="divider" />

      <!-- Audio overview -->
      <div class="section-label">AUDIO FILES</div>
      <div class="audio-list">
        <div v-for="a in AUDIOS" :key="a" class="audio-row">
          <span class="audio-name" :title="a">{{ a }}</span>
          <span class="audio-slot" :class="{ assigned: audioUsage[a] !== null }">
            {{ audioUsage[a] !== null ? `→ #${audioUsage[a]}` : 'unassigned' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: stretch;
  pointer-events: none;
}

.tab {
  pointer-events: all;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 28px;
  height: 40px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.25s;
}

.open .tab {
  left: 240px;
}

.panel {
  pointer-events: all;
  width: 240px;
  height: 100%;
  background: rgba(10,10,10,0.92);
  color: #e0e0e0;
  font-family: monospace;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  backdrop-filter: blur(6px);
}

.open .panel {
  transform: translateX(0);
}

.panel-title {
  padding: 10px 12px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #888;
  border-bottom: 1px solid #2a2a2a;
}

.section-label {
  padding: 8px 12px 4px;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  cursor: pointer;
  user-select: none;

  &:hover { background: rgba(255,255,255,0.04); }

  input[type='checkbox'] {
    accent-color: #ccc;
    cursor: pointer;
  }
}

.row.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.divider {
  height: 1px;
  background: #2a2a2a;
  margin: 6px 0;
}

.reset-btn {
  background: #2a2a2a;
  color: #999;
  border: none;
  border-radius: 3px;
  padding: 1px 6px;
  font-family: monospace;
  font-size: 9px;
  cursor: pointer;

  &:hover { background: #3a3a3a; color: #ccc; }
}

.img-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

.img-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 12px;
  cursor: grab;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  user-select: none;

  &:hover { background: rgba(255,255,255,0.04); }
  &.drag-target {
    border-top: 1px solid #4af;
  }
  &:active { cursor: grabbing; }
}

.idx {
  color: #555;
  min-width: 18px;
  font-size: 10px;
}

.thumb {
  width: 44px;
  height: 28px;
  object-fit: cover;
  flex-shrink: 0;
  opacity: 0.8;
}

.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #aaa;
  font-size: 10px;
}

.drag-handle {
  color: #444;
  font-size: 14px;
  flex-shrink: 0;
}

.audio-select {
  background: #1a1a1a;
  color: #888;
  border: 1px solid #333;
  border-radius: 3px;
  font-family: monospace;
  font-size: 9px;
  padding: 1px 2px;
  max-width: 72px;
  cursor: pointer;
  flex-shrink: 0;

  &:focus { outline: none; border-color: #4af; }
}

.audio-list {
  padding: 0 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.audio-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 10px;
}

.audio-name {
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.audio-slot {
  color: #444;
  white-space: nowrap;
  font-size: 9px;

  &.assigned { color: #4af; }
}
</style>
