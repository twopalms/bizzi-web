<script setup lang="ts">
import { computed } from 'vue'
import ActionButton from '../components/ActionButton.vue'
import CardEditSection from '../components/CardEditSection.vue'
import InputContainer from '../components/InputContainer.vue'

const card = defineModel<object | null>()
const publicUrl = computed(() => {
  return `https://bizzi.com/${card.value.slug}`
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
  // TODO: get phone field working!
  { label: 'Phone', placeholder: '(555) 123-4567', prop: 'phone', element: 'input' },
  { label: 'Website', placeholder: 'https://www.example.com', prop: 'website', element: 'input' },
]

const validateSlug = (text) => {
  const pattern = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
  if (!pattern.test(text)) {
    return 'Only lowercase letters, numbers, and hyphens are allowed. May not start or end with hyphen'
  }
}

defineEmits(['submitDelete'])
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- <CardEditSection title="Profile Picture"> -->
    <!--   <label>Profile Picture</label> -->
    <!--   <ActionButton bgColor="#d1d1d1" hoverColor="#e1e1e1" class="h-20 border-gray-500 border"> -->
    <!--     <input type="file" accept="image/*" class="hover:cursor-pointer" /> -->
    <!--   </ActionButton> -->
    <!-- </CardEditSection> -->
    <CardEditSection title="Basic Information">
      <InputContainer
        v-for="item in basicInfoForm"
        v-model="card[item.prop]"
        :key="item.prop"
        :label="item.label"
        :placeholder="item.placeholder"
        :element="item.element"
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
      />
    </CardEditSection>
    <CardEditSection title="Card Options">
      <InputContainer
        label="Public URL"
        placeholder="your-custom-url"
        :debounce="0"
        v-model="card.slug"
        :validator="validateSlug"
      />
      <div class="flex flex-col text-sm">
        <a :href="publicUrl" class="hover:cursor-pointer hover:underline text-blue-800"
          >https://bizzicard.com/directory/{{ card.slug }}</a
        >
      </div>
      <div class="flex justify-between border border-red-400/50 p-2 mt-4 rounded-md">
        <div class="flex flex-col text-sm">
          <strong>Delete this card</strong>
          <div>Permanently delete this card. This cannot be undone.</div>
        </div>
        <ActionButton @click="$emit('submitDelete')" bgColor="#FF5F57" hoverColor="#9C0203">
          Delete
        </ActionButton>
      </div>
    </CardEditSection>
  </div>
</template>
