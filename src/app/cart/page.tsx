'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/context/AuthContext'
import { useAuthModalStore } from '@/lib/store/authModalStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { CheckoutForm } from '@/components/cart/CheckoutForm'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { createOrderAction } from '@/app/actions/cart'
import type { CustomerInfo, DeliveryQuote, FulfillmentType } from '@/types'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuth()
  const openModal = useAuthModalStore((s) => s.openModal)
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null)
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType | null>(null)

  async function handleCheckout(customer: CustomerInfo) {
    if (!isAuthenticated || !user) {
      openModal('login')
      return
    }

    setLoading(true)
    setOrderError(null)

    // Frete só se aplica quando cliente optou pela entrega
    const freight = fulfillmentType === 'delivery' ? (deliveryQuote?.freight ?? null) : null

    // Serializa os itens para o server action (sem objetos aninhados desnecessários)
    const itemInputs = items.map((item) => ({
      productId: item.product.id,
      colorId: item.selected_color?.id ?? null,
      sizeId: item.selected_size?.id ?? null,
      quantity: item.quantity,
      productName: item.product.name,
      colorName: item.selected_color?.name ?? null,
      sizeLabel: item.selected_size?.label ?? null,
    }))

    const result = await createOrderAction({
      items: itemInputs,
      customerName: customer.name,
      customerPhone: customer.phone,
      fulfillmentType,
      freight,
      cep: customer.cep,
      street: customer.street,
      streetNumber: customer.number,
      neighborhood: customer.neighborhood,
      city: customer.city,
    })

    if ('error' in result) {
      setOrderError(result.error)
      setLoading(false)
      return  // carrinho preservado — cliente pode tentar novamente
    }

    // Sucesso: abre WhatsApp com total validado pelo servidor, limpa o carrinho
    const url = buildWhatsAppUrl({ customer, items, total: result.serverTotal, deliveryQuote })
    window.open(url, '_blank')
    clearCart()
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h1>
        <p className="text-zinc-400 mb-8">Adicione produtos do catálogo para começar.</p>
        <Link href="/catalog" className="bg-brand-700 hover:bg-brand-500 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-lg shadow-brand-glow">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 md:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Continuar comprando
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 md:mb-8">
        Carrinho <span className="text-zinc-500 text-base sm:text-lg font-normal">({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const colorId = item.selected_color?.id ?? null
            return (
              <CartItem
                key={`${item.product.id}-${colorId}`}
                item={item}
                onRemove={() => removeItem(item.product.id, colorId)}
                onUpdateQuantity={(q) => updateQuantity(item.product.id, colorId, q)}
              />
            )
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CartSummary itemCount={itemCount} total={total} deliveryQuote={deliveryQuote} />

          {/* Erro de criação de pedido */}
          {orderError && (
            <div role="alert" className="flex items-start gap-3 bg-red-950/60 border border-red-700/60 rounded-2xl p-4">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{orderError}</p>
            </div>
          )}

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h3 className="text-white font-bold mb-4">Dados para entrega</h3>
            <CheckoutForm
              onSubmit={handleCheckout}
              onDeliveryQuote={setDeliveryQuote}
              onFulfillmentChange={setFulfillmentType}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
