// COMPONENTS
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from '@/components/atoms/morphing-dialog'
// ICONS
import { XIcon } from 'lucide-react'

type ProjectVideoProps = {
  src: string
  type?: 'video' | 'image'
}

const ProjectVideo = ({ src, type = 'video' }: ProjectVideoProps) => {
  const isVideo =
    type === 'video' ||
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.endsWith('.mov')

  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        {isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video w-full cursor-zoom-in rounded-xl object-cover"
          />
        ) : (
          <img
            src={src}
            alt="Project preview"
            className="aspect-video w-full cursor-zoom-in rounded-xl object-cover"
          />
        )}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          {isVideo ? (
            <video
              src={src}
              autoPlay
              loop
              muted
              className="aspect-video h-[50vh] w-full rounded-xl object-cover md:h-[70vh]"
            />
          ) : (
            <img
              src={src}
              alt="Project preview"
              className="aspect-video h-[50vh] w-full rounded-xl object-cover md:h-[70vh]"
            />
          )}
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

export default ProjectVideo
