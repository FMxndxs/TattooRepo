import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import type { Category } from '@/types'

const mockCategories: Category[] = [
  { id: '1', name: 'Decoração', slug: 'decoracao', description: null, icon: 'Palette', created_at: '' },
  { id: '2', name: 'Utilitários', slug: 'utilitarios', description: null, icon: 'Package', created_at: '' },
  { id: '3', name: 'Escritório', slug: 'escritorio', description: null, icon: 'Briefcase', created_at: '' },
]

describe('CategoryFilter', () => {
  it('renderiza todas as categorias', () => {
    render(<CategoryFilter categories={mockCategories} selected={null} onSelect={() => {}} />)
    expect(screen.getByText('Decoração')).toBeInTheDocument()
    expect(screen.getByText('Utilitários')).toBeInTheDocument()
    expect(screen.getByText('Escritório')).toBeInTheDocument()
  })

  it('exibe opcao "Todos" como primeira', () => {
    render(<CategoryFilter categories={mockCategories} selected={null} onSelect={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('Todos')
  })

  it('chama onSelect com null ao clicar em Todos', () => {
    const onSelect = jest.fn()
    render(<CategoryFilter categories={mockCategories} selected="decoracao" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Todos'))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('chama onSelect com o slug da categoria clicada', () => {
    const onSelect = jest.fn()
    render(<CategoryFilter categories={mockCategories} selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Decoração'))
    expect(onSelect).toHaveBeenCalledWith('decoracao')
  })

  it('destaca a categoria selecionada', () => {
    render(<CategoryFilter categories={mockCategories} selected="decoracao" onSelect={() => {}} />)
    const decoracaoBtn = screen.getByText('Decoração').closest('button')
    expect(decoracaoBtn).toHaveClass('bg-brand-700')
  })
})
