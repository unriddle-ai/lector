import { Button } from "../../components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <section className='flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            <div className='mb-8'>
              <Image src='/logo.png' alt='Lector Logo' width={120} height={120} priority />
            </div>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                Lector Documentation
              </h1>
              <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                Your powerful PDF viewer for the web. Fast, modern, and feature-rich documentation
                experience.
              </p>
            </div>
            <div className='space-x-4'>
              <Link href='/docs/basic-usage'>
                <Button className='h-11 px-8'>
                  Get Started
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link
                href='https://github.com/unriddle-ai/lector'
                target='_blank'
                rel='noopener noreferrer'>
                <Button variant='outline' className='h-11 px-8'>
                  <Github className='mr-2 h-4 w-4' />
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className='w-full py-12 md:py-24 bg-muted/50'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-4 text-center mb-8'>
            <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl'>Try it out</h2>
            <p className='mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400'>
              Explore our basic example right in your browser using StackBlitz.
            </p>
          </div>
          <div className='w-full aspect-[16/9] rounded-lg overflow-hidden border bg-background'>
            <iframe
              src='https://stackblitz.com/github/unriddle-ai/lector/tree/main/examples/basic?embed=1&file=src/App.tsx'
              className='w-full h-full'
              title='Lector Basic Example'
              allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
              sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
