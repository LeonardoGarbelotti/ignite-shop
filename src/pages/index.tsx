import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Stripe from "stripe";
import Link from "next/link";
import { stripe } from "@/lib/stripe";

import { useKeenSlider } from 'keen-slider/react'
import "keen-slider/keen-slider.min.css"

import { HomeContainer, Product } from "@/styles/pages/home";

import { CartButton } from "@/components/CartButton";
import { useCart } from "@/hooks/useCart";
import { IProduct } from "@/contexts/CartContext";
import { MouseEvent } from "react";


interface IHomeProps {
  products: IProduct[]
}

export default function Home({ products }: IHomeProps) {

  const [sliderRef] = useKeenSlider({
    mode: 'snap',
    slides: {
      perView: 1.8,
      spacing: 48,
    }
  })

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>, product: IProduct) {
    event.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          return (
            <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image
                  src={product.imageUrl}
                  width={520}
                  height={480}
                  alt={product.name}
                />
                <footer>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </div>
                  <CartButton
                    color="green"
                    size="large"
                    disabled={checkIfItemAlreadyExists(product.id)}
                    onClick={(event) => handleAddToCart(event, product)}
                  />
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })



  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format((price.unit_amount / 100)),
      numberPrice: price.unit_amount / 100,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // re-valida a página a cada 2 horas
  }
}
