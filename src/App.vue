<script setup>
import { ref, computed } from 'vue'

import AButton from './components/AButton.vue'
import Spinner from './components/Spinner.vue'
import Modal from './components/Modal.vue'

import ScrapeService from './services/ScrapeService'
import AnkiService from './services/AnkiService'

const scrapeLoading = ref(false)
const ankiLoading = ref(false)

const mode = ref('translate')

const enText = ref('')
const browser = ref('0')
const note = ref('')
const translation = ref(null)

const quranUrl = ref('')
const quranData = ref(null)

const modalShowing = ref(false)
const modalTitle = ref('')
const modalDescription = ref('')

// Format scraped data
const formattedTranslation = computed(() => {
  if (translation.value == null) return null

  const english = translation.value.enText
  const phonetic = translation.value.enPhon
  
  let transHtmlString = ''
  let defHtmlString = ''

  // Format translations
  translation.value.transParts.forEach((part, partIndex) => {
    transHtmlString += `<small><font color="#2563EB"><b>${part.part}</b></font></small><br>`
    
    part.translations.forEach((trans, transIndex) => {
      transHtmlString += trans

      if (transIndex < part.translations.length - 1) {
        transHtmlString += ', '
      } else if (partIndex < translation.value.transParts.length - 1) {
        transHtmlString += '<br>'
      }
    })
  })

  // Format definitions
  translation.value.defParts.forEach((part, partIndex) => {
    defHtmlString += `<small><font color="#2563EB"><b>${part.part}</b></font></small><br>`
    
    part.definitions.forEach((def, defIndex) => {
      defHtmlString += `<font color="#16A34A">${def.no}</font>&nbsp;`
      defHtmlString += def.text

      if (def.example != '') {
        defHtmlString += `<br><small><font color="#4B5563">"${def.example}"</font></small>`
      }

      if (defIndex < part.definitions.length - 1
          || partIndex < translation.value.defParts.length - 1) {
        defHtmlString += '<br>'
      }
    })
  })

  return { english, phonetic, transHtmlString, defHtmlString }
})

// Preview formatted translation
const preview = computed(() => {
  if (formattedTranslation.value == null) return ''

  const {
    english,
    phonetic,
    transHtmlString,
    defHtmlString
  } = formattedTranslation.value
  
  return `${english}<br>${phonetic}<hr class="my-2">${transHtmlString}<hr class="my-2">${defHtmlString}`
})

const quranPreview = computed(() => {
  if (quranData.value == null) return ''

  const { word, root, formIndex, formText, exampleText, exampleMeaning } = quranData.value

  return `${word}<br>${root}<br>${formIndex}<br>${formText}<br>${exampleText}<br>${exampleMeaning}`
})

const getTabClasses = active => {
  if (active) {
    return 'bg-blue-100 font-semibold text-blue-600'
  }

  return 'hover:bg-gray-50 text-gray-900 hover:text-gray-600'
}

// Show dialog after calling API
const showModal = (title, description) => {
  modalShowing.value = true
  modalTitle.value = title
  modalDescription.value = description
}

// Scrape data from site
const scrape = () => {
  translation.value = null
  scrapeLoading.value = true
  note.value = ''

  ScrapeService.scrape(enText.value, browser.value)
  .then(response => {
    if (response.data.translation) {
      translation.value = response.data.translation
    } else {
      showModal('Error', 'Cannot get translation')
    }
  })
  .catch(error => {
    if (error.response) {
      showModal('Error', error.response.data.message)
    } else {
      showModal('Error', error.message)
    }
  })
  .finally(() => {
    scrapeLoading.value = false
  })
}

const scrapeQuran = () => {
  quranData.value = null
  scrapeLoading.value = true

  console.log(quranUrl.value)

  ScrapeService.scrapeQuran(quranUrl.value)
  .then(response => {
    if (response.data.quran) {
      quranData.value = response.data.quran
    } else {
      showModal('Error', 'Cannot fetch')
    }
  })
  .catch(error => {
    if (error.response) {
      showModal('Error', error.response.data.message)
    } else {
      showModal('Error', error.message)
    }
  })
  .finally(() => {
    scrapeLoading.value = false
  })
}

// Add to Anki deck
const addToAnki = () => {
  ankiLoading.value = true
  const {
    english,
    phonetic,
    transHtmlString,
    defHtmlString
  } = formattedTranslation.value
  
  AnkiService.addNote(english, phonetic, transHtmlString, defHtmlString, note.value)
  .then(response => {
    if (response.data.error == null) {
      showModal('Info', 'Successfully added to Anki')
    } else {
      showModal('Error', response.data.error)
    }
  })
  .catch(error => {
    showModal('Error', error.message)
  })
  .finally(() => {
    ankiLoading.value = false
  })
}

const addToAnkiQuran = () => {
  ankiLoading.value = true
  const {
    word,
    root,
    formText,
    exampleText,
    exampleMeaning
  } = quranData.value
  
  AnkiService.addNoteQuran(word, root, formText, exampleMeaning, exampleText)
  .then(response => {
    if (response.data.error == null) {
      showModal('Info', 'Successfully added to Anki')
    } else {
      showModal('Error', response.data.error)
    }
  })
  .catch(error => {
    showModal('Error', error.message)
  })
  .finally(() => {
    ankiLoading.value = false
  })
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div>
      <img src="/img/logo.png" alt="Logo" class="mx-auto w-32 h-32" />
    </div>

    <div class="mt-4 flex justify-stretch items-center gap-2 border-b border-gray-200 text-center">
      <a href="#" @click.prevent="mode = 'translate'"
        :class="`w-full inline-block rounded-t-lg p-4
        ${getTabClasses(mode == 'translate')}`">
        Translate
      </a>

      <a href="#" @click.prevent="mode = 'quran'"
        :class="`w-full inline-block rounded-t-lg p-4
        ${getTabClasses(mode == 'quran')}`">
        Quran
      </a>
    </div>

    <div v-if="mode == 'translate'" class="mt-4 flex justify-between items-center gap-4">
      <p class="text-gray-800">Backend Browser</p>

      <div class="flex items-center gap-8">
        <div class="flex items-center gap-2">
          <input type="radio" id="browser-remote" name="browser" value="0"
            v-model="browser">
          <label for="browser-remote">Remote</label>
        </div>

        <div class="flex items-center gap-2">
          <input type="radio" id="browser-local" name="browser" value="1"
            v-model="browser">
          <label for="browser-local">Local</label>
        </div>
      </div>
    </div>

    <div v-if="mode == 'translate'" class="mt-4">
      <form @submit.prevent="scrape">
        <label class="block">
          <span class="text-gray-800">English Word</span>
          <input type="text" v-model="enText" required
            class="mt-1 block w-full
            rounded-lg border-gray-300 focus:border-blue-300 shadow-sm
            focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </label>

        <AButton type="submit" :disabled="scrapeLoading" class="mt-2 w-full">
          <Spinner v-if="scrapeLoading" class="mr-1 h-4 w-4 text-blue-50" />
          Translate
        </AButton>
      </form>
    </div>

    <div v-if="mode == 'translate' && translation" class="mt-4">
      <div>
        <p class="text-gray-800">Card Preview</p>
        <div v-html="preview" class="mt-1 h-48 overflow-y-scroll
          border border-gray-300 rounded-lg shadow-sm
          px-4 py-2">
        </div>
      </div>

      <div class="mt-4">
        <form @submit.prevent="addToAnki">
          <label class="block">
            <span class="text-gray-800">Additional Note</span>
            <textarea v-model="note" rows=2
              class="mt-1 block w-full
              rounded-lg border-gray-300 focus:border-blue-300 shadow-sm
              focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
          </label>

          <AButton type="submit" :disabled="ankiLoading" class="mt-2 w-full">
            <Spinner v-if="ankiLoading" class="mr-1 h-4 w-4 text-blue-50" />
            Add to Anki
          </AButton>
        </form>
      </div>
    </div>

    <div v-if="mode == 'quran'" class="mt-4">
      <form @submit.prevent="scrapeQuran">
        <label class="block">
          <span class="text-gray-800">Quran Dictionary URL</span>
          <input type="text" v-model="quranUrl" required
            class="mt-1 block w-full
            rounded-lg border-gray-300 focus:border-blue-300 shadow-sm
            focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </label>

        <AButton type="submit" :disabled="scrapeLoading" class="mt-2 w-full">
          <Spinner v-if="scrapeLoading" class="mr-1 h-4 w-4 text-blue-50" />
          Fetch
        </AButton>
      </form>
    </div>

    <div v-if="mode == 'quran' && quranData" class="mt-4">
      <div>
        <p class="text-gray-800">Card Preview</p>
        <div v-html="quranPreview" class="mt-1 h-48 overflow-y-scroll
          border border-gray-300 rounded-lg shadow-sm
          px-4 py-2">
        </div>
      </div>

      <form @submit.prevent="addToAnkiQuran">
        <AButton type="submit" :disabled="ankiLoading" class="mt-2 w-full">
          <Spinner v-if="ankiLoading" class="mr-1 h-4 w-4 text-blue-50" />
          Add to Anki
        </AButton>
      </form>
    </div>
  </div>

  <Modal :title="modalTitle" :description="modalDescription"
    :showing="modalShowing" @closeModal="modalShowing = false" />
</template>
