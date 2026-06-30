import { render, screen } from '@testing-library/react'
import { ProductForm } from '@/components/admin/ProductForm'

// useImageUpload faz chamadas ao Supabase storage — mock completo
jest.mock('@/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploading: false,
    preview: null,
    uploadedUrl: null,
    error: null,
    handleFile: jest.fn(),
  }),
}))

const noop = async () => {}
const categories = [
  { id: 'cat-1', name: 'Decoração', slug: 'decoracao', created_at: '' },
]

describe('ProductForm', () => {
  it('renderiza campos de nome, slug e preço', () => {
    render(<ProductForm categories={categories} onSubmit={noop} />)
    expect(screen.getByPlaceholderText('Ex.: Suporte de Fone')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('suporte-de-fone')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('29.90')).toBeInTheDocument()
  })

  it('renderiza campo de link MakerWorld', () => {
    render(<ProductForm categories={categories} onSubmit={noop} />)
    expect(screen.getByPlaceholderText(/makerworld\.com/i)).toBeInTheDocument()
  })

  it('renderiza a área de upload de foto', () => {
    render(<ProductForm categories={categories} onSubmit={noop} />)
    expect(screen.getByText(/foto principal/i)).toBeInTheDocument()
    expect(screen.getByText(/clique para enviar/i)).toBeInTheDocument()
  })

  it('preenche makerworld_url no modo edição', () => {
    const product = {
      id: 'prod-1',
      name: 'Vaso',
      slug: 'vaso',
      description: null,
      price: 29.9,
      category_id: null,
      print_time_minutes: null,
      filament_grams: null,
      is_available: true,
      is_featured: false,
      allows_custom_color: true,
      allows_custom_size: false,
      makerworld_url: 'https://makerworld.com/en/models/999',
      created_at: '',
      updated_at: '',
    }
    render(<ProductForm product={product} categories={categories} onSubmit={noop} />)
    const input = screen.getByPlaceholderText(/makerworld\.com/i) as HTMLInputElement
    expect(input.value).toBe('https://makerworld.com/en/models/999')
  })

  it('botão mostra "Criar produto" em modo criação', () => {
    render(<ProductForm categories={categories} onSubmit={noop} />)
    expect(screen.getByRole('button', { name: /criar produto/i })).toBeInTheDocument()
  })

  it('botão mostra "Salvar alterações" em modo edição', () => {
    const product = {
      id: 'prod-2',
      name: 'Suporte',
      slug: 'suporte',
      description: null,
      price: 19.9,
      category_id: null,
      print_time_minutes: null,
      filament_grams: null,
      is_available: true,
      is_featured: false,
      allows_custom_color: true,
      allows_custom_size: false,
      makerworld_url: null,
      created_at: '',
      updated_at: '',
    }
    render(<ProductForm product={product} categories={categories} onSubmit={noop} />)
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument()
  })
})
