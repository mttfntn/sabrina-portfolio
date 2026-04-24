export default defineNuxtPlugin(() => {
  const { showPaper, showStamps, images, load, save } = useAppState()

  load()

  watch([showPaper, showStamps, images], save, { deep: true })

  watch(showPaper,  (val) => document.documentElement.classList.toggle('hide-paper',  !val))
  watch(showStamps, (val) => document.documentElement.classList.toggle('hide-stamps', !val))

  // apply immediately after load
  if (!showPaper.value)  document.documentElement.classList.add('hide-paper')
  if (!showStamps.value) document.documentElement.classList.add('hide-stamps')
})
