import { getFreightConfig } from '@/lib/supabase/queries'
import { FreightSettingsForm } from '@/components/admin/FreightSettingsForm'

export default async function AdminSettingsPage() {
  const config = await getFreightConfig()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 mt-1">Parâmetros de cálculo de frete da loja.</p>
      </div>

      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1">Frete</h2>
        <p className="text-zinc-500 text-sm mb-6">
          Define o local base para medir distâncias, o valor cobrado por km e o raio máximo de
          entrega própria. Pedidos fora do raio são encaminhados para retirada ou courier a combinar.
        </p>
        <FreightSettingsForm initialConfig={config} />
      </section>
    </div>
  )
}
