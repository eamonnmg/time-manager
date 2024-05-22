<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import CloseButton from "@/shared/components/CloseButton.vue";

interface Props {
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<template>
  <TransitionRoot as="template" appear :show="true">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="mt-3 text-center sm:mt-5">
                <CloseButton
                  tabindex="-1"
                  class="absolute top-4 right-4"
                  @click="close"
                />
                <slot name="header">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >{{ title }}</DialogTitle
                  >
                  <div v-if="description" class="mt-2">
                    <DialogDescription class="text-sm text-gray-500"
                      >{{ description }}}
                    </DialogDescription>
                  </div>
                </slot>
              </div>

              <div class="mt-8">
                <slot name="default"></slot>
              </div>
              <div class="mt-5 sm:mt-6">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped></style>
