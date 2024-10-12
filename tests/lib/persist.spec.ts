import { describe, it, expect, beforeEach } from 'vitest'
import { createLocalStorage, persist } from '$lib'

describe('persist', () => {
    describe('localStorage', () => {
        beforeEach(() => {
            localStorage.clear()
        })

        it('should initialize with the correct value', () => {
            const rune = persist(createLocalStorage('test', 0), { root: true })
            expect(rune.value).toBe(0)
        })

        it('should set and get the value correctly', () => {
            const rune = persist(createLocalStorage('test', 0), { root: true })
            rune.value = 5
            expect(rune.value).toBe(5)
        })

        it('should load the value from storage', () => {
            localStorage.setItem('test', '10')
            const rune = persist(createLocalStorage('test', 0), { root: true })
            expect(rune.value).toBe(10)
        })

        it('should listen to storage changes', () => {
            const rune = persist(createLocalStorage('test', 0), { root: true, syncTabs: true })

            const event = new StorageEvent('storage', {
                key: 'test',
                newValue: '10',
                storageArea: localStorage,
            })

            window.dispatchEvent(event)

            expect(rune.value).toBe(10)

            rune.cleanup()
        })
    })
})
