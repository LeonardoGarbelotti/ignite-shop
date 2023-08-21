import { CartButton } from "../CartButton";
import * as Dialog from '@radix-ui/react-dialog'
import { X } from "phosphor-react";
import Image from "next/image";

import {
  CartCloseButton,
  CartContent,
  CartFooter,
  CartProduct,
  CartProductDetails,
  CartProductImage,
  CheckoutDetails
} from "@/styles/components/Cart/styles";

export function Cart() {
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
            {/* <p>Parece que seu carrinho está vazio :(</p> */}

            <CartProduct>
              <CartProductImage>
                {/* <Image width={100} height={100} alt="" src={''} /> */}
              </CartProductImage>
              <CartProductDetails>
                <p>Produto 1</p>
                <strong>R$ 50,00</strong>
                <button>Remover</button>
              </CartProductDetails>
            </CartProduct>
          </section>
          <CartFooter>
            <CheckoutDetails>
              <div>
                <span>Quantidade</span>
                <p>2 itens</p>
              </div>
              <div>
                <span>Valor Total</span>
                <p>R$ 50,00</p>
              </div>
            </CheckoutDetails>
            <button>Finalizar Compra</button>
          </CartFooter>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}