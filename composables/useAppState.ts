export type ImageConfig = {
  src: string
  rotate: number
  audio?: string
}

export const AUDIOS = [
  'Registrazione (3).m4a',
  'Registrazione (4).m4a',
  'forestgum.mp3',
  'huwwai.mp3',
  'salopp.mp3',
]

const STORAGE_KEY = 'sabrina-portfolio-debug'

export const DEFAULT_IMAGES: ImageConfig[] = [
  { src: '/Images/39313116_1679125538876444_752957305141592064_n.webp', rotate: 0 },
  { src: '/Images/ChatGPT Image 24 apr 2026, 13_00_45.webp', rotate: 0 },
  { src: '/Images/ChatGPT Image 24 apr 2026, 13_02_59.webp', rotate: 0 },
  { src: '/Images/ChatGPT Image 24 apr 2026, 13_17_24.webp', rotate: 0 },
  { src: '/Images/IMAG0003 - Copia (2).webp', rotate: 180 },
  { src: '/Images/IMAG0022 - Copia.webp', rotate: 0 },
  { src: '/Images/IMAG0037 - Copia.webp', rotate: 0 },
  { src: '/Images/IMAG0045.webp', rotate: 0 },
  { src: '/Images/IMAG0046.webp', rotate: 0 },
  { src: '/Images/IMAG0065.webp', rotate: 0 },
  { src: '/Images/IMAG0087.webp', rotate: 90 },
  { src: '/Images/IMAG0089.webp', rotate: 0 },
  { src: '/Images/IMAG0098.webp', rotate: 0 },
  { src: '/Images/IMAG0103.webp', rotate: 0 },
  { src: '/Images/IMAG0107.webp', rotate: 90 },
  { src: '/Images/IMAG0123.webp', rotate: 0 },
  { src: '/Images/IMAG0125.webp', rotate: 0 },
  { src: '/Images/IMAG0126.webp', rotate: 0 },
  { src: '/Images/IMAG0127.webp', rotate: 0 },
  { src: '/Images/IMAG0128.webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (3).jpg (2).webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (4).webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (5).webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (6).webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (7).jpg.webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story (7).webp', rotate: 0 },
  { src: '/Images/Monochrome Neutral Minimal Simple Photo  Collage Your Story.webp', rotate: 0 },
  { src: '/Images/IMG-20251021-WA0019.jpg', rotate: 0 },
  { src: '/Images/IMG_5851.JPG', rotate: 0 },
  { src: '/Images/IMG_5853.JPG', rotate: 0 },
  { src: '/Images/IMG_5861.JPG', rotate: 0 },
  { src: '/Images/IMG_5864.JPG', rotate: 0 },
  { src: '/Images/IMG_5866.JPG', rotate: 0 },
  { src: '/Images/IMG_5868.JPG', rotate: 0 },
  { src: '/Images/IMG_5869.JPG', rotate: 0 },
  { src: '/Images/IMG_5870.JPG', rotate: 0 },
  { src: '/Images/IMG_5871.JPG', rotate: 0 },
  { src: '/Images/IMG_5872.JPG', rotate: 0 },
  { src: '/Images/IMG_5873.JPG', rotate: 0 },
  { src: '/Images/IMG_5874.JPG', rotate: 0 },
  { src: '/Images/IMG_5875.JPG', rotate: 0 },
  { src: '/Images/IMG_5876.JPG', rotate: 0 },
  { src: '/Images/IMG_5877.JPG', rotate: 0 },
  { src: '/Images/IMG_5878.JPG', rotate: 0 },
  { src: '/Images/IMG_5879.JPG', rotate: 0 },
  { src: '/Images/IMG_5880.JPG', rotate: 0 },
  { src: '/Images/IMG_5881.JPG', rotate: 0 },
  { src: '/Images/IMG_5882.JPG', rotate: 0 },
  { src: '/Images/IMG_5883.JPG', rotate: 0 },
  { src: '/Images/IMG_5884.JPG', rotate: 0 },
  { src: '/Images/IMG_5887.JPG', rotate: 0 },
  { src: '/Images/IMG_5889.JPG', rotate: 0 },
  { src: '/Images/IMG_5891.JPG', rotate: 0 },
  { src: '/Images/IMG_5892.JPG', rotate: 0 },
  { src: '/Images/IMG_5894.JPG', rotate: 0 },
  { src: '/Images/IMG_5901.JPG', rotate: 0 },
  { src: '/Images/IMG_5904.JPG', rotate: 0 },
  { src: '/Images/IMG_5910.JPG', rotate: 0 },
  { src: '/Images/IMG_5911.JPG', rotate: 0 },
  { src: '/Images/IMG_5914.JPG', rotate: 0 },
  { src: '/Images/IMG_5915.JPG', rotate: 0 },
  { src: '/Images/IMG_5920.JPG', rotate: 0 },
  { src: '/Images/Immagine WhatsApp 2025-08-24 ore 12.07.52_1a582d76.jpg', rotate: 0 },
]

export function useAppState() {
  const showPaper   = useState<boolean>('dbg-paper',      () => true)
  const showStamps  = useState<boolean>('dbg-stamps',     () => true)
  const stampBlue   = useState<boolean>('dbg-stamp-blue', () => false)
  const images      = useState<ImageConfig[]>('dbg-images', () => DEFAULT_IMAGES.map(i => ({ ...i })))

  function save() {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      showPaper:  showPaper.value,
      showStamps: showStamps.value,
      stampBlue:  stampBlue.value,
      images:     images.value,
    }))
  }

  function load() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s = JSON.parse(raw)
      if (typeof s.showPaper  === 'boolean') showPaper.value  = s.showPaper
      if (typeof s.showStamps === 'boolean') showStamps.value = s.showStamps
      if (typeof s.stampBlue  === 'boolean') stampBlue.value  = s.stampBlue
      if (Array.isArray(s.images) && s.images.length) images.value = s.images
    } catch {}
  }

  function reset() {
    images.value = DEFAULT_IMAGES.map(i => ({ ...i }))
  }

  return { showPaper, showStamps, stampBlue, images, save, load, reset }
}
