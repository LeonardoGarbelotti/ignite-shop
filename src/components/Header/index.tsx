import { HeaderContainer } from "@/styles/components/Header/styles";
import Image from "next/image";
import Link from "next/link";
import logoImg from '@/assets/logo.svg'
import { Cart } from "../Cart";
import { useRouter } from "next/router";

export function Header() {
  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'

  return (
    <HeaderContainer>
      <Link href="/">
        <Image src={logoImg} alt="" />
      </Link>


      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}
