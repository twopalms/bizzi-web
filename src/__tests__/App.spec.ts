import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts successfully', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'router-view': { template: '<div>RouterView Stub</div>' }
        }
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toContain('RouterView Stub')
  })
})
