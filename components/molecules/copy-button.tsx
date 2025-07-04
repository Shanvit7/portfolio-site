'use client';
// HOOKS
import { useEffect, useState } from "react"
// COMPONENTS
import { TextMorph } from '@/components/atoms/text-morph'

const CopyButton = () => {
    const [text, setText] = useState('Copy')
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  
    useEffect(() => {
      setTimeout(() => {
        setText('Copy')
      }, 2000)
    }, [text])
  
    return (
      <button
        onClick={() => {
          setText('Copied')
          navigator.clipboard.writeText(currentUrl)
        }}
        className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400"
        type="button"
      >
        <TextMorph>{text}</TextMorph>
        <span>URL</span>
      </button>
    )
};  

export default CopyButton