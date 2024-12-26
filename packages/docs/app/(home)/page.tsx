import { Button } from "../../components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className='flex flex-col '>
      {/* Hero Section */}
      <section className='flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center space-y-4 text-center'>
            <div className='mb-8'>
              <Image
                src='/logo.png'
                alt='Lector Logo'
                width={120}
                height={120}
                className='h-auto w-auto'
                priority
              />
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

      {/* Features Section */}
      {/* <section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <FeatureCard
              icon={Eye}
              title='High Performance'
              description='Lightning-fast PDF rendering with optimized performance.'
            />
            <FeatureCard
              icon={CheckCircle}
              title='Modern Features'
              description='Advanced search, zoom controls, and thumbnail navigation.'
            />
            <FeatureCard
              icon={Network}
              title='Easy Integration'
              description='Simple to integrate into any React application.'
            />
          </div>
        </div>
      </section> */}
    </div>
  );
}
