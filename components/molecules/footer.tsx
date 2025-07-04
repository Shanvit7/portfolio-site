'use client';
// COMPONENTS
import { TextLoop } from '@/components/atoms/text-loop';
import ThemeSwitch from '@/components/organisms/theme-switch';
// CONSTANTS
import { GITHUB_URL } from '@/lib/constants';

const Footer = () => (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <a href={`${GITHUB_URL}/portfolio-site`} target="_blank">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2025 Shanvit S Shetty.</span>
            <span>Built with Next.js and Tailwind CSS.</span>
          </TextLoop>
        </a>
        <div className="text-xs text-zinc-400">
          <ThemeSwitch />
        </div>
      </div>
    </footer>
);

export default Footer;
