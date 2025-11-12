<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import parsePhoneNumber from 'libphonenumber-js'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import CardEditSection from '../components/CardEditSection.vue'
import InputContainer from '../components/InputContainer.vue'
import FileUpload from '../components/FileUpload.vue'
import FocusModal from '../components/FocusModal.vue'
import LinkForm from '../components/LinkForm.vue'
import PublicToggle from '../components/PublicToggle.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const { makeAuthenticatedRequest } = useAuth()

const emit = defineEmits(['submitDelete'])

const referenceCard = defineModel('referenceCard')
const mutableCard = defineModel('mutableCard', { default: {} })
const hasPendingChanges = ref(false)
const showDeleteConfirmation = ref(false)
const showSaveSuccess = ref(false)

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

watch(
  mutableCard,
  (newCard) => {
    hasPendingChanges.value = JSON.stringify(newCard) !== JSON.stringify(referenceCard.value)
  },
  { deep: true },
)

const publicUrl = computed(() => {
  // TODO: make this env-dependent
  return `https://bizzicard.com/directory/${mutableCard.value.slug}`
})

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

function resetCard() {
  mutableCard.value = structuredClone(toRaw(referenceCard.value))
}

async function uploadProfilePicture(file: object) {
  const id = referenceCard.value.uuid
  const formData = new FormData()

  formData.append('file', file, file.name)

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/picture/`, {
      method: 'PUT',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')
    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function deleteProfilePicture() {
  const id = referenceCard.value.uuid

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/picture/`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete picture')
  } catch (err) {
    console.error(err)
  }
}

async function patchCard(data: object): Card {
  const id = referenceCard.value.uuid

  if (data.phone) {
    const parsed = parsePhoneNumber(data.phone, 'US').number
    data.phone = parsed
  }

  // TODO: handle response codes

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return await response.json()
    } else {
      // todo: error handling
      console.warn('Failed to update card')
    }
  } catch (err) {
    console.error(err)
  } finally {
  }
}

async function saveCard() {
  // If picture is an object, we know its a pending upload
  if (!mutableCard.value.picture) {
    if (referenceCard.value.picture) {
      await deleteProfilePicture()
    }
  } else if (typeof mutableCard.value.picture === 'object') {
    await uploadProfilePicture(mutableCard.value.picture)
  }

  const newCard = await patchCard(mutableCard.value)
  referenceCard.value = newCard

  showSaveSuccess.value = true

  setTimeout(() => {
    showSaveSuccess.value = false
  }, 1000)
}

async function deleteCard() {
  // TODO: handle response codes
  showDeleteConfirmation.value = false

  const id = referenceCard.value.uuid

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/api/cards/${id}/`, {
      method: 'DELETE',
    })

    if (response.ok) {
      emit('submitDelete')
    } else {
      console.error('Failed to delete card')
    }
  } catch (err) {
    console.error(err)
  } finally {
  }
}
</script>

<template>
  <div class="w-full overscroll-none overflow-y-auto">
    <div
      class="flex justify-between items-center h-18 bg-gray-200 px-4 sticky top-0 z-10 border-b border-gray-300"
    >
      <h3 v-if="!showSaveSuccess">Edit your card below</h3>
      <span v-else class="font-semibold text-green-700">Card Saved!</span>
      <div class="flex gap-2">
        <AirButton @click="resetCard" :enabled="hasPendingChanges"> Reset </AirButton>
        <AirButton @click="saveCard" :enabled="hasPendingChanges" bgColor="#86d196">
          Save
        </AirButton>
      </div>
    </div>
    <FocusModal v-model="showDeleteConfirmation">
      <div class="flex flex-col text-center gap-4">
        <p>Confirm deletion. This action cannot be undone.</p>
        <div>
          <AirButton @click="deleteCard" bgColor="#FF5F57"> Delete </AirButton>
        </div>
      </div>
    </FocusModal>
    <div class="flex flex-1 flex-col">
      <CardEditSection title="Header">
        <label>Picture</label>
        <div class="flex flex-1 items-center">
          <FileUpload v-model="mutableCard.picture" class="w-full mr-4" />
          <AirButton
            @click="() => (mutableCard.picture = null)"
            :enabled="Boolean(mutableCard.picture)"
          >
            Clear
          </AirButton>
        </div>
      </CardEditSection>
      <CardEditSection title="Basic Information">
        <InputContainer
          v-for="item in basicInfoForm"
          v-model="mutableCard[item.prop]"
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
          v-model="mutableCard[item.prop]"
          :key="item.prop"
          :label="item.label"
          :placeholder="item.placeholder"
          :element="item.element"
          :formatter="item.formatter"
          :parser="item.parser"
          :validator="item.validator"
        />
      </CardEditSection>
      <CardEditSection title="Links">
        <LinkForm v-model="mutableCard.links" />
      </CardEditSection>
      <CardEditSection title="Options">
        <PublicToggle v-model="mutableCard.public" />
        <InputContainer
          label="Public URL"
          placeholder="your-custom-url"
          v-model="mutableCard.slug"
          :validator="validateSlug"
        />
        <div class="flex flex-col text-sm gap-3">
          <a :href="publicUrl" class="hover:cursor-pointer hover:underline text-blue-800">{{
            publicUrl
          }}</a>
          <div>Your card will only be available at this URL if set to public</div>
        </div>
        <div
          class="flex justify-between items-center border border-red-400/50 p-2 rounded-md mt-8 gap-3"
        >
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
  </div>
</template>
