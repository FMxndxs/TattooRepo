import { render, screen, fireEvent } from '@testing-library/react'
import { StockToggle } from '@/components/admin/StockToggle'

describe('StockToggle', () => {
  it('exibe estado disponivel', () => {
    render(<StockToggle available={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('exibe estado indisponivel', () => {
    render(<StockToggle available={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('chama onChange ao clicar', () => {
    const onChange = jest.fn()
    render(<StockToggle available={true} onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('exibe label "Disponível" quando ativo', () => {
    render(<StockToggle available={true} onChange={() => {}} />)
    expect(screen.getByText('Disponível')).toBeInTheDocument()
  })

  it('exibe label "Indisponível" quando inativo', () => {
    render(<StockToggle available={false} onChange={() => {}} />)
    expect(screen.getByText('Indisponível')).toBeInTheDocument()
  })
})
