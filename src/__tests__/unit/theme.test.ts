import fs from 'fs'
import path from 'path'

const css = fs.readFileSync(
  path.resolve(process.cwd(), 'src/app/globals.css'),
  'utf-8'
)

describe('Design tokens — paleta brand', () => {
  const brandShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

  brandShades.forEach((shade) => {
    it(`define --color-brand-${shade}`, () => {
      expect(css).toMatch(new RegExp(`--color-brand-${shade}\\s*:`))
    })
  })

  it('define --color-brand-700 como #431370 (cor primária da marca)', () => {
    expect(css).toMatch(/--color-brand-700\s*:\s*#431370/)
  })

  it('define --color-brand-glow para halos e sombras', () => {
    expect(css).toMatch(/--color-brand-glow\s*:/)
  })

  it('aplica fonte Geist via variável CSS (não Arial)', () => {
    expect(css).not.toMatch(/font-family\s*:\s*Arial/)
    expect(css).toMatch(/--font-geist/)
  })
})
