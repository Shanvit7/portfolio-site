'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import styles from '@/components/portfolio/stories/paper.module.css'

export const ContactCopy = ({ email }: { email: string }) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <div className={styles.contactGroup}>
      <p className={styles.contactNote} aria-live="polite">
        {status === 'copied'
          ? 'Copied. Your move.'
          : status === 'failed'
            ? 'Copy failed. Select the address instead.'
            : 'Building something interesting? Feel free to reach out.'}
      </p>
      <div className={styles.contactLine}>
        <p className={styles.contactEmail}>{email}</p>
        <button
          className={styles.contact}
          onClick={copyEmail}
          type="button"
          aria-label={
            status === 'copied' ? 'Email copied' : 'Copy email address'
          }
        >
          {status === 'copied' ? (
            <Check aria-hidden="true" size={20} strokeWidth={1.75} />
          ) : (
            <Copy aria-hidden="true" size={20} strokeWidth={1.75} />
          )}
          <span>{status === 'copied' ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  )
}
