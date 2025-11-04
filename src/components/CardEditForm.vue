<script setup lang="ts">
import { computed, ref } from 'vue'
import parsePhoneNumber from 'libphonenumber-js'
import AirButton from '../components/AirButton.vue'
import CardEditSection from '../components/CardEditSection.vue'
import InputContainer from '../components/InputContainer.vue'
import FileUpload from '../components/FileUpload.vue'
import FocusModal from '../components/FocusModal.vue'

// TODO: add links section

const emit = defineEmits(['submitDelete'])

function validatePhone(value: string) {
  if (!value) return ''
  try {
    const parsed = parsePhoneNumber(value, 'US')
    if (!parsed.isValid()) {
      return 'Invalid phone number'
    }
  } catch {
    return 'Invalid phone number'
  }

  return ''
}

const card = defineModel<object | null>()
const publicUrl = computed(() => {
  return `https://bizzi.com/${card.value.slug}`
})
const showDeleteConfirmation = ref(false)

const basicInfoForm = [
  { label: 'Full Name', placeholder: 'Enter your full name', prop: 'name', element: 'input' },
  {
    label: 'Job Title',
    placeholder: 'Designer, Personal Chef, Consultant, etc.',
    prop: 'job_title',
    element: 'input',
  },
  { label: 'Company', placeholder: 'Acme Industries', prop: 'company', element: 'input' },
  {
    label: 'Location',
    placeholder: 'City, State, County, etc.',
    prop: 'location',
    element: 'input',
  },
  { label: 'Bio', placeholder: 'Tell people about yourself', prop: 'bio', element: 'textarea' },
]

const contactInfoForm = [
  { label: 'Email', placeholder: 'john@example.com', prop: 'email', element: 'input' },
  {
    label: 'Phone',
    placeholder: '+1 555 123 4567',
    prop: 'phone',
    element: 'input',
    validator: validatePhone,
  },
  { label: 'Website', placeholder: 'https://www.example.com', prop: 'website', element: 'input' },
]

const validateSlug = (text) => {
  const pattern = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
  if (!pattern.test(text)) {
    return 'Only lowercase letters, numbers, and hyphens are allowed. May not start or end with hyphen'
  }
}

async function handleDelete() {
  try {
    showDeleteConfirmation.value = false
    emit('submitDelete')
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <FocusModal v-model="showDeleteConfirmation">
    <div class="flex flex-col text-center gap-4">
      <p>Please confirm deletion</p>
      <div>
        <AirButton @click="handleDelete" bgColor="#FF5F57"> Delete </AirButton>
      </div>
    </div>
  </FocusModal>
  <div class="flex flex-1 flex-col">
    <CardEditSection title="Header">
      <label>Picture</label>
      <div class="flex flex-1 items-center">
        <FileUpload v-model="card.picture" class="w-full mr-4" />
        <AirButton @click="() => (card.picture = null)" :enabled="Boolean(card.picture)">
          Clear
        </AirButton>
      </div>
    </CardEditSection>
    <CardEditSection title="Basic Information">
      <InputContainer
        v-for="item in basicInfoForm"
        v-model="card[item.prop]"
        :key="item.prop"
        :label="item.label"
        :placeholder="item.placeholder"
        :element="item.element"
        :formatter="item.formatter"
        :parser="item.parser"
        :validator="item.validator"
      />
    </CardEditSection>
    <CardEditSection title="Contact Information">
      <InputContainer
        v-for="item in contactInfoForm"
        v-model="card[item.prop]"
        :key="item.prop"
        :label="item.label"
        :placeholder="item.placeholder"
        :element="item.element"
        :formatter="item.formatter"
        :parser="item.parser"
        :validator="item.validator"
      />
    </CardEditSection>
    <CardEditSection title=" Options">
      <InputContainer
        label="Public URL"
        placeholder="your-custom-url"
        v-model="card.slug"
        :validator="validateSlug"
      />
      <div class="flex flex-col text-sm">
        <a :href="publicUrl" class="hover:cursor-pointer hover:underline text-blue-800"
          >https://bizzicard.com/directory/{{ card.slug }}</a
        >
      </div>
      <div class="flex justify-between items-center border border-red-400/50 p-2 rounded-md">
        <div class="flex flex-col gap-2 text-sm">
          <strong>Delete this card</strong>
          <p>Permanently delete this card. This cannot be undone.</p>
        </div>
        <div>
          <AirButton @click="() => (showDeleteConfirmation = true)" bgColor="#FF5F57">
            Delete
          </AirButton>
        </div>
      </div>
    </CardEditSection>
  </div>
</template>
