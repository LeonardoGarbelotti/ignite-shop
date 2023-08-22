import { CartButton } from "../CartButton";
import * as Dialog from '@radix-ui/react-dialog'
import { X } from "phosphor-react";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";

import {
  CartCloseButton,
  CartContent,
  CartFooter,
  CartProduct,
  CartProductDetails,
  CartProductImage,
  CheckoutDetails
} from "@/styles/components/Cart/styles";
import { useCart } from "@/hooks/useCart";

export function Cart() {
  const { cartItems, removeFromCart, cartTotalPrice } = useCart()
  const [isCreatingCheckoutSession, setIsCreatingChechoutSession] = useState(false)
  const cartProductsAmount = cartItems.length

  const formattedCartTotalPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cartTotalPrice)

  async function handleBuyProduct() {
    // utiliza o axios para enviar o array de itens do carrinho para a API do stripe
    try {
      setIsCreatingChechoutSession(true)

      const response = await axios.post('/api/checkout', {
        products: cartItems,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      // conectar com ferramenta de observabilidade (Datadog / Sentry)
      setIsCreatingChechoutSession(false)

      alert('Falha ao redirecionar para checkout!')
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton />
      </Dialog.Trigger>
      <Dialog.Portal>
        <CartContent>
          <CartCloseButton>
            <X size={24} weight="bold" />
          </CartCloseButton>

          <h2>Sacola de Compras</h2>

          <section>
            {/* Verificação se o carrinho está vazio */}
            {cartProductsAmount <= 0 && <p>Parece que seu carrinho está vazio :(</p>}

            {cartItems.map((cartItem) => (
              <CartProduct key={cartItem.id}>
                <CartProductImage>
                  <Image width={100} height={100} alt="" src={cartItem.imageUrl} />
                </CartProductImage>
                <CartProductDetails>
                  <p>{cartItem.name}</p>
                  <strong>{cartItem.price}</strong>
                  <button
                    onClick={() => removeFromCart(cartItem.id)}
                  >
                    Remover
                  </button>
                </CartProductDetails>
              </CartProduct>
            ))}
          </section>
          <CartFooter>
            <CheckoutDetails>
              <div>
                <span>Quantidade</span>
                <p>{cartProductsAmount} {cartProductsAmount === 1 ? 'item' : 'itens'}</p>
              </div>
              <div>
                <span>Valor Total</span>
                <p>{formattedCartTotalPrice}</p>
              </div>
            </CheckoutDetails>
            <button
              onClick={handleBuyProduct}
              disabled={isCreatingCheckoutSession || cartProductsAmount <= 0}
            >
              Finalizar Compra
            </button>
          </CartFooter>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}