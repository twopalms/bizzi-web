<script setup lang="ts">
import { onBeforeUpdate, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formatIncompletePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'
import parsePhoneNumber from 'libphonenumber-js'

const props = defineProps({
  initial: String,
})

const route = useRoute()

const code = ref(null)
const phone = ref(null)
// const error = ref('')
let isDeleting = false

const text = defineModel<string>('text')

function loadInitial() {
  if (props.initial) {
    const parsed = parsePhoneNumber(props.initial)
    if (parsed === undefined) {
      code.value = null
      phone.value = null
    } else {
      code.value = parsed.countryCallingCode
      phone.value = parsed.formatNational()
    }
  } else {
    code.value = null
    phone.value = null
  }
}

function formatPhone() {}

// function formatPhone() {
//   // TODO: change isDeleting to isDeletingSpecialChar
//   // if (isDeleting) {
//   //   return
//   // }
//
//   console.log(code.value)
//   console.log(phone.value)
//
//   let combined = ''
//
//   if (code.value) {
//     combined = `+${code.value}`
//   }
//
//   if (phone.value) {
//     combined += phone.value
//   }
//
//   const parsed = parsePhoneNumber(combined)
//
//   if (parsed === undefined) {
//     const cleaned = combined.trim().replace('(', '').replace(')', '')
//
//     if (cleaned) {
//       text.value = cleaned
//     } else {
//       text.value = ''
//     }
//   } else {
//     text.value = parsed.number
//     console.log(parsed.formatNational())
//     console.log(code.value || '1')
//
//     if (parsed.isValid()) {
//       phone.value = parsed.formatNational()
//     } else {
//       phone.value = formatIncompletePhoneNumber(phone.value, {
//         defaultCallingCode: code.value || '1',
//       })
//     }
//   }
// }

function handleKeydown(event) {
  isDeleting = event.key === 'Backspace' || event.key === 'Delete'
}

function combineParts(code, number) {
  let combined = ''

  if (code) {
    combined = `+${code}`
  }

  if (number) {
    combined += number
  }

  const parsed = parsePhoneNumber(combined)

  if (parsed === undefined) {
    const cleaned = combined.trim().replace('(', '').replace(')', '')

    if (cleaned) {
      return cleaned
    } else {
      return ''
    }
  } else {
    return parsed.number
  }
}

watch(
  [code, phone],
  ([newCode, newPhone]) => {
    text.value = combineParts(newCode, newPhone)
  },
  { initial: true },
)

onMounted(() => loadInitial())
// onBeforeUpdate(() => loadInitial())
</script>

<template>
  <div class="flex w-full bg-white rounded shadow-sm">
    <div class="flex gap justify-center items-center">
      <span class="px-2">+</span>
      <input
        @input="formatPhone"
        @keydown="handleKeydown"
        type="text"
        v-model.trim="code"
        placeholder="1"
        maxLength="3"
        class="p-2 w-12 flex-shrink-0 text-right"
      />
    </div>
    <input
      @input="formatPhone"
      @keydown="handleKeydown"
      type="text"
      v-model.trim="phone"
      placeholder="(555) 123-4567"
      class="p-2 flex-grow"
    />
  </div>
</template>
