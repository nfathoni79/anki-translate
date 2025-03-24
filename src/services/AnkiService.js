import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8765',
})

const addNote = (english, phonetic, indonesian, definitions, extra) => {
  return apiClient.post('', {
    action: 'addNote',
    version: 6,
    params: {
      note: {
        deckName: 'Translate',
        modelName: 'Translate',
        fields: {
          English: english,
          Phonetic: phonetic,
          Indonesian: indonesian,
          Definitions: definitions,
          Extra: extra,
        },
        options: {
          allowDuplicate: false,
          duplicateScope: 'deck',
          duplicateScopeOptions: {
            deckName: 'Translate',
          }
        },
      },
    },
  })
}

const addNoteQuran = (word, root, info, translation, references) => {
  return apiClient.post('', {
    action: 'addNote',
    version: 6,
    params: {
      note: {
        deckName: 'Quran Vocabulary',
        modelName: 'Quran Vocabulary Note',
        fields: {
          Word: word,
          Root: root,
          Info: info,
          Translation: translation,
          References: references,
        },
      },
    },
  })
}

export default {
  addNote,
  addNoteQuran,
}
