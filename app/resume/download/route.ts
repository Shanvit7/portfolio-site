import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const GET = async () => {
  const pdf = await readFile(join(process.cwd(), 'public/resume.pdf'))

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="shanvit_shetty_resume.pdf"',
      'Content-Length': String(pdf.byteLength),
    },
  })
}
