<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const props = defineProps({
  title: String,
  description: String,
  showing: Boolean,
})

defineEmits(['closeModal'])
</script>

<template>
  <TransitionRoot appear :show="showing" as="template">
    <Dialog as="div" @close="$emit('closeModal')"
      class="relative z-10">
      <TransitionChild as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg
              bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3"
                class="text-lg font-medium leading-6 text-gray-900">
                {{ title }}
              </DialogTitle>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ description }}
                </p>
              </div>

              <div class="mt-4">
                <button type="button"
                  class="inline-flex w-full justify-center rounded-lg
                  border border-transparent bg-blue-100 hover:bg-blue-200
                  px-4 py-2
                  text-sm font-medium text-blue-900
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="$emit('closeModal')">
                  OK
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
