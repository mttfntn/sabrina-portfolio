<script setup lang="ts">
const props = defineProps<{ active: boolean }>()
const canvas = ref<HTMLCanvasElement | null>(null)

let gl:      WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let uActive: WebGLUniformLocation | null = null
let uTime:   WebGLUniformLocation | null = null
let ready    = false
let rafId    = 0
let t0       = 0
let ca       = 0

const EASE_IN  = 0.03
const EASE_OUT = 0.08

const CSS_W = 80
const CSS_H = 50
const W = CSS_W * 2
const H = CSS_H * 2

const VS = /* glsl */`
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FS = /* glsl */`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_active;
uniform float u_time;

float hash(vec2 p){
  p=fract(p*vec2(127.1,311.7));
  p+=dot(p,p.yx+19.19);
  return fract((p.x+p.y)*p.x);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

void main(){
  float t = u_time * 1.8;

  // two-frequency displacement — makes strokes ripple like liquid
  vec2 d;
  d.x = sin(v_uv.y * 9.0  + t * 1.1) * 0.55
      + sin(v_uv.y * 23.0 + t * 2.3) * 0.25
      + (noise(v_uv * 5.0 + t * 0.4) - 0.5) * 0.8;
  d.y = cos(v_uv.x * 11.0 + t * 0.9) * 0.50
      + cos(v_uv.x * 27.0 + t * 2.1) * 0.22
      + (noise(v_uv * 5.0 + vec2(3.7,1.3) + t * 0.5) - 0.5) * 0.8;

  float s = u_active * 0.028;          // max displacement ~2.8% of canvas
  vec2 uv = clamp(v_uv + d * s, 0.0, 1.0);

  gl_FragColor = texture2D(u_tex, uv);
}
`

function initGL() {
  const c = canvas.value; if (!c) return
  const g = c.getContext('webgl', { alpha: true, premultipliedAlpha: false })
  if (!g) return
  gl = g

  const vs = g.createShader(g.VERTEX_SHADER)!
  g.shaderSource(vs, VS); g.compileShader(vs)
  const fs = g.createShader(g.FRAGMENT_SHADER)!
  g.shaderSource(fs, FS); g.compileShader(fs)
  const p = g.createProgram()!
  g.attachShader(p, vs); g.attachShader(p, fs)
  g.linkProgram(p); program = p; g.useProgram(p)

  const buf = g.createBuffer()!
  g.bindBuffer(g.ARRAY_BUFFER, buf)
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), g.STATIC_DRAW)
  const loc = g.getAttribLocation(p, 'a_pos')
  g.enableVertexAttribArray(loc)
  g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0)

  uActive = g.getUniformLocation(p, 'u_active')
  uTime   = g.getUniformLocation(p, 'u_time')
  g.uniform1i(g.getUniformLocation(p, 'u_tex'), 0)

  g.viewport(0, 0, W, H)
  g.enable(g.BLEND)
  g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA)

  g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
  const img = new Image()
  img.onload = () => {
    const tex = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, tex)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
    ready = true
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
  }
  img.src = '/Chevron.svg'
  t0 = performance.now()
}

function loop() {
  ca += ((props.active ? 1 : 0) - ca) * (props.active ? EASE_IN : EASE_OUT)

  if (gl && program && ready) {
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(uActive, ca)
    gl.uniform1f(uTime,   (performance.now() - t0) / 1000)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const settled = Math.abs((props.active ? 1 : 0) - ca) < 0.002
  rafId = (!settled || props.active) ? requestAnimationFrame(loop) : 0
}

function kick() { if (!rafId) rafId = requestAnimationFrame(loop) }

watch(() => props.active, kick)
onMounted(() => { initGL(); kick() })
onBeforeUnmount(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<template>
  <canvas ref="canvas" :width="W" :height="H" class="ink-canvas" aria-hidden="true" />
</template>

<style scoped>
.ink-canvas {
  display: block;
  width: v-bind('CSS_W + "px"');
  height: v-bind('CSS_H + "px"');
  pointer-events: none;
}
</style>
