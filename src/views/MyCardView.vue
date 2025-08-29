<template>
  <div>
    <NavBar />
    <div class="card-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-card card">
        <div class="loading-content">
          <div class="spinner"></div>
          <p>Loading your card...</p>
        </div>
      </div>

      <!-- No Profile - Create Form -->
      <div v-else-if="!profile" class="create-card-container">
        <div class="create-card card">
          <h1>Create Your Business Card</h1>
          <p class="subtitle">Let's build your digital business card to share with contacts.</p>

          <form @submit.prevent="handleCreateProfile" class="create-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Full Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  :disabled="isCreating"
                  placeholder="John Doe"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="job_title" class="form-label">Job Title</label>
                <input
                  id="job_title"
                  v-model="form.job_title"
                  type="text"
                  :disabled="isCreating"
                  placeholder="Financial Analyst"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="company" class="form-label">Company</label>
                <input
                  id="company"
                  v-model="form.company"
                  type="text"
                  :disabled="isCreating"
                  placeholder="Acme Corp"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :disabled="isCreating"
                  placeholder="john@example.com"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <div class="phone-field-container">
                  <span class="country-prefix">+1</span>
                  <input
                    id="phone"
                    v-model="form.phoneNumber"
                    @input="formatPhoneNumber"
                    type="tel"
                    :disabled="isCreating"
                    placeholder="(555) 123-4567"
                    maxlength="14"
                    class="form-input"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="location" class="form-label">Location</label>
                <input
                  id="location"
                  v-model="form.location"
                  type="text"
                  :disabled="isCreating"
                  placeholder="New York, NY"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="website" class="form-label">Website</label>
              <input
                id="website"
                v-model="form.website"
                type="url"
                :disabled="isCreating"
                placeholder="https://www.example.com"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="bio" class="form-label">Bio</label>
              <textarea
                id="bio"
                v-model="form.bio"
                :disabled="isCreating"
                placeholder="Tell people about yourself..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="picture" class="form-label">Profile Picture</label>
              <div class="picture-upload-container">
                <div class="picture-preview" v-if="picturePreview">
                  <img :src="picturePreview" alt="Profile preview" class="preview-image" />
                  <button type="button" @click="removePicturePreview" class="remove-preview-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="picture-upload-area" v-else>
                  <input
                    id="picture"
                    type="file"
                    accept="image/*"
                    @change="handlePictureSelect"
                    :disabled="isCreating"
                    class="picture-input"
                  />
                  <label for="picture" class="picture-upload-label">
                    <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    <span>Add Profile Picture</span>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" :disabled="isCreating" class="btn btn-primary create-btn">
              {{ isCreating ? 'Creating Card...' : 'Create My Card' }}
            </button>

            <div v-if="createError" class="error-message">
              {{ createError }}
            </div>
          </form>
        </div>
      </div>

      <!-- Existing Profile - Display -->
      <div v-else class="profile-display">
        <div class="profile-layout">
          <!-- Main Profile Card -->
          <div class="profile-main">
            <div class="profile-card card">
              <!-- View Mode -->
              <div v-if="!editMode">
                <div class="profile-header">
                  <div class="profile-info">
                    <h1>{{ profile.name || 'Business Card' }}</h1>
                    <div class="title-company">
                      <p v-if="profile.job_title || profile.company" class="job-company">
                        <template v-if="profile.job_title && profile.company">
                          {{ profile.job_title }}, {{ profile.company }}
                        </template>
                        <template v-else-if="profile.job_title">
                          {{ profile.job_title }}
                        </template>
                        <template v-else-if="profile.company">
                          {{ profile.company }}
                        </template>
                      </p>
                      <p v-if="profile.location" class="location">{{ profile.location }}</p>
                    </div>
                  </div>

            <div class="profile-avatar" :class="{ 'uploading': isUploadingPicture }">
              <input
                ref="pictureUploadInput"
                type="file"
                accept="image/*"
                @change="handleProfilePictureUpload"
                class="hidden-file-input"
              />
              <div class="avatar-placeholder" v-if="!profile.picture">
                <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div v-else class="avatar-image-container">
                <img :src="profile.picture" :alt="profile.name" class="avatar-image" />
              </div>
              <div v-if="isUploadingPicture" class="upload-spinner">
                <div class="spinner"></div>
              </div>
            </div>
          </div>

          <div class="profile-content">
            <div v-if="profile.bio" class="bio-section">
              <p class="bio-text">{{ profile.bio }}</p>
            </div>

            <div class="contact-section">
              <div class="contact-grid">
                <div v-if="profile.email" class="contact-item" :class="{ 'contact-item-hoverable': !isMobileDevice() }">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Email</span>
                    <div class="contact-value-row">
                      <a v-if="isMobileDevice()" :href="`mailto:${profile.email}`" class="contact-value">{{ profile.email }}</a>
                      <span v-else class="contact-value">{{ profile.email }}</span>
                      <div v-if="!isMobileDevice()" class="copy-action">
                        <div v-if="showCopySuccess && copySuccessType === 'Email'" class="copy-success">
                          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="success-text">Copied!</span>
                        </div>
                        <div v-else class="copy-icon" @click.stop="copyToClipboard(profile.email, 'Email')">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="profile.phone_fmt || profile.phone_raw" class="contact-item" :class="{ 'contact-item-hoverable': !isMobileDevice() }">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Phone</span>
                    <div class="contact-value-row">
                      <a v-if="isMobileDevice()" :href="`tel:${profile.phone_raw || profile.phone_fmt}`" class="contact-value">
                        {{ profile.phone_fmt || profile.phone_raw }}
                      </a>
                      <span v-else class="contact-value">
                        {{ profile.phone_fmt || profile.phone_raw }}
                      </span>
                      <div v-if="!isMobileDevice()" class="copy-action">
                        <div v-if="showCopySuccess && copySuccessType === 'Phone'" class="copy-success">
                          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="success-text">Copied!</span>
                        </div>
                        <div v-else class="copy-icon" @click.stop="copyToClipboard(profile.phone_fmt || profile.phone_raw, 'Phone')">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="profile.website" class="contact-item" :class="{ 'contact-item-hoverable': !isMobileDevice() }">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Website</span>
                    <div class="contact-value-row">
                      <a :href="profile.website" target="_blank" rel="noopener noreferrer" class="contact-value">
                        {{ profile.website }}
                      </a>
                      <div v-if="!isMobileDevice()" class="copy-action">
                        <div v-if="showCopySuccess && copySuccessType === 'Website'" class="copy-success">
                          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="success-text">Copied!</span>
                        </div>
                        <div v-else class="copy-icon" @click.stop="copyToClipboard(profile.website, 'Website')">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
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

              <!-- Edit Mode -->
              <div v-else class="profile-edit-mode">
                <div class="profile-header">
                  <div class="profile-info">
                    <input v-model="editForm.name" class="edit-input edit-name" placeholder="Your Name" />
                    <div class="title-company">
                      <div class="job-company-edit">
                        <input v-model="editForm.job_title" class="edit-input edit-job" placeholder="Job Title" />
                        <span class="separator" v-if="editForm.job_title && editForm.company">, </span>
                        <input v-model="editForm.company" class="edit-input edit-company" placeholder="Company" />
                      </div>
                      <input v-model="editForm.location" class="edit-input edit-location" placeholder="Location" />
                    </div>
                  </div>

                  <div class="profile-avatar" :class="{ 'uploading': isUploadingPicture }">
                    <input
                      ref="pictureUploadInput"
                      type="file"
                      accept="image/*"
                      @change="handleProfilePictureUpload"
                      class="hidden-file-input"
                    />
                    <div class="avatar-placeholder" v-if="!profile.picture">
                      <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <div class="avatar-overlay">
                        <button @click="triggerPictureUpload" class="overlay-btn" title="Add picture">
                          <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else class="avatar-image-container">
                      <img :src="profile.picture" :alt="profile.name" class="avatar-image" />
                      <div class="avatar-overlay">
                        <div class="overlay-icons">
                          <button @click="triggerPictureUpload" class="overlay-btn" title="Change picture">
                            <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button @click.stop="deletePicture" :disabled="isDeletingPicture" class="overlay-btn delete-btn" title="Delete picture">
                            <svg class="overlay-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-if="isUploadingPicture" class="upload-spinner">
                      <div class="spinner"></div>
                    </div>
                  </div>
                  
                </div>

                <div class="profile-content">
                  <div class="bio-section">
                    <textarea v-model="editForm.bio" class="edit-textarea edit-bio" placeholder="Tell people about yourself..." rows="3"></textarea>
                  </div>

                  <div class="contact-section">
                    <div class="contact-grid">
                      <div class="contact-item">
                        <div class="contact-icon-wrapper">
                          <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div class="contact-details">
                          <span class="contact-label">Email</span>
                          <input v-model="editForm.email" class="edit-input edit-contact" placeholder="john@example.com" type="email" />
                        </div>
                      </div>

                      <div class="contact-item">
                        <div class="contact-icon-wrapper">
                          <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                        </div>
                        <div class="contact-details">
                          <span class="contact-label">Phone</span>
                          <div class="phone-field-container">
                            <span class="country-prefix">+1</span>
                            <input v-model="editForm.phoneNumber" @input="formatEditPhoneNumber" class="edit-input edit-contact phone-edit" placeholder="(555) 123-4567" type="tel" maxlength="14" />
                          </div>
                        </div>
                      </div>

                      <div class="contact-item">
                        <div class="contact-icon-wrapper">
                          <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                          </svg>
                        </div>
                        <div class="contact-details">
                          <span class="contact-label">Website</span>
                          <input v-model="editForm.website" class="edit-input edit-contact" placeholder="https://www.example.com" type="url" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="edit-actions">
                  <button @click="saveProfile" class="save-profile-btn">Save Changes</button>
                  <button @click="cancelEdit" class="cancel-edit-btn">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar Navigation -->
          <div class="profile-sidebar">
            <div class="sidebar-section">
              <div class="profile-options">
                <h3 class="sidebar-title">Card Options</h3>

                <!-- Edit Card Button -->
                <div class="option-group">
                  <button @click="toggleEditMode" class="edit-card-btn">
                    <svg class="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {{ editMode ? 'View Card' : 'Edit Card' }}
                  </button>
                </div>

                <!-- Public URL Section -->
                <div class="option-group">
                  <div class="option-header">
                    <label class="option-label">Public URL</label>
                    <div class="option-actions">
                      <button v-if="!isEditingSlug" @click="startEditing" class="edit-btn">
                        <svg class="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <div v-else class="edit-actions-inline">
                        <button @click="cancelEditing" class="cancel-btn-inline" :disabled="isUpdatingSlug">
                          Cancel
                        </button>
                        <button @click="saveSlug" class="save-btn-inline" :disabled="isUpdatingSlug">
                          {{ isUpdatingSlug ? 'Saving...' : 'Save' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="url-container">
                    <!-- Display Mode -->
                    <div v-if="!isEditingSlug" class="url-display">
                      <a :href="publicProfileUrl" target="_blank" class="url-link">{{ publicProfileUrl }}</a>
                    </div>

                    <!-- Edit Mode -->
                    <div v-else class="url-edit-mode">
                      <div class="url-edit-display">
                        <span class="url-prefix">{{ urlPrefix }}</span><input
                          v-model="editableSlug"
                          :disabled="isUpdatingSlug"
                          class="slug-input-simple"
                          placeholder="your-slug"
                          @keydown.enter="saveSlug"
                          @keydown.escape="cancelEditing"
                        />
                      </div>
                      <div v-if="slugError" class="slug-error">
                        {{ slugError }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Public/Private Toggle -->
                <div class="option-group">
                  <div class="option-header">
                    <label class="option-label">Visibility</label>
                  </div>
                  <div class="visibility-toggle">
                    <div class="toggle-option" :class="{ active: !profile.public }" @click="setVisibility(false)">
                      <input
                        type="radio"
                        :checked="!profile.public"
                        :disabled="isUpdatingVisibility"
                        class="toggle-radio"
                      />
                      <span class="toggle-label">Private</span>
                    </div>
                    <div class="toggle-option" :class="{ active: profile.public }" @click="setVisibility(true)">
                      <input
                        type="radio"
                        :checked="profile.public"
                        :disabled="isUpdatingVisibility"
                        class="toggle-radio"
                      />
                      <span class="toggle-label">Public</span>
                    </div>
                  </div>
                  <div class="visibility-description">
                    <span v-if="profile.public" class="description-text">Your profile is visible to everyone.</span>
                    <span v-else class="description-text">Only you can see this profile.</span>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import NavBar from '../components/NavBar.vue'

const { makeAuthenticatedRequest, user } = useAuth()

const isLoading = ref(true)
const isCreating = ref(false)
const profile = ref<any>(null)
const createError = ref('')
const editMode = ref(false)

const form = reactive({
  name: '',
  job_title: '',
  company: '',
  email: '',
  phoneNumber: '',
  location: '',
  website: '',
  bio: '',
  public: false
})

// Edit form for live preview
const editForm = reactive({
  name: '',
  job_title: '',
  company: '',
  email: '',
  phoneNumber: '',
  location: '',
  website: '',
  bio: ''
})

const pictureFile = ref<File | null>(null)
const picturePreview = ref<string>('')
const isUploadingPicture = ref(false)
const pictureUploadInput = ref<HTMLInputElement | null>(null)
const showCopySuccess = ref(false)
const copySuccessType = ref('')
const urlCopied = ref(false)
const editableSlug = ref('')
const isUpdatingSlug = ref(false)
const isEditingSlug = ref(false)
const originalSlug = ref('')
const slugError = ref('')
const isUpdatingVisibility = ref(false)
const isDeletingPicture = ref(false)

// Computed property for URL prefix
const urlPrefix = computed(() => {
  return `${window.location.origin}/cards/`
})

// Computed property for public profile URL
const publicProfileUrl = computed(() => {
  if (!profile.value?.slug) return ''
  return `${window.location.origin}/cards/${profile.value.slug}`
})

// Mobile detection
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in window) ||
         (window.innerWidth <= 768)
}

// Phone number formatting
const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove all non-digits

  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{3})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{3})/, '($1)')
  }

  form.phoneNumber = value
}

// Phone number formatting for edit mode
const formatEditPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove all non-digits
  
  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{3})/, '($1) $2')
  } else if (value.length > 0) {
    value = value.replace(/(\d{3})/, '($1)')
  }
  
  editForm.phoneNumber = value
}

// Save profile changes
const saveProfile = async () => {
  if (!profile.value?.slug) return
  
  try {
    // Prepare form data with formatted phone number
    const formData: any = { ...editForm }
    
    // Handle phone number formatting
    if (editForm.phoneNumber) {
      formData.phone = `+1${editForm.phoneNumber.replace(/\D/g, '')}`
    }
    delete formData.phoneNumber

    // Filter out empty string fields
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '')
    )

    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(filteredData)
      }
    )

    if (response.ok) {
      const updatedProfile = await response.json()
      profile.value = updatedProfile
      editMode.value = false // Exit edit mode
      console.log('Profile updated successfully')
    } else {
      console.error('Failed to update profile:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Network error updating profile:', error)
  }
}

// Cancel editing
const cancelEdit = () => {
  editMode.value = false
}

// Delete profile picture
const deletePicture = async () => {
  if (!profile.value?.slug) return
  
  isDeletingPicture.value = true
  
  try {
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/picture/`,
      {
        method: 'DELETE'
      }
    )

    if (response.ok) {
      // Remove picture from profile
      profile.value.picture = null
      console.log('Profile picture deleted successfully')
    } else {
      console.error('Failed to delete profile picture:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Network error deleting profile picture:', error)
  } finally {
    isDeletingPicture.value = false
  }
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
    // Could add error state here if needed
  }
}

// Toggle edit mode
const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (editMode.value && profile.value) {
    // Initialize edit form with current profile data
    editForm.name = profile.value.name || ''
    editForm.job_title = profile.value.job_title || ''
    editForm.company = profile.value.company || ''
    editForm.email = profile.value.email || ''
    editForm.phoneNumber = profile.value.phone_fmt || profile.value.phone_raw || ''
    editForm.location = profile.value.location || ''
    editForm.website = profile.value.website || ''
    editForm.bio = profile.value.bio || ''
  }
}

// Start editing slug
const startEditing = () => {
  isEditingSlug.value = true
  originalSlug.value = profile.value.slug
  editableSlug.value = profile.value.slug
  slugError.value = '' // Clear any previous errors
}

// Cancel editing
const cancelEditing = () => {
  isEditingSlug.value = false
  editableSlug.value = originalSlug.value
  slugError.value = '' // Clear any errors
}

// Set profile visibility
const setVisibility = async (isPublic: boolean) => {
  if (!profile.value?.slug || profile.value.public === isPublic) return

  const previousValue = profile.value.public
  profile.value.public = isPublic // Optimistically update UI
  isUpdatingVisibility.value = true

  try {
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({ public: isPublic })
      }
    )

    if (response.ok) {
      const updatedProfile = await response.json()
      profile.value = updatedProfile
      console.log('Profile visibility updated successfully to:', isPublic ? 'public' : 'private')
    } else {
      console.error('Failed to update profile visibility:', response.status, response.statusText)
      // Revert the change on error
      profile.value.public = previousValue
    }
  } catch (error) {
    console.error('Network error updating profile visibility:', error)
    // Revert the change on error
    profile.value.public = previousValue
  } finally {
    isUpdatingVisibility.value = false
  }
}

// Save slug
const saveSlug = async () => {
  if (!profile.value?.slug || !editableSlug.value) return

  // Don't update if the slug hasn't changed
  if (editableSlug.value === profile.value.slug) {
    isEditingSlug.value = false
    return
  }

  // Basic slug validation - only allow alphanumeric characters and hyphens
  const slugRegex = /^[a-zA-Z0-9-]+$/
  if (!slugRegex.test(editableSlug.value)) {
    slugError.value = 'Only letters, numbers, and hyphens are allowed.'
    return
  }

  slugError.value = '' // Clear any previous errors
  isUpdatingSlug.value = true

  try {
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({ slug: editableSlug.value })
      }
    )

    if (response.ok) {
      const updatedProfile = await response.json()
      profile.value = updatedProfile
      originalSlug.value = updatedProfile.slug
      isEditingSlug.value = false
      slugError.value = '' // Clear any errors on success
      console.log('Slug updated successfully')
    } else if (response.status === 400) {
      const errorData = await response.json()
      slugError.value = 'This URL is already taken. Please try a different one.'
      console.error('Slug update failed - slug may already be in use:', errorData)
    } else {
      slugError.value = 'Failed to update URL. Please try again.'
      console.error('Failed to update slug:', response.status, response.statusText)
    }
  } catch (error) {
    slugError.value = 'Network error. Please check your connection and try again.'
    console.error('Network error updating slug:', error)
  } finally {
    isUpdatingSlug.value = false
  }
}

// Update slug functionality (legacy - keeping for compatibility)
const updateSlug = async () => {
  if (!profile.value?.slug || !editableSlug.value) return

  // Don't update if the slug hasn't changed
  if (editableSlug.value === profile.value.slug) return

  // Basic slug validation - only allow alphanumeric characters and hyphens
  const slugRegex = /^[a-zA-Z0-9-]+$/
  if (!slugRegex.test(editableSlug.value)) {
    console.error('Invalid slug format. Only letters, numbers, and hyphens are allowed.')
    editableSlug.value = profile.value.slug // Reset to original
    return
  }

  isUpdatingSlug.value = true

  try {
    const response = await makeAuthenticatedRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({ slug: editableSlug.value })
      }
    )

    if (response.ok) {
      const updatedProfile = await response.json()
      profile.value = updatedProfile
      console.log('Slug updated successfully')
    } else if (response.status === 400) {
      const errorData = await response.json()
      console.error('Slug update failed - slug may already be in use:', errorData)
      editableSlug.value = profile.value.slug // Reset to original
    } else {
      console.error('Failed to update slug:', response.status, response.statusText)
      editableSlug.value = profile.value.slug // Reset to original
    }
  } catch (error) {
    console.error('Network error updating slug:', error)
    editableSlug.value = profile.value.slug // Reset to original
  } finally {
    isUpdatingSlug.value = false
  }
}

const fetchProfile = async () => {
  try {
    // Get user ID from auth context
    const currentUser = user.value

    // The user ID is nested in the response structure
    const userId = currentUser?.data?.user?.id
    if (!userId) {
      console.error('No user ID available. User data:', currentUser)
      isLoading.value = false
      return
    }

    const response = await makeAuthenticatedRequest(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/?user_id=${userId}`, {
      method: 'GET'
    })

    if (response.ok) {
      const data = await response.json()

      // Handle paginated response structure
      if (data && data.items && Array.isArray(data.items)) {
        if (data.items.length > 0) {
          profile.value = data.items[0] // Get the first (and should be only) profile
          editableSlug.value = profile.value.slug // Initialize editable slug
          originalSlug.value = profile.value.slug // Initialize original slug
        }
      }
    } else {
      console.error('Profile API returned error:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePictureSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      createError.value = 'Profile picture must be less than 10MB'
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      createError.value = 'Please select an image file'
      return
    }

    pictureFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      picturePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removePicturePreview = () => {
  pictureFile.value = null
  picturePreview.value = ''
  const input = document.getElementById('picture') as HTMLInputElement
  if (input) input.value = ''
}

const triggerPictureUpload = () => {
  if (pictureUploadInput.value) {
    pictureUploadInput.value.click()
  }
}

const makeFileUploadRequest = async (url: string, formData: FormData) => {
  // Get CSRF token for authentication
  const cookies = document.cookie.split(';')
  let csrfToken = ''
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrftoken') {
      csrfToken = value
      break
    }
  }

  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
      // Don't set Content-Type - let browser set it for multipart/form-data
    },
    body: formData
  })
}

const handleProfilePictureUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file || !profile.value) return

  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    createError.value = 'Profile picture must be less than 10MB'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    createError.value = 'Please select an image file'
    return
  }

  isUploadingPicture.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await makeFileUploadRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${profile.value.slug}/picture/`,
      formData
    )

    if (response.ok) {
      const data = await response.json()
      // Update the profile with the new picture URL
      profile.value.picture = data.url
      createError.value = '' // Clear any previous errors
    } else {
      createError.value = 'Failed to upload picture. Please try again.'
    }
  } catch (error) {
    console.error('Picture upload error:', error)
    createError.value = 'Network error. Please try again.'
  } finally {
    isUploadingPicture.value = false
    // Reset the input
    if (target) target.value = ''
  }
}

const uploadPicture = async (slug: string) => {
  if (!pictureFile.value) return null

  isUploadingPicture.value = true

  try {
    const formData = new FormData()
    formData.append('file', pictureFile.value)

    const response = await makeFileUploadRequest(
      `${import.meta.env.VITE_API_BASE_URL}/api/profiles/${slug}/picture/`,
      formData
    )

    if (response.ok) {
      const data = await response.json()
      return data.url
    } else {
      throw new Error('Failed to upload picture')
    }
  } catch (error) {
    console.error('Picture upload error:', error)
    throw error
  } finally {
    isUploadingPicture.value = false
  }
}

const handleCreateProfile = async () => {
  createError.value = ''
  isCreating.value = true

  try {
    // Prepare form data with formatted phone number
    const formData: any = { ...form }
    
    // Handle phone number formatting
    if (form.phoneNumber) {
      formData.phone = `+1${form.phoneNumber.replace(/\D/g, '')}`
    }
    delete formData.phoneNumber

    // Filter out empty string fields
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '')
    )

    const response = await makeAuthenticatedRequest(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/`, {
      method: 'POST',
      body: JSON.stringify(filteredData)
    })

    if (response.ok) {
      const data = await response.json()

      // Upload picture if one was selected
      if (pictureFile.value) {
        try {
          const pictureUrl = await uploadPicture(data.slug)
          data.picture = pictureUrl
        } catch (error) {
          console.error('Failed to upload picture:', error)
          createError.value = 'Profile created but picture upload failed'
        }
      }

      profile.value = data
      // Reset form
      Object.keys(form).forEach(key => {
        form[key as keyof typeof form] = key === 'public' ? false : ''
      })
      removePicturePreview()
    } else {
      const errorData = await response.json()
      createError.value = errorData.message || 'Failed to create profile. Please try again.'
    }
  } catch (error) {
    createError.value = 'Network error. Please check your connection and try again.'
  } finally {
    isCreating.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.card-container {
  min-height: calc(100vh - 4rem);
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
}

.loading-card {
  max-width: 400px;
  margin: 4rem auto;
  padding: 3rem;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.create-card-container {
  max-width: 640px;
  margin: 0 auto;
}

.create-card {
  padding: 3rem;
}

.create-card h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2.5rem;
  font-size: 16px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 400;
  font-family: inherit;
  transition: all 0.2s ease;
  background-color: white;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.phone-field-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.country-prefix {
  font-size: 15px;
  font-weight: 500;
  color: var(--gray-700);
}

.edit-card-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-card-btn:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.edit-card-btn .edit-icon {
  width: 1rem;
  height: 1rem;
}

/* Edit Mode Styles */
.profile-edit-mode .profile-header {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.edit-input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: inherit;
  font-weight: inherit;
  color: var(--gray-800);
  width: 100%;
  transition: all 0.2s ease;
}

.edit-input:focus {
  background: white;
  border-color: rgba(255, 255, 255, 0.8);
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.edit-input::placeholder {
  color: var(--gray-500);
}

.edit-name {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
}

.job-company-edit {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.edit-job, .edit-company {
  font-size: 1.25rem;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.9);
}

.separator {
  color: white;
  font-size: 1.25rem;
  font-weight: 400;
}

.edit-location {
  font-size: 1rem;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.9);
}

.edit-textarea {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  font-size: 15px;
  color: var(--gray-700);
  resize: vertical;
  min-height: 100px;
  width: 100%;
  font-family: inherit;
  line-height: 1.6;
}

.edit-textarea:focus {
  background: white;
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.edit-contact {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 15px;
  color: var(--gray-800);
  flex: 1;
}

.edit-contact:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.phone-edit {
  margin-left: 0.5rem;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.save-profile-btn {
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-profile-btn:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.cancel-edit-btn {
  background: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-edit-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}



.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.form-checkbox {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 4px;
  border: 1.5px solid var(--gray-300);
  cursor: pointer;
}

.checkbox-text {
  font-size: 15px;
  color: var(--gray-700);
  font-weight: 500;
}

.create-btn {
  padding: 16px 32px;
  margin-top: 1rem;
  font-size: 16px;
  font-weight: 600;
}

.error-message {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: var(--error-500);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #fecaca;
  margin-top: 1rem;
}

.picture-upload-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.picture-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--gray-200);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-preview-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.remove-preview-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.remove-preview-btn svg {
  width: 1rem;
  height: 1rem;
}

.picture-upload-area {
  position: relative;
}

.picture-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
}

.picture-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--gray-50);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
  font-weight: 500;
}

.picture-upload-label:hover {
  border-color: var(--primary-400);
  background: var(--primary-25);
  color: var(--primary-700);
}

.upload-icon {
  width: 2rem;
  height: 2rem;
}

.hidden-file-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.avatar-image-container {
  position: relative;
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 50%;
}

.profile-edit-mode .profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.overlay-icons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.overlay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.overlay-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.overlay-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.overlay-btn.delete-btn:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.9);
}

.overlay-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.upload-overlay-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.upload-spinner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.profile-display {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-layout {
  display: grid;
  grid-template-columns: 650px minmax(450px, 1fr);
  gap: 2rem;
  align-items: start;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
}

.profile-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-label {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.option-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.visibility-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-option:hover {
  border-color: var(--primary-300);
  background: var(--primary-25);
}

.toggle-option.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
  color: var(--primary-700);
}

.toggle-radio {
  margin: 0;
}

.toggle-label {
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.visibility-description {
  margin-top: 0.25rem;
}

.description-text {
  font-size: 13px;
  color: var(--gray-600);
  font-style: italic;
}


.edit-actions-inline {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.cancel-btn-inline, .save-btn-inline {
  height: 1.75rem;
  padding: 0 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.cancel-btn-inline {
  background: transparent;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
}

.cancel-btn-inline:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.save-btn-inline {
  background: var(--primary-600);
  border: 1px solid var(--primary-600);
  color: white;
}

.save-btn-inline:hover:not(:disabled) {
  background: var(--primary-700);
  border-color: var(--primary-700);
}

.cancel-btn-inline:disabled, .save-btn-inline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--primary-100);
  border: 1px solid var(--primary-300);
  border-radius: var(--radius-sm);
  color: var(--primary-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: var(--primary-200);
  border-color: var(--primary-400);
  color: var(--primary-700);
}

.edit-icon {
  width: 1rem;
  height: 1rem;
}

.url-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.url-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 20px;
  font-weight: 500;
}

.url-link {
  flex: 1;
  font-size: 14px;
  color: var(--primary-600);
  word-break: break-all;
  line-height: 1.4;
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: inherit;
  font-weight: 500;
  border-bottom: 2px solid transparent;
}

.url-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

.url-text {
  flex: 1;
  font-size: 14px;
  color: var(--gray-700);
  word-break: break-all;
  line-height: 1.4;
}

.url-edit-mode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.url-edit-display {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  line-height: 1.4;
  font-family: inherit;
  min-height: 20px;
  white-space: nowrap;
  overflow: hidden;
}

.url-prefix {
  color: var(--gray-700);
  font-size: 14px;
  line-height: 1.4;
  font-family: inherit;
  font-weight: 500;
  margin-right: 4px;
}

.slug-input-simple {
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--gray-800);
  background: transparent;
  min-width: 0;
  border-bottom: 2px solid var(--primary-500);
  padding: 0;
  margin: 0;
  line-height: 1.4;
  font-family: inherit;
  font-weight: 500;
  vertical-align: baseline;
}

.slug-input-simple:disabled {
  color: var(--gray-500);
  cursor: not-allowed;
}

.slug-input-simple:focus {
  border-bottom-color: var(--primary-600);
}

.slug-error {
  font-size: 12px;
  color: #dc2626;
  margin-top: 0.25rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
}

.cancel-btn, .save-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: transparent;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
}

.cancel-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.save-btn {
  background: var(--primary-600);
  border: 1px solid var(--primary-600);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-700);
  border-color: var(--primary-700);
}

.cancel-btn:disabled, .save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.url-actions {
  display: flex;
  gap: 0.5rem;
}

.copy-url-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
}

.copy-url-btn:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  color: var(--primary-600);
}

.copy-url-btn.copied {
  background: var(--success-100);
  border-color: var(--success-300);
  color: var(--success-600);
}

.visit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--primary-100);
  border: 1px solid var(--primary-300);
  border-radius: var(--radius-sm);
  color: var(--primary-600);
  text-decoration: none;
  transition: all 0.2s ease;
}

.visit-btn:hover {
  background: var(--primary-200);
  border-color: var(--primary-400);
  color: var(--primary-700);
}

.copy-icon,
.check-icon,
.external-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.profile-main {
  min-width: 0;
}

.profile-card {
  padding: 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
  border: 1px solid var(--primary-100);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  margin-bottom: 0;
}

.profile-avatar {
  flex-shrink: 0;
  position: relative;
  transition: transform 0.2s ease;
}

.profile-avatar.uploading {
  pointer-events: none;
}

/* Edit mode avatar styles */
.profile-edit-mode .profile-avatar {
  cursor: pointer;
}

.profile-edit-mode .profile-avatar:hover {
  transform: scale(1.05);
}

.avatar-placeholder {
  width: 6.5rem;
  height: 6.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-icon {
  width: 3.25rem;
  height: 3.25rem;
  color: white;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-info h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.title-company {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.job-company {
  font-size: 1.25rem;
  color: white;
  font-weight: 400;
  margin: 0;
}

.location {
  font-size: 1rem;
  color: white;
  font-weight: 300;
  margin: 0;
}


.profile-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.contact-section {
  margin: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.25rem;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 2px;
}

.contact-grid {
  display: grid;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
  position: relative;
}

.contact-item:hover {
  background: white;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.contact-item-hoverable:hover {
  background: var(--gray-25);
}

.copy-action {
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.copy-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: 0.5rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  color: var(--gray-600);
}

.copy-icon:hover {
  background: var(--primary-100);
  color: var(--primary-600);
  transform: scale(1.05);
}

.copy-icon:active {
  transform: scale(0.95);
}

.contact-item-hoverable:hover .copy-icon {
  opacity: 1;
}

.copy-icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.copy-success {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
  background: #dcfce7; /* Light green background */
  border-radius: 0.5rem;
  animation: copySuccess 0.3s ease-out;
  padding: 0 0.5rem;
  min-width: fit-content;
}

.success-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #16a34a; /* Green icon */
}

.success-text {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: #16a34a !important; /* Fallback green */
  color: var(--success-600) !important;
}

@keyframes copySuccess {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.contact-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.contact-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-value {
  font-size: 15px;
  color: var(--gray-800);
  font-weight: 500;
  text-decoration: none;
  word-break: break-all;
}

.contact-value:hover {
  color: var(--primary-600);
}


.bio-section {
  margin: 0;
}

.bio-text {
  color: var(--gray-700);
  line-height: 1.6;
  font-size: 15px;
  background: var(--gray-50);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary-500);
}

.profile-footer {
  display: flex;
  justify-content: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--gray-200);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-lg);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-public {
  background: linear-gradient(135deg, var(--success-500), #059669);
  color: white;
}

.status-private {
  background: linear-gradient(135deg, var(--gray-500), var(--gray-600));
  color: white;
}

.status-icon {
  width: 1rem;
  height: 1rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.btn-outline {
  background: transparent;
  color: var(--gray-700);
  border: 1.5px solid var(--gray-300);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.btn-outline:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 1200px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .profile-sidebar {
    order: 2;
  }

  .profile-main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .card-container {
    padding: 1rem;
  }

  .create-card {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .sidebar-section {
    padding: 1.25rem;
  }

  .visibility-toggle {
    flex-direction: column;
    gap: 0.375rem;
  }

  .toggle-option {
    justify-content: center;
  }

  .url-prefix,
  .slug-input {
    font-size: 12px;
  }

  .url-prefix {
    padding: 0.625rem 0.5rem;
  }

  .slug-input {
    padding: 0.625rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .profile-info h1 {
    font-size: 1.75rem;
  }

  .job-title {
    font-size: 1.125rem;
  }

  .company {
    font-size: 1rem;
  }

  .profile-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .contact-item {
    padding: 0.75rem 0.625rem;
  }

  .contact-details {
    gap: 0.125rem;
  }

  .contact-value {
    font-size: 14px;
  }

  .card-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-outline {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 1.25rem;
  }

  .profile-content {
    padding: 1.25rem;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: center;
  }

  .contact-details {
    align-items: center;
  }
}

</style>
