import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { stripe } from "@/lib/stripe";

import { useKeenSlider } from 'keen-slider/react'
import "keen-slider/keen-slider.min.css"

import { HomeContainer, Product } from "@/styles/pages/home";
import Stripe from "stripe";
import Link from "next/link";
import { CartButton } from "@/components/CartButton";

interface IHomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
  }[]
}

export default function Home({ products }: IHomeProps) {
  const [sliderRef] = useKeenSlider({
    mode: 'snap',
    slides: {
      perView: 'auto',
      spacing: 48,
    }
  })

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
                  <CartButton color="green" size='large' />
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
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // re-valida a página a cada 2 horas
  }
}
