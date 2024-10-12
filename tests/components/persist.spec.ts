import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import Test from '../../src/Test.svelte'
import TestRoot from '../../src/TestRoot.svelte'
import { createLocalStorage, persist, type PersistRune } from '$lib'

describe('persist', () => {
    describe('localStorage', () => {
        beforeEach(() => {
            localStorage.clear()
        })

        describe('component', () => {
            it('should initialize with the correct value', () => {
                render(Test)

                const p = screen.getByTestId('value')

                expect(p).toBeInTheDocument()
                expect(p.textContent).toBe('0')
            })

            it('should set and get the value correctly', async () => {
                render(Test)

                const increment = screen.getByTestId('increment')
                const decrement = screen.getByTestId('decrement')
                const p = screen.getByTestId('value')

                await fireEvent.click(increment)

                expect(p.textContent).toBe('1')

                await fireEvent.click(decrement)

                expect(p.textContent).toBe('0')
            })

            it('should load the value from storage', () => {
                localStorage.setItem('test', '10')

                render(Test)

                const p = screen.getByTestId('value')

                expect(p.textContent).toBe('10')
            })

            it('should listen to storage changes', async () => {
                render(Test)

                const p = screen.getByTestId('value')

                const event = new StorageEvent('storage', {
                    key: 'test',
                    newValue: '20',
                    storageArea: localStorage,
                })

                window.dispatchEvent(event)

                await new Promise((r) => setTimeout(r, 100))

                expect(p.textContent).toBe('20')
            })

            it('should reset the value', async () => {
                render(Test)

                const reset = screen.getByTestId('reset')
                const increment = screen.getByTestId('increment')
                const p = screen.getByTestId('value')

                await fireEvent.click(increment)
                await fireEvent.click(reset)

                expect(p.textContent).toBe('0')
            })
        })

        describe('root', () => {
            let rootRune: PersistRune<number>

            beforeEach(async () => {
                rootRune = persist(createLocalStorage('root-test', 0), true)
            })

            it('should initialize with the correct value', () => {
                render(TestRoot, { rootRune })

                const p = screen.getByTestId('root-value')

                expect(p).toBeInTheDocument()
                expect(p.textContent).toBe('0')
            })

            it('should set and get the value correctly', async () => {
                render(TestRoot, { rootRune })

                const increment = screen.getByTestId('root-increment')
                const decrement = screen.getByTestId('root-decrement')
                const p = screen.getByTestId('root-value')

                await fireEvent.click(increment)

                expect(p.textContent).toBe('1')

                await fireEvent.click(decrement)

                expect(p.textContent).toBe('0')
            })

            it('should load the value from storage', () => {
                localStorage.setItem('root-test', '10')

                const rootRune = persist(createLocalStorage('root-test', 0), true)

                render(TestRoot, { rootRune })

                const p = screen.getByTestId('root-value')

                expect(p.textContent).toBe('10')
            })

            it('should listen to storage changes', async () => {
                const rootRune = persist(
                    createLocalStorage('root-test', 0, { syncTabs: true }),
                    true,
                )

                render(TestRoot, { rootRune })

                const p = screen.getByTestId('root-value')

                const event = new StorageEvent('storage', {
                    key: 'root-test',
                    newValue: '20',
                    storageArea: localStorage,
                })

                window.dispatchEvent(event)

                await new Promise((r) => setTimeout(r, 100))

                expect(p.textContent).toBe('20')
            })

            it('should reset the value', async () => {
                render(TestRoot, { rootRune })

                const reset = screen.getByTestId('root-reset')
                const increment = screen.getByTestId('root-increment')
                const p = screen.getByTestId('root-value')

                await fireEvent.click(increment)
                await fireEvent.click(reset)

                expect(p.textContent).toBe('0')
            })
        })
    })
})
