import { beforeEach, describe, expect, it } from 'vitest'
import Test from '../../src/Test.svelte'
import { fireEvent, render, screen } from '@testing-library/svelte'

describe('persist', () => {
    describe('localStorage', () => {
        beforeEach(() => {
            localStorage.clear()
        })

        it('should initialize with the correct value', () => {
            render(Test)

            const p = screen.getByTestId('value')

            expect(p).toBeInTheDocument()
            expect(p.textContent).toBe('10')
        })

        it('should set and get the value correctly', async () => {
            render(Test)

            const increment = screen.getByTestId('increment')
            const decrement = screen.getByTestId('decrement')
            const p = screen.getByTestId('value')

            await fireEvent.click(increment)

            expect(p.textContent).toBe('11')

            await fireEvent.click(decrement)

            expect(p.textContent).toBe('10')
        })

        it('should load the value from storage', () => {
            localStorage.setItem('test', '15')

            render(Test)

            const p = screen.getByTestId('value')

            expect(p.textContent).toBe('15')
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
            const p = screen.getByTestId('value')

            await fireEvent.click(reset)

            expect(p.textContent).toBe('10')
        })
    })
})
