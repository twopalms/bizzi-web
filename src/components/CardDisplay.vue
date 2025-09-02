<template>
  <div class="card-display">
    <div class="profile-header">
      <div class="profile-info">
        <h1>{{ card.name || 'Business Card' }}</h1>
        <div class="title-company">
          <p v-if="card.job_title || card.company" class="job-company">
            <template v-if="card.job_title && card.company">
              {{ card.job_title }}, {{ card.company }}
            </template>
            <template v-else-if="card.job_title">
              {{ card.job_title }}
            </template>
            <template v-else-if="card.company">
              {{ card.company }}
            </template>
          </p>
          <p v-if="card.location" class="location">{{ card.location }}</p>
        </div>
      </div>

      <div class="profile-avatar">
        <div class="avatar-placeholder" v-if="!card.picture">
          <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div v-else class="avatar-image-container">
          <img :src="card.picture" :alt="card.name" class="avatar-image" />
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div v-if="card.bio" class="bio-section">
        <p class="bio-text">{{ card.bio }}</p>
      </div>

      <div v-if="hasContactInfo" class="contact-section">
        <div class="contact-grid">
          <!-- Email -->
          <div
            v-if="card.email"
            class="contact-item"
            :class="{ 'contact-item-hoverable': !isMobileDevice() }"
          >
            <div class="contact-icon-wrapper">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="contact-details">
              <span class="contact-label">Email</span>
              <div class="contact-value-row">
                <a
                  v-if="isMobileDevice()"
                  :href="`mailto:${card.email}`"
                  class="contact-value"
                  >{{ card.email }}</a
                >
                <span v-else class="contact-value">{{ card.email }}</span>
                <div v-if="!isMobileDevice()" class="copy-action">
                  <div
                    v-if="showCopySuccess && copySuccessType === 'Email'"
                    class="copy-success"
                  >
                    <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="success-text">Copied!</span>
                  </div>
                  <div
                    v-else
                    class="copy-icon"
                    @click.stop="copyToClipboard(card.email, 'Email')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Phone -->
          <div
            v-if="card.phone_fmt || card.phone_raw"
            class="contact-item"
            :class="{ 'contact-item-hoverable': !isMobileDevice() }"
          >
            <div class="contact-icon-wrapper">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div class="contact-details">
              <span class="contact-label">Phone</span>
              <div class="contact-value-row">
                <a
                  v-if="isMobileDevice()"
                  :href="`tel:${card.phone_raw || card.phone_fmt}`"
                  class="contact-value"
                >
                  {{ card.phone_fmt || card.phone_raw }}
                </a>
                <span v-else class="contact-value">
                  {{ card.phone_fmt || card.phone_raw }}
                </span>
                <div v-if="!isMobileDevice()" class="copy-action">
                  <div
                    v-if="showCopySuccess && copySuccessType === 'Phone'"
                    class="copy-success"
                  >
                    <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="success-text">Copied!</span>
                  </div>
                  <div
                    v-else
                    class="copy-icon"
                    @click.stop="copyToClipboard(card.phone_fmt || card.phone_raw || '', 'Phone')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Website -->
          <div
            v-if="card.website"
            class="contact-item"
            :class="{ 'contact-item-hoverable': !isMobileDevice() }"
          >
            <div class="contact-icon-wrapper">
              <i class="pi pi-globe contact-icon"></i>
            </div>
            <div class="contact-details">
              <span class="contact-label">Website</span>
              <div class="contact-value-row">
                <a
                  :href="card.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contact-value"
                >
                  {{ card.website }}
                </a>
                <div v-if="!isMobileDevice()" class="copy-action">
                  <div
                    v-if="showCopySuccess && copySuccessType === 'Website'"
                    class="copy-success"
                  >
                    <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="success-text">Copied!</span>
                  </div>
                  <div
                    v-else
                    class="copy-icon"
                    @click.stop="copyToClipboard(card.website, 'Website')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card } from '../composables/useCards'

interface Props {
  card: Card
}

const props = defineProps<Props>()

const showCopySuccess = ref(false)
const copySuccessType = ref('')

// Check if any contact information exists
const hasContactInfo = computed(() => {
  return props.card.email || props.card.phone_fmt || props.card.phone_raw || props.card.website
})

// Mobile detection
const isMobileDevice = (): boolean => {
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window ||
    window.innerWidth <= 768
  )
}

// Clipboard copy functionality
const copyToClipboard = async (text: string, type: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copySuccessType.value = type
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
      copySuccessType.value = ''
    }, 1000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

</script>