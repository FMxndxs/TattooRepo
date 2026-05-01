import { render, screen } from '@testing-library/react'
import { LayerReveal, StaggerGroup, PrintLineHover } from '@/components/ui/MotionPrimitives'

describe('MotionPrimitives', () => {
  describe('LayerReveal', () => {
    it('renderiza children', () => {
      render(<LayerReveal><span>Conteúdo</span></LayerReveal>)
      expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    })

    it('aceita delay opcional sem quebrar', () => {
      render(<LayerReveal delay={0.2}><span>Texto</span></LayerReveal>)
      expect(screen.getByText('Texto')).toBeInTheDocument()
    })
  })

  describe('StaggerGroup', () => {
    it('renderiza todos os filhos', () => {
      render(
        <StaggerGroup>
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
        </StaggerGroup>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('PrintLineHover', () => {
    it('renderiza children e elemento de varredura', () => {
      render(
        <PrintLineHover>
          <img alt="produto" src="/test.jpg" />
        </PrintLineHover>
      )
      expect(screen.getByAltText('produto')).toBeInTheDocument()
    })

    it('tem data-testid="print-line" para a linha de varredura', () => {
      render(
        <PrintLineHover>
          <span>content</span>
        </PrintLineHover>
      )
      expect(screen.getByTestId('print-line')).toBeInTheDocument()
    })
  })
})
