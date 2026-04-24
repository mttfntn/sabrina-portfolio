export default defineNuxtPlugin(() => {
  const { showPaper, showStamps, stampBlue, images, load, save } = useAppState()

  load()

  watch([showPaper, showStamps, stampBlue, images], save, { deep: true })

  watch(showPaper,  (val) => document.documentElement.classList.toggle('hide-paper',  !val))
  watch(showStamps, (val) => document.documentElement.classList.toggle('hide-stamps', !val))
  watch(stampBlue,  (val) => document.documentElement.classList.toggle('stamp-blue',   val))

  if (!showPaper.value)  document.documentElement.classList.add('hide-paper')
  if (!showStamps.value) document.documentElement.classList.add('hide-stamps')
  if (stampBlue.value)   document.documentElement.classList.add('stamp-blue')
})
