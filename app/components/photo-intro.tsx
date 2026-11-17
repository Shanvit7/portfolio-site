'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '@/components/portfolio/stories/paper.module.css'
import building from '../../public/polaroids/always-building.jpg'
import cafe from '../../public/polaroids/chilling.jpg'
import exploring from '../../public/polaroids/exploring.jpg'
import flying from '../../public/polaroids/flying.jpg'
import heart from '../../public/polaroids/heart.jpg'
import boat from '../../public/polaroids/on-a-boat.jpg'
import smile from '../../public/polaroids/shanvit-s-shetty.jpg'
import vibes from '../../public/polaroids/vibes.jpg'

const photos = [
  {
    image: smile,
    printWidth: 45,
    portraitClass: 'aspect-[1/1.08]',
    caption: 'Shanvit S Shetty',
    alt: 'Shanvit smiling at a cafe',
  },
  {
    image: building,
    printWidth: 27,
    portraitClass: 'aspect-[1/1.15] object-top',
    caption: 'always building',
    alt: 'Shanvit assembling a model',
  },
  {
    image: flying,
    printWidth: 18,
    portraitClass: '',
    caption: 'flying',
    alt: 'An airplane wing above the clouds',
  },
  {
    image: cafe,
    printWidth: 25,
    portraitClass: 'aspect-[1/1.15] object-[center_75%]',
    caption: 'chilling',
    alt: 'Shanvit sitting outside under a tree',
  },
  {
    image: vibes,
    printWidth: 20,
    portraitClass: 'aspect-[1/1.15]',
    caption: 'vibes',
    alt: 'Looking up at palm trees',
  },
  {
    image: boat,
    printWidth: 31,
    portraitClass: 'aspect-[1.45] object-[center_60%]',
    caption: 'on a boat',
    alt: 'Kayaking along a palm-lined shore',
  },
  {
    image: heart,
    printWidth: 21,
    portraitClass: 'aspect-[1.1]',
    caption: '❤️',
    alt: 'Colorful lights beside the beach at night',
  },
  {
    image: exploring,
    printWidth: 26,
    portraitClass: 'aspect-[1/1.15] object-[center_75%]',
    caption: 'exploring',
    alt: 'Shanvit beneath street lamps in Ujjain',
  },
]

export const PhotoIntro = () => {
  const dialog = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<
    ((typeof photos)[number] & { thumbnail: string }) | null
  >(null)
  const [previewReady, setPreviewReady] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const previewSize = active
    ? `min(94vw, 980px, ${(76 * active.image.width) / active.image.height}svh, ${(760 * active.image.width) / active.image.height}px)`
    : undefined

  useEffect(() => {
    if (active) dialog.current?.showModal()
  }, [active])

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === element) element.close()
    }
    element.addEventListener('click', closeOnBackdrop)
    return () => element.removeEventListener('click', closeOnBackdrop)
  }, [])

  return (
    <div className="mx-auto min-w-0 w-full max-w-160">
      <p className={`${styles.greeting} ${styles.inkReveal}`}>hey, I’m</p>
      <div className={styles.photoScatter}>
        {photos.map((photo, index) => (
          <figure
            className={styles.polaroid}
            key={photo.image.src}
            data-photo={index}
          >
            {index === 0 && (
              <span className={styles.flash} aria-hidden="true" />
            )}
            <button
              className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
              type="button"
              aria-label={`Enlarge photo: ${photo.caption}`}
              onClick={(event) => {
                setPreviewReady(false)
                setPreviewError(false)
                setActive({
                  ...photo,
                  thumbnail:
                    event.currentTarget.querySelector('img')?.currentSrc || '',
                })
              }}
            >
              <Image
                className={`block h-auto w-full aspect-[1/1.05] object-cover object-[center_35%] saturate-[.9] ${photo.portraitClass}`}
                src={photo.image}
                alt={photo.alt}
                placeholder={photo.image.blurDataURL as `data:image/${string}`}
                quality={60}
                sizes={`${index === 0 ? '' : 'auto, '}(max-width: 700px) calc(${photo.printWidth}vw - ${Math.ceil(photo.printWidth * 0.56 + 10)}px), (max-width: 1300px) calc(${photo.printWidth * 0.49}vw - 18px), ${Math.round(photo.printWidth * 6.4 - 18)}px`}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
            </button>
            <figcaption
              className={`${index === 0 ? 'py-2.5 pb-1' : 'pt-1.75'} text-center text-[clamp(0.8125rem,1.15vw,1rem)] leading-[1.2] text-ink`}
            >
              {index === 0 ? (
                <h1 className="m-0 text-[clamp(1.125rem,1.8vw,1.65rem)] font-normal leading-[1.2] text-balance">
                  {photo.caption}
                </h1>
              ) : (
                photo.caption
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="pt-24 text-center text-base text-muted text-balance md:pt-28">
        Tap any photo to see it up close.
      </p>
      <dialog
        className={styles.photoDialog}
        ref={dialog}
        aria-label={
          active ? `Enlarged photo: ${active.caption}` : 'Enlarged photo'
        }
        onClose={() => setActive(null)}
      >
        <div
          className={styles.viewer}
          aria-busy={active !== null && !previewReady && !previewError}
        >
          <button
            className={styles.viewerClose}
            type="button"
            aria-label="Close enlarged photo"
            onClick={() => dialog.current?.close()}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          {active && (
            <>
              <div
                className={styles.viewerPhoto}
                style={{
                  width: previewSize,
                  aspectRatio: `${active.image.width} / ${active.image.height}`,
                  backgroundImage: `url("${active.thumbnail || active.image.blurDataURL}"), url("${active.image.blurDataURL}")`,
                }}
              >
                {previewError && (
                  <p className={styles.photoError} role="alert">
                    Couldn&apos;t load sharper photo. Close and tap to retry.
                  </p>
                )}
                <Image
                  key={active.image.src}
                  className={styles.viewerImage}
                  data-ready={previewReady}
                  src={active.image}
                  alt={active.alt}
                  sizes={previewSize}
                  loading="eager"
                  onLoad={() => setPreviewReady(true)}
                  onError={() => setPreviewError(true)}
                />
              </div>
              <p className="m-0 text-center text-xl">{active.caption}</p>
            </>
          )}
        </div>
      </dialog>
    </div>
  )
}
