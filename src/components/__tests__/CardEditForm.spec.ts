import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import CardEditForm from '../CardEditForm.vue'
import type { Card } from '../../composables/useCards'

describe('CardEditForm', () => {
  let wrapper: VueWrapper<any>

  const mockCard: Card = {
    uuid: 'test-uuid-123',
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'Tech Corp',
    email: 'john@example.com',
    phone_fmt: '+1 (555) 123-4567',
    phone_raw: '+15551234567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    bio: 'Full-stack developer with 10 years of experience',
    picture: 'https://example.com/picture.jpg',
    slug: 'john-doe',
    public: true
  }

  const defaultProps = {
    card: null,
    isCreatingNew: false,
    isPictureMarkedForDeletion: false,
    saveError: '',
    hasPendingChanges: false,
    showSaveSuccess: false
  }

  beforeEach(() => {
    // Reset any mocks
    vi.clearAllMocks()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000'
      },
      writable: true
    })
    // Mock URL.createObjectURL and URL.revokeObjectURL for jsdom
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  describe('Component Initialization', () => {
    it('should mount successfully with default props', () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should initialize with all sections collapsed', () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })
      const sections = wrapper.findAll('.section-content')
      expect(sections.length).toBe(0)
    })

    it('should display correct header for new card creation', () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          isCreatingNew: true
        }
      })
      expect(wrapper.find('h3').text()).toBe('Create Card')
    })

    it('should display correct header for editing existing card', () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })
      expect(wrapper.find('h3').text()).toBe('Edit Card')
    })
  })

  describe('Form Data Binding', () => {
    it('should populate form fields with card data', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })
      
      // Expand basic section to see fields (it's the second section)
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect(nameInput.exists()).toBe(true)
      expect((nameInput.element as HTMLInputElement).value).toBe('John Doe')
    })

    it('should clear form when card is null and not creating new', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Update props to null card
      await wrapper.setProps({ card: null })
      await nextTick()

      // Expand basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('')
    })

    it('should emit updateForm when form fields change', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      await nameInput.setValue('Jane Smith')
      
      // Check that updateForm was emitted
      const updateEvents = wrapper.emitted('updateForm')
      expect(updateEvents).toBeTruthy()
      expect(updateEvents?.length).toBeGreaterThan(0)
      
      const lastEvent = updateEvents?.[updateEvents.length - 1]
      expect(lastEvent?.[0]).toMatchObject({
        name: 'Jane Smith'
      })
    })

    it('should handle phone number field correctly', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand contact section
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      const phoneInput = wrapper.find('input[placeholder="555-123-4567"]')
      expect((phoneInput.element as HTMLInputElement).value).toBe('+1 (555) 123-4567')
    })
  })

  describe('Picture Upload', () => {
    it('should show upload placeholder when no picture exists', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      expect(wrapper.find('.upload-placeholder').exists()).toBe(true)
      expect(wrapper.find('.upload-text').text()).toBe('Upload profile picture')
    })

    it('should show picture preview when card has picture', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      expect(wrapper.find('.picture-preview').exists()).toBe(true)
      expect(wrapper.find('.preview-image').attributes('src')).toBe('https://example.com/picture.jpg')
    })

    it('should trigger file input when upload button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      const fileInput = wrapper.find('input[type="file"]').element as HTMLInputElement
      const clickSpy = vi.spyOn(fileInput, 'click')

      await wrapper.find('.upload-btn').trigger('click')
      expect(clickSpy).toHaveBeenCalled()
    })

    it('should emit uploadPicture event when file is selected', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = wrapper.find('input[type="file"]')
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false
      })

      await fileInput.trigger('change')
      await nextTick()
      
      const uploadEvents = wrapper.emitted('uploadPicture')
      expect(uploadEvents).toBeTruthy()
      expect(uploadEvents?.[0]?.[0]).toEqual(file)
    })

    it('should reject files larger than 10MB', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Create a file larger than 10MB
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const fileInput = wrapper.find('input[type="file"]')
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [largeFile],
        writable: false
      })

      await fileInput.trigger('change')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Profile picture must be less than 10MB')
      expect(wrapper.emitted('uploadPicture')).toBeFalsy()
      
      consoleErrorSpy.mockRestore()
    })

    it('should reject non-image files', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const fileInput = wrapper.find('input[type="file"]')
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [textFile],
        writable: false
      })

      await fileInput.trigger('change')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Please select an image file')
      expect(wrapper.emitted('uploadPicture')).toBeFalsy()
      
      consoleErrorSpy.mockRestore()
    })

    it('should show delete button for existing card picture', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      const deleteBtn = wrapper.find('.picture-actions .delete-btn')
      expect(deleteBtn.exists()).toBe(true)
      expect(deleteBtn.text()).toBe('Delete')
    })

    it('should emit deletePicture when delete button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      await wrapper.find('.picture-actions .delete-btn').trigger('click')
      
      expect(wrapper.emitted('deletePicture')).toBeTruthy()
    })

    it('should hide picture preview when marked for deletion', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard,
          isPictureMarkedForDeletion: true
        }
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      expect(wrapper.find('.picture-preview').exists()).toBe(false)
      expect(wrapper.find('.upload-placeholder').exists()).toBe(true)
    })
  })

  describe('Save Functionality', () => {
    it('should disable save button when no pending changes', () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          hasPendingChanges: false
        }
      })

      const saveBtn = wrapper.find('.save-btn')
      expect(saveBtn.attributes('disabled')).toBeDefined()
    })

    it('should enable save button when pending changes exist', () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          hasPendingChanges: true
        }
      })

      const saveBtn = wrapper.find('.save-btn')
      expect(saveBtn.attributes('disabled')).toBeUndefined()
    })

    it('should emit save event when save button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          hasPendingChanges: true
        }
      })

      await wrapper.find('.save-btn').trigger('click')
      expect(wrapper.emitted('save')).toBeTruthy()
    })

    it('should show save success message when showSaveSuccess is true', () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          showSaveSuccess: true
        }
      })

      expect(wrapper.find('.save-success').exists()).toBe(true)
      expect(wrapper.find('.save-success').text()).toBe('Card saved')
    })

    it('should display save error when provided', () => {
      const errorMessage = 'Failed to save card'
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          saveError: errorMessage
        }
      })

      expect(wrapper.find('.save-error').exists()).toBe(true)
      expect(wrapper.find('.save-error span').text()).toBe(errorMessage)
    })

    it('should emit clearSaveError when error close button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          saveError: 'Test error'
        }
      })

      await wrapper.find('.error-close-btn').trigger('click')
      expect(wrapper.emitted('clearSaveError')).toBeTruthy()
    })
  })

  describe('Section Collapse/Expand', () => {
    it('should toggle picture section when header is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      const pictureSection = wrapper.findAll('.section-title')[0]
      
      // Initially collapsed
      expect(wrapper.find('.picture-upload-section').exists()).toBe(false)
      
      // Click to expand
      await pictureSection.trigger('click')
      await nextTick()
      expect(wrapper.find('.picture-upload-section').exists()).toBe(true)
      
      // Click to collapse
      await pictureSection.trigger('click')
      await nextTick()
      expect(wrapper.find('.picture-upload-section').exists()).toBe(false)
    })

    it('should rotate collapse icon when section is expanded', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      const pictureSection = wrapper.findAll('.section-title')[0]
      const icon = pictureSection.find('.collapse-icon')
      
      // Initially not rotated
      expect(icon.classes()).not.toContain('rotate')
      
      // Click to expand
      await pictureSection.trigger('click')
      await nextTick()
      expect(icon.classes()).toContain('rotate')
    })

    it('should allow multiple sections to be open simultaneously', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      const sections = wrapper.findAll('.section-title')
      
      // Open all sections
      for (const section of sections) {
        await section.trigger('click')
      }
      await nextTick()
      
      // Check all sections are open
      expect(wrapper.find('.picture-upload-section').exists()).toBe(true)
      expect(wrapper.findAll('.form-group').length).toBeGreaterThan(0)
    })
  })

  describe('Visibility Toggle', () => {
    it('should toggle between public and private', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: { ...mockCard, public: false }
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      const privateOption = wrapper.findAll('.toggle-option')[0]
      const publicOption = wrapper.findAll('.toggle-option')[1]
      
      // Initially private
      expect(privateOption.classes()).toContain('active')
      expect(publicOption.classes()).not.toContain('active')
      
      // Click public
      await publicOption.trigger('click')
      
      const updateEvents = wrapper.emitted('updateForm')
      const lastEvent = updateEvents?.[updateEvents.length - 1]
      expect(lastEvent?.[0]).toMatchObject({
        public: true
      })
    })

    it('should display correct visibility description', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: { ...mockCard, public: true }
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.description-text').text()).toBe('Your card is visible to everyone.')
      
      // Toggle to private
      await wrapper.findAll('.toggle-option')[0].trigger('click')
      await nextTick()
      
      expect(wrapper.find('.description-text').text()).toBe('Only you can see this card.')
    })
  })

  describe('URL Slug Handling', () => {
    it('should display URL prefix correctly', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.url-prefix').text()).toBe('http://localhost:3000/cards/')
    })

    it('should show URL preview when slug is entered', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      const slugInput = wrapper.find('.slug-input')
      await slugInput.setValue('my-custom-url')
      await nextTick()

      expect(wrapper.find('.url-preview').exists()).toBe(true)
      expect(wrapper.find('.url-link').text()).toBe('http://localhost:3000/cards/my-custom-url')
    })

    it('should update slug when input changes', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      const slugInput = wrapper.find('.slug-input')
      await slugInput.setValue('new-slug')
      
      const updateEvents = wrapper.emitted('updateForm')
      const lastEvent = updateEvents?.[updateEvents.length - 1]
      expect(lastEvent?.[0]).toMatchObject({
        slug: 'new-slug'
      })
    })

    it('should not show URL preview when slug is empty', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.url-preview').exists()).toBe(false)
    })
  })

  describe('Delete Card', () => {
    it('should not show delete section for new cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          isCreatingNew: true
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.delete-card-section').exists()).toBe(false)
    })

    it('should show delete section for existing cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.delete-card-section').exists()).toBe(true)
      expect(wrapper.find('.delete-card-btn').text()).toContain('Delete Card')
    })

    it('should show delete confirmation modal when delete button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      expect(wrapper.find('.modal-header h3').text()).toBe('Delete Card')
    })

    it('should close modal when cancel is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      await wrapper.find('.modal-cancel-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should close modal when clicking outside', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      await wrapper.find('.modal-overlay').trigger('click')
      await nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should not close modal when clicking inside content', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      await wrapper.find('.modal-content').trigger('click')
      await nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('should emit deleteCard when confirm delete is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      await wrapper.find('.modal-delete-btn').trigger('click')
      
      expect(wrapper.emitted('deleteCard')).toBeTruthy()
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should close modal when X button is clicked', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      // Expand options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      await wrapper.find('.delete-card-btn').trigger('click')
      await nextTick()

      await wrapper.find('.modal-close-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })
  })

  describe('Form Field Validation', () => {
    it('should handle email field with email type', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand contact section
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      const emailInput = wrapper.find('input[placeholder="john@example.com"]')
      expect(emailInput.attributes('type')).toBe('email')
    })

    it('should handle phone field with tel type', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand contact section
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      const phoneInput = wrapper.find('input[placeholder="555-123-4567"]')
      expect(phoneInput.attributes('type')).toBe('tel')
    })

    it('should handle website field with url type', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand contact section
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      const websiteInput = wrapper.find('input[placeholder="https://www.example.com"]')
      expect(websiteInput.attributes('type')).toBe('url')
    })

    it('should handle bio field as textarea', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const bioTextarea = wrapper.find('textarea[placeholder="Tell people about yourself..."]')
      expect(bioTextarea.exists()).toBe(true)
      expect(bioTextarea.attributes('rows')).toBe('4')
    })
  })

  describe('Memory Management', () => {
    it('should clean up object URLs on unmount', async () => {
      wrapper = mount(CardEditForm, {
        props: defaultProps
      })

      // Expand picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      // Create a preview image
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = wrapper.find('input[type="file"]')
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false
      })

      await fileInput.trigger('change')
      await nextTick()

      // Unmount component
      wrapper.unmount()

      // Should have called revokeObjectURL (mocked in beforeEach)
      expect(global.URL.revokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle card with minimal data', async () => {
      const minimalCard: Card = {
        uuid: 'minimal-uuid'
      }

      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: minimalCard
        }
      })

      // Expand basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('')
    })

    it('should handle rapid prop changes', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard
        }
      })

      const differentCard: Card = {
        uuid: 'different-uuid',
        name: 'Jane Smith'
      }

      // Rapidly change props
      await wrapper.setProps({ card: null })
      await wrapper.setProps({ card: differentCard })
      await wrapper.setProps({ isCreatingNew: true })
      await wrapper.setProps({ isCreatingNew: false })
      await wrapper.setProps({ card: mockCard })

      // Should end up with the last card's data
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('John Doe')
    })

    it('should handle form submission with all fields empty', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          isCreatingNew: true,
          hasPendingChanges: true
        }
      })

      await wrapper.find('.save-btn').trigger('click')
      
      const saveEvents = wrapper.emitted('save')
      expect(saveEvents).toBeTruthy()
      expect(saveEvents?.length).toBe(1)
    })

    it('should handle form submission with all fields filled', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: mockCard,
          hasPendingChanges: true
        }
      })

      // Fill all fields with new data
      const sections = wrapper.findAll('.section-title')
      
      // Expand all sections and update fields
      for (let i = 1; i < sections.length; i++) {
        await sections[i].trigger('click')
      }
      await nextTick()

      await wrapper.find('input[placeholder="Enter your full name"]').setValue('New Name')
      await wrapper.find('input[placeholder="Software Engineer, Designer, etc."]').setValue('New Title')
      await wrapper.find('input[placeholder="Company name"]').setValue('New Company')
      
      await wrapper.find('.save-btn').trigger('click')
      
      const saveEvents = wrapper.emitted('save')
      expect(saveEvents).toBeTruthy()
    })

    it('should handle special characters in form fields', async () => {
      const specialCharsCard: Card = {
        uuid: 'special-uuid',
        name: 'John "The Developer" O\'Malley',
        bio: 'Developer & Designer <script>alert("xss")</script>',
        website: 'https://example.com?param=value&other=123'
      }

      wrapper = mount(CardEditForm, {
        props: {
          ...defaultProps,
          card: specialCharsCard
        }
      })

      // Expand sections
      await wrapper.findAll('.section-title')[1].trigger('click')
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      const bioTextarea = wrapper.find('textarea[placeholder="Tell people about yourself..."]')
      const websiteInput = wrapper.find('input[placeholder="https://www.example.com"]')

      expect((nameInput.element as HTMLInputElement).value).toBe('John "The Developer" O\'Malley')
      expect((bioTextarea.element as HTMLTextAreaElement).value).toBe('Developer & Designer <script>alert("xss")</script>')
      expect((websiteInput.element as HTMLInputElement).value).toBe('https://example.com?param=value&other=123')
    })
  })
})