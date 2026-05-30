import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ColorManager } from '@/components/admin/ColorManager'
import type { Color } from '@/types'

const mockUpdate = jest.fn()
const mockDelete = jest.fn()
const mockInsert = jest.fn()
const mockEq = jest.fn()

jest.mock('@/lib/supabase/browser', () => ({
  createClient: () => ({
    from: (table: string) => ({
      update: (data: unknown) => { mockUpdate({ table, data }); return { eq: mockEq } },
      delete: () => { mockDelete(table); return { eq: mockEq } },
      insert: (data: unknown) => { mockInsert({ table, data }); return Promise.resolve({ error: null }) },
    }),
  }),
}))

const colors: Color[] = [
  { id: 'c1', name: 'Preto', hex_code: '#1a1a1a', is_available: true },
  { id: 'c2', name: 'Branco', hex_code: '#ffffff', is_available: false },
]

beforeEach(() => jest.clearAllMocks())

describe('ColorManager', () => {
  it('renders list of colors with names', () => {
    render(<ColorManager colors={colors} onRefresh={jest.fn()} />)
    expect(screen.getByText('Preto')).toBeInTheDocument()
    expect(screen.getByText('Branco')).toBeInTheDocument()
  })

  it('shows color count in header', () => {
    render(<ColorManager colors={colors} onRefresh={jest.fn()} />)
    expect(screen.getByText('2 cores')).toBeInTheDocument()
  })

  it('shows empty state when no colors', () => {
    render(<ColorManager colors={[]} onRefresh={jest.fn()} />)
    expect(screen.getByText('Nenhuma cor cadastrada.')).toBeInTheDocument()
  })

  it('toggles availability and calls onRefresh', async () => {
    mockEq.mockResolvedValue({ error: null })
    const onRefresh = jest.fn()
    render(<ColorManager colors={colors} onRefresh={onRefresh} />)

    const switches = screen.getAllByRole('switch')
    fireEvent.click(switches[0])

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ table: 'colors', data: { is_available: false } }),
      )
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  it('shows add form when "Nova cor" is clicked', () => {
    render(<ColorManager colors={colors} onRefresh={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /nova cor/i }))
    expect(screen.getByPlaceholderText(/azul royal/i)).toBeInTheDocument()
  })

  it('hides form on cancel', () => {
    render(<ColorManager colors={colors} onRefresh={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /nova cor/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.queryByPlaceholderText(/azul royal/i)).not.toBeInTheDocument()
  })

  it('deletes color after confirmation', async () => {
    mockEq.mockResolvedValue({ error: null })
    window.confirm = jest.fn().mockReturnValue(true)
    const onRefresh = jest.fn()
    render(<ColorManager colors={colors} onRefresh={onRefresh} />)

    const deleteButtons = screen.getAllByTitle('Remover cor')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('colors')
      expect(onRefresh).toHaveBeenCalled()
    })
  })

  it('does not delete if confirm is cancelled', async () => {
    window.confirm = jest.fn().mockReturnValue(false)
    render(<ColorManager colors={colors} onRefresh={jest.fn()} />)
    const deleteButtons = screen.getAllByTitle('Remover cor')
    fireEvent.click(deleteButtons[0])
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
