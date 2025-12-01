<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import parsePhoneNumber from 'libphonenumber-js'
import { useAuth } from '../composables/useAuth.ts'
import { CircleStencil, Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import AirButton from '../components/AirButton.vue'
import CardEditSection from '../components/CardEditSection.vue'
import FormField from '../components/FormField.vue'
import FileUpload from '../components/FileUpload.vue'
import FocusModal from '../components/FocusModal.vue'
import LinkForm from '../components/LinkForm.vue'
import PublicToggle from '../components/PublicToggle.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const { makeAuthenticatedRequest } = useAuth()

const emit = defineEmits(['submitDelete'])

const referenceCard = defineModel('referenceCard')
const mutableCard = defineModel('mutableCard', { default: {} })
const hasPendingChanges = ref(false)
const showDeleteConfirmation = ref(false)
const showSaveSuccess = ref(false)
const saveLoading = ref(false)
const showCropper = ref(false)
const cropperInput = ref(null)
const cropperOutput = ref(null)
const cropperCoords = ref(null)

function isPhoneValid(value: string) {
  try {
    const parsed = parsePhoneNumber(value, 'US')
    return parsed.isValid()
  } catch {
    return false
  }
}

watch(
  mutableCard,
  async (newCard) => {
    hasPendingChanges.value = JSON.stringify(newCard) !== JSON.stringify(referenceCard.value)
  },
  { deep: true },
)

const publicUrl = computed(() => {
  // TODO: make this env-dependent
  return `https://bizzicard.com/directory/${mutableCard.value.slug}`
})

const phoneError = computed(() => {
  if (!mutableCard.value.phone) return ''
  const isValid = isPhoneValid(mutableCard.value.phone)
  return isValid ? '' : 'Invalid Phone'
})

function isSlugValid(text) {
  const pattern = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
  return pattern.test(text)
}

const slugError = computed(() => {
  if (!mutableCard.value.slug) return ''
  const isValid = isSlugValid(mutableCard.value.slug)
  console.log(isValid)
  return isValid
    ? ''
    : 'Only lowercase letters, numbers, and hyphens are allowed. May not start or end with hyphen'
})

function resetCard() {
  mutableCard.value = structuredClone(toRaw(referenceCard.value))
}

async function uploadProfilePicture(file: object, mode: str) {
  const id = referenceCard.value.uuid
  const formData = new FormData()

  formData.append('file', file, file.name)

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/cards/${id}/${mode}/`, {
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
    const response = await makeAuthenticatedRequest(`${API_BASE}/cards/${id}/picture/`, {
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
  } else {
    data.phone = null
  }

  // TODO: handle response codes

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/cards/${id}/`, {
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
  saveLoading.value = true

  try {
    // If picture is an object, we know its a pending upload
    if (!mutableCard.value.picture) {
      if (referenceCard.value.picture) {
        await deleteProfilePicture()
      }
    } else if (typeof mutableCard.value.picture === 'object') {
      await uploadProfilePicture(mutableCard.value.picture, 'picture')
    }

    if (!mutableCard.value.picture_cropped) {
      if (referenceCard.value.picture_cropped) {
        await deleteProfilePicture()
      }
    } else if (typeof mutableCard.value.picture_cropped === 'object') {
      await uploadProfilePicture(mutableCard.value.picture_cropped, 'picture-cropped')
    }

    const newCard = await patchCard(mutableCard.value)
    referenceCard.value = newCard

    showSaveSuccess.value = true

    setTimeout(() => {
      showSaveSuccess.value = false
    }, 1000)
  } finally {
    saveLoading.value = false
  }
}

async function deleteCard() {
  // TODO: handle response codes
  showDeleteConfirmation.value = false

  const id = referenceCard.value.uuid

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/cards/${id}/`, {
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

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

async function handleFileUploadChange(val) {
  // NOTE: instead of using a v-model to keep the card picture in sync,
  // we can use an emit from the file upload component. The file is read
  // async which causes some ref sync issues.
  mutableCard.value.picture = val
  cropperInput.value = await toBase64(val)
  showCropper.value = true
}

function handleEditPicture() {
  if (typeof mutableCard.value.picture === 'string') {
    cropperInput.value = mutableCard.value.picture
  } else if (typeof mutableCard.value.picture === 'object') {
    cropperInput.value = URL.createObjectURL(mutableCard.value.picture)
  }

  showCropper.value = true
}

function getImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

async function cropperChange({ coordinates, canvas }) {
  const size = await getImageSize(cropperInput.value)

  cropperCoords.value = {
    originalWidth: size.width,
    originalHeight: size.height,
    width: coordinates.width,
    height: coordinates.height,
    top: coordinates.top,
    left: coordinates.left,
  }

  cropperOutput.value = canvas.toDataURL()
}

function confirmCropper() {
  const croppedImage = dataURLtoFile(cropperOutput.value)
  mutableCard.value.picture_cropped = croppedImage
  mutableCard.value.picture_meta = cropperCoords.value
  showCropper.value = false
}

function dataURLtoFile(dataURL, filename) {
  const [header, base64Data] = dataURL.split(',')
  const mime = header.match(/:(.*?);/)[1]

  const binary = atob(base64Data)
  const length = binary.length
  const bytes = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new File([bytes], filename, { type: mime })
}
</script>

<template>
  <div class="w-full overscroll-none overflow-y-auto">
    <div
      class="flex justify-between items-center h-18 bg-gray-200 px-4 sticky top-0 z-10 border-b border-gray-300"
    >
      <h3 v-if="!(showSaveSuccess || saveLoading)">Edit your card below</h3>
      <div v-else-if="saveLoading" class="flex flex-grow justify-center items-center">
        <LoadingSpinner text="" />
      </div>
      <span v-else-if="showSaveSuccess" class="font-semibold text-green-700">Card Saved!</span>
      <div class="flex gap-2">
        <AirButton @click="resetCard" :enabled="hasPendingChanges">
          <div class="flex items-center gap-3">
            <i class="pi pi-undo" />
            <span>Reset</span>
          </div>
        </AirButton>
        <AirButton @click="saveCard" :enabled="hasPendingChanges" bgColor="#86d196">
          <div class="flex items-center gap-3">
            <i class="pi pi-save" />
            <span class="font-semibold">Save</span>
          </div>
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
        <FormField label="Color">
          <input
            v-model="mutableCard.color"
            type="color"
            class="w-full hover:cursor-pointer outline-gray-800 outline -outline-offset-1 rounded-lg"
            :style="`--cardColor: ${mutableCard.color}`"
          />
        </FormField>
        <FormField label="Picture">
          <div class="flex flex-1 gap-3 items-center">
            <FileUpload @change="handleFileUploadChange" />
            <AirButton @click="handleEditPicture" :enabled="Boolean(mutableCard.picture)">
              <div class="flex gap-2 items-center justify-center">
                <i class="pi pi-pen-to-square" />
                <span>Edit</span>
              </div>
            </AirButton>
            <AirButton
              @click="() => (mutableCard.picture = null)"
              :enabled="Boolean(mutableCard.picture)"
            >
              <div class="flex gap-2 items-center justify-center">
                <i class="pi pi-trash" />
                <span>Delete</span>
              </div>
            </AirButton>
            <FocusModal v-model="showCropper">
              <div class="flex flex-col items-center justify-center gap-3">
                <cropper
                  @change="cropperChange"
                  class="cropper"
                  :src="cropperInput"
                  :stencilComponent="CircleStencil"
                />
                <AirButton @click="confirmCropper">Confirm</AirButton>
              </div>
            </FocusModal>
          </div>
        </FormField>
      </CardEditSection>
      <CardEditSection title="Basic Information">
        <FormField label="Full Name">
          <input v-model="mutableCard.name" type="text" placeholder="Enter your full name" />
        </FormField>
        <FormField label="Job Title">
          <input
            v-model="mutableCard.job_title"
            type="text"
            placeholder="Designer, Personal Chef, Consultant, etc."
          />
        </FormField>
        <FormField label="Company">
          <input v-model="mutableCard.company" type="text" placeholder="Acme Industry" />
        </FormField>
        <FormField label="Location">
          <input
            v-model="mutableCard.location"
            type="text"
            placeholder="City, State, County, etc."
          />
        </FormField>
        <FormField label="Bio">
          <textarea v-model="mutableCard.bio" rows="5" placeholder="Tell people about yourself" />
        </FormField>
      </CardEditSection>
      <CardEditSection title="Contact Information">
        <FormField label="Email">
          <input v-model="mutableCard.email" type="email" placeholder="john.doe@example.com" />
        </FormField>
        <FormField label="Phone" :error="phoneError" :showError="Boolean(phoneError)">
          <input v-model="mutableCard.phone" type="tel" placeholder="+1 555 123 4567" />
        </FormField>
        <FormField label="Website">
          <input v-model="mutableCard.website" type="url" placeholder="https://example.com" />
        </FormField>
      </CardEditSection>
      <CardEditSection title="Links">
        <LinkForm v-model="mutableCard.links" />
      </CardEditSection>
      <CardEditSection title="Options">
        <PublicToggle v-model="mutableCard.public" />
        <FormField label="Public URL" :error="slugError" :showError="Boolean(slugError)">
          <input v-model="mutableCard.slug" type="text" placeholder="your-custom-url" />
        </FormField>
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
