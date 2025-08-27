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
                  placeholder="Software Engineer"
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
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  :disabled="isCreating"
                  placeholder="+1 (555) 123-4567"
                  class="form-input"
                />
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
              <label class="checkbox-label">
                <input
                  v-model="form.public"
                  type="checkbox"
                  :disabled="isCreating"
                  class="form-checkbox"
                />
                <span class="checkbox-text">Make my card public</span>
              </label>
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
        <div class="profile-card card">
          <div class="profile-header">
            <div class="profile-avatar">
              <div class="avatar-placeholder">
                <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            
            <div class="profile-info">
              <h1>{{ profile.name || 'Business Card' }}</h1>
              <div class="title-company">
                <p v-if="profile.job_title" class="job-title">{{ profile.job_title }}</p>
                <p v-if="profile.company" class="company">{{ profile.company }}</p>
              </div>
            </div>
          </div>

          <div class="profile-content">
            <div class="contact-section">
              <h3 class="section-title">Contact Information</h3>
              <div class="contact-grid">
                <div v-if="profile.email" class="contact-item">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Email</span>
                    <a :href="`mailto:${profile.email}`" class="contact-value">{{ profile.email }}</a>
                  </div>
                </div>

                <div v-if="profile.phone_fmt || profile.phone_raw" class="contact-item">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Phone</span>
                    <a :href="`tel:${profile.phone_raw || profile.phone_fmt}`" class="contact-value">
                      {{ profile.phone_fmt || profile.phone_raw }}
                    </a>
                  </div>
                </div>

                <div v-if="profile.location" class="contact-item">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Location</span>
                    <span class="contact-value">{{ profile.location }}</span>
                  </div>
                </div>

                <div v-if="profile.website" class="contact-item">
                  <div class="contact-icon-wrapper">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">Website</span>
                    <a :href="profile.website" target="_blank" rel="noopener noreferrer" class="contact-value">
                      {{ profile.website }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="profile.bio" class="bio-section">
              <h3 class="section-title">About</h3>
              <p class="bio-text">{{ profile.bio }}</p>
            </div>

            <div class="profile-footer">
              <span :class="['status-badge', profile.public ? 'status-public' : 'status-private']">
                <svg class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="profile.public" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                </svg>
                {{ profile.public ? 'Public Card' : 'Private Card' }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button @click="editMode = true" class="btn btn-primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit Card
          </button>
          <button class="btn btn-outline">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            Share Card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
  phone: '',
  location: '',
  website: '',
  bio: '',
  public: false
})

const fetchProfile = async () => {
  try {
    // Get user ID from auth context
    const currentUser = user.value
    console.log('Current user data:', currentUser) // Debug log
    
    // The user ID is nested in the response structure
    const userId = currentUser?.data?.user?.id
    if (!userId) {
      console.error('No user ID available. User data:', currentUser)
      isLoading.value = false
      return
    }

    console.log('Using user ID:', userId) // Debug log

    const response = await makeAuthenticatedRequest(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/?user_id=${userId}`, {
      method: 'GET'
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Profile API response:', data) // Debug log
      
      // Handle paginated response structure
      if (data && data.items && Array.isArray(data.items)) {
        console.log('Found paginated response with', data.count, 'total items')
        if (data.items.length > 0) {
          profile.value = data.items[0] // Get the first (and should be only) profile
          console.log('Found profile:', profile.value) // Debug log
          console.log('Profile fields:', {
            name: profile.value.name,
            email: profile.value.email,
            phone_fmt: profile.value.phone_fmt,
            phone_raw: profile.value.phone_raw,
            company: profile.value.company,
            job_title: profile.value.job_title,
            location: profile.value.location,
            bio: profile.value.bio,
            public: profile.value.public
          }) // Debug profile fields
        } else {
          console.log('No profiles found in paginated response') // Debug log
        }
      } else {
        console.log('Unexpected response format:', data)
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

const handleCreateProfile = async () => {
  createError.value = ''
  isCreating.value = true

  try {
    const response = await makeAuthenticatedRequest(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/`, {
      method: 'POST',
      body: JSON.stringify(form)
    })

    if (response.ok) {
      const data = await response.json()
      profile.value = data
      // Reset form
      Object.keys(form).forEach(key => {
        form[key as keyof typeof form] = key === 'public' ? false : ''
      })
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
  padding: 2rem;
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
  max-width: 800px;
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

.profile-display {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  padding: 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
  border: 2px solid var(--primary-100);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: white;
  margin-bottom: 0;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-icon {
  width: 2.5rem;
  height: 2.5rem;
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

.job-title {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin: 0;
}

.company {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin: 0;
}

.profile-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.contact-section {
  margin: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
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
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.contact-item:hover {
  background: white;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
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
  line-height: 1.7;
  font-size: 15px;
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary-500);
}

.profile-footer {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
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

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem;
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
    padding: 2rem;
    gap: 2rem;
  }

  .contact-item {
    padding: 1rem 0.75rem;
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
    padding: 1.5rem;
  }

  .profile-content {
    padding: 1.5rem;
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