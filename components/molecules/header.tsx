'use client'
// COMPONENTS
import { TextEffect } from '@/components/atoms/text-effect'
import Link from 'next/link'

const Header = () => (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Shanvit S Shetty
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Software Engineer
        </TextEffect>
      </div>
    </header>
);

export default Header;
