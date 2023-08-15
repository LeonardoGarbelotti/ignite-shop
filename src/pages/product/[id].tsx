import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import { stripe } from "@/lib/stripe";
import Image from "next/image"
import Stripe from "stripe";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface IProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: IProductProps) {
  const { isFallback } = useRouter()
  const [isCreatingCheckoutSession, setIsCreatingChechoutSession] = useState(false)

  if (isFallback) {
    return <p>Loading...</p>
  }

  async function handleBuyProduct() {
    // utiliza o axios para enviar o ID do preço para a API do stripe
    try {
      setIsCreatingChechoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
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
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt={product.name} />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = String(params.id);

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount / 100)),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 2 // 2 hours
  }
}