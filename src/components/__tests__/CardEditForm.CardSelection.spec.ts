import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import CardEditForm from '../CardEditForm.vue'
import type { Card } from '../../composables/useCards'

describe('CardEditForm - Card Selection Tests', () => {
  let wrapper: VueWrapper<any>

  const card1: Card = {
    uuid: 'card-1',
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'Tech Corp',
    email: 'john@example.com',
    phone_fmt: '+1 (555) 123-4567',
    phone_raw: '+15551234567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    bio: 'Full-stack developer',
    picture: 'https://example.com/john.jpg',
    slug: 'john-doe',
    public: true
  }

  const card2: Card = {
    uuid: 'card-2',
    name: 'Jane Smith',
    job_title: 'UX Designer',
    company: 'Design Studio',
    email: 'jane@design.com',
    phone_fmt: '+1 (555) 987-6543',
    phone_raw: '+15559876543',
    location: 'New York, NY',
    website: 'https://janesmith.design',
    bio: 'Creative designer focused on user experience',
    picture: 'https://example.com/jane.jpg',
    slug: 'jane-smith',
    public: false
  }

  const card3: Card = {
    uuid: 'card-3',
    name: 'Bob Wilson',
    job_title: 'Marketing Manager',
    company: 'Growth Co',
    email: 'bob@growth.com',
    location: 'Austin, TX',
    bio: 'Digital marketing specialist',
    slug: 'bob-wilson',
    public: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true
    })
    // Mock URL methods
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  describe('Selecting Different Cards', () => {
    it('should update form when switching from one card to another', async () => {
      // Start with card1
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Expand basic section to see fields
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      // Verify card1 data is loaded
      let nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('John Doe')
      
      let jobInput = wrapper.find('input[placeholder="Software Engineer, Designer, etc."]')
      expect((jobInput.element as HTMLInputElement).value).toBe('Software Engineer')

      // Switch to card2
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Verify form updated to card2 data
      nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('Jane Smith')
      
      jobInput = wrapper.find('input[placeholder="Software Engineer, Designer, etc."]')
      expect((jobInput.element as HTMLInputElement).value).toBe('UX Designer')
    })

    it('should update all form fields when selecting a new card', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Expand all sections
      const sections = wrapper.findAll('.section-title')
      for (const section of sections) {
        await section.trigger('click')
      }
      await nextTick()

      // Verify initial card data
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('John Doe')
      expect(wrapper.find('input[placeholder="Company name"]').element.value).toBe('Tech Corp')
      expect(wrapper.find('input[placeholder="john@example.com"]').element.value).toBe('john@example.com')
      expect(wrapper.find('input[placeholder="555-123-4567"]').element.value).toBe('+1 (555) 123-4567')
      expect(wrapper.find('textarea[placeholder="Tell people about yourself..."]').element.value).toBe('Full-stack developer')

      // Switch to card2
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Verify all fields updated
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('Jane Smith')
      expect(wrapper.find('input[placeholder="Company name"]').element.value).toBe('Design Studio')
      expect(wrapper.find('input[placeholder="john@example.com"]').element.value).toBe('jane@design.com')
      expect(wrapper.find('input[placeholder="555-123-4567"]').element.value).toBe('+1 (555) 987-6543')
      expect(wrapper.find('textarea[placeholder="Tell people about yourself..."]').element.value).toBe('Creative designer focused on user experience')
    })

    it('should handle selecting a card with minimal data', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Expand basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      // Start with full data
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('John Doe')

      // Switch to card with minimal data
      await wrapper.setProps({ card: card3 })
      await nextTick()

      // Verify fields update correctly (some will be empty)
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('Bob Wilson')
      expect(wrapper.find('input[placeholder="Software Engineer, Designer, etc."]').element.value).toBe('Marketing Manager')
      // Phone should be empty since card3 doesn't have phone data
      const phoneInput = wrapper.find('input[placeholder="555-123-4567"]')
      if (phoneInput.exists()) {
        await wrapper.findAll('.section-title')[2].trigger('click') // Open contact section
        await nextTick()
        expect(wrapper.find('input[placeholder="555-123-4567"]').element.value).toBe('')
      }
    })

    it('should preserve form section states when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Expand basic and contact sections
      await wrapper.findAll('.section-title')[1].trigger('click')
      await wrapper.findAll('.section-title')[2].trigger('click')
      await nextTick()

      // Verify sections are open
      expect(wrapper.findAll('input[placeholder="Enter your full name"]').length).toBe(1)
      expect(wrapper.findAll('input[placeholder="john@example.com"]').length).toBe(1)

      // Switch cards
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Sections should remain open
      expect(wrapper.findAll('input[placeholder="Enter your full name"]').length).toBe(1)
      expect(wrapper.findAll('input[placeholder="john@example.com"]').length).toBe(1)
    })

    it('should update visibility toggle when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1, // public: true
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      // Check initial visibility
      const publicOption = wrapper.findAll('.toggle-option')[1]
      expect(publicOption.classes()).toContain('active')
      expect(wrapper.find('.description-text').text()).toBe('Your card is visible to everyone.')

      // Switch to private card
      await wrapper.setProps({ card: card2 }) // public: false
      await nextTick()

      // Verify visibility updated
      const privateOption = wrapper.findAll('.toggle-option')[0]
      expect(privateOption.classes()).toContain('active')
      expect(wrapper.find('.description-text').text()).toBe('Only you can see this card.')
    })

    it('should update URL slug when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      // Check initial slug
      const slugInput = wrapper.find('.slug-input')
      expect((slugInput.element as HTMLInputElement).value).toBe('john-doe')
      expect(wrapper.find('.url-link').text()).toBe('http://localhost:3000/cards/john-doe')

      // Switch cards
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Verify slug updated
      expect((slugInput.element as HTMLInputElement).value).toBe('jane-smith')
      expect(wrapper.find('.url-link').text()).toBe('http://localhost:3000/cards/jane-smith')
    })

    it('should handle rapid card switches', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      // Rapidly switch between cards
      await wrapper.setProps({ card: card2 })
      await wrapper.setProps({ card: card3 })
      await wrapper.setProps({ card: card1 })
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Should end up with card2 data
      const nameInput = wrapper.find('input[placeholder="Enter your full name"]')
      expect((nameInput.element as HTMLInputElement).value).toBe('Jane Smith')
    })

    it('should clear preview image when switching from creating new to existing card', async () => {
      // Start in create mode
      wrapper = mount(CardEditForm, {
        props: {
          card: null,
          isCreatingNew: true,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Simulate having a preview image
      const vm = wrapper.vm as any
      vm.previewImageUrl = 'blob:test-url'

      // Switch to existing card
      await wrapper.setProps({
        card: card1,
        isCreatingNew: false
      })
      await nextTick()

      // Preview image should be cleared
      expect(vm.previewImageUrl).toBe(null)
    })

    it('should emit updateForm events when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Clear any initial events
      wrapper.emitted('updateForm')

      // Switch to different card
      await wrapper.setProps({ card: card2 })
      await nextTick()

      // Should emit updateForm with new card data
      const updateEvents = wrapper.emitted('updateForm')
      expect(updateEvents).toBeTruthy()
      expect(updateEvents?.length).toBeGreaterThan(0)
      
      const lastEmit = updateEvents?.[updateEvents.length - 1]?.[0]
      expect(lastEmit).toMatchObject({
        name: 'Jane Smith',
        job_title: 'UX Designer',
        company: 'Design Studio'
      })
    })

    it('should switch from existing card to creating new card', async () => {
      // Start with existing card
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      // Verify card data is present
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('John Doe')

      // Switch to create mode
      await wrapper.setProps({
        card: null,
        isCreatingNew: true
      })
      await nextTick()

      // Form should be cleared
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('')
      
      // Header should change
      expect(wrapper.find('h3').text()).toBe('Create Card')
    })

    it('should handle null card selection (deselection)', async () => {
      // Start with a selected card
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open basic section
      await wrapper.findAll('.section-title')[1].trigger('click')
      await nextTick()

      // Verify data is loaded
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('John Doe')

      // Deselect card (set to null)
      await wrapper.setProps({ card: null })
      await nextTick()

      // Form should be cleared
      expect(wrapper.find('input[placeholder="Enter your full name"]').element.value).toBe('')
    })
  })

  describe('Picture Handling During Card Selection', () => {
    it('should update picture display when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1, // Has picture
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      // Should show picture preview
      expect(wrapper.find('.picture-preview').exists()).toBe(true)
      expect(wrapper.find('.preview-image').attributes('src')).toBe('https://example.com/john.jpg')

      // Switch to card without picture
      const cardNoPicture = { ...card3, picture: null }
      await wrapper.setProps({ card: cardNoPicture })
      await nextTick()

      // Should show upload placeholder
      expect(wrapper.find('.upload-placeholder').exists()).toBe(true)
      expect(wrapper.find('.picture-preview').exists()).toBe(false)
    })

    it('should handle picture deletion state when switching cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: true, // Picture marked for deletion
          saveError: '',
          hasPendingChanges: true,
          showSaveSuccess: false
        }
      })

      // Open picture section
      await wrapper.find('.section-title').trigger('click')
      await nextTick()

      // Should show upload placeholder even though card has picture
      expect(wrapper.find('.upload-placeholder').exists()).toBe(true)

      // Switch to different card (deletion state should be reset externally)
      await wrapper.setProps({
        card: card2,
        isPictureMarkedForDeletion: false
      })
      await nextTick()

      // Should show the new card's picture
      expect(wrapper.find('.picture-preview').exists()).toBe(true)
      expect(wrapper.find('.preview-image').attributes('src')).toBe('https://example.com/jane.jpg')
    })
  })

  describe('Delete Card Option Visibility', () => {
    it('should show delete option for existing cards', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      expect(wrapper.find('.delete-card-section').exists()).toBe(true)
    })

    it('should hide delete option when switching to new card creation', async () => {
      wrapper = mount(CardEditForm, {
        props: {
          card: card1,
          isCreatingNew: false,
          isPictureMarkedForDeletion: false,
          saveError: '',
          hasPendingChanges: false,
          showSaveSuccess: false
        }
      })

      // Open options section
      await wrapper.findAll('.section-title')[3].trigger('click')
      await nextTick()

      // Delete should be visible
      expect(wrapper.find('.delete-card-section').exists()).toBe(true)

      // Switch to create mode
      await wrapper.setProps({
        card: null,
        isCreatingNew: true
      })
      await nextTick()

      // Delete should be hidden
      expect(wrapper.find('.delete-card-section').exists()).toBe(false)
    })
  })
})