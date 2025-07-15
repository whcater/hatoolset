'use client'

import { Suspense } from 'react'
import HeroSection from '../src/components/HeroSection'
import FeaturedTools from '../src/components/FeaturedTools'
import Categories from '../src/components/Categories'
import SearchSection from '../src/components/SearchSection'
import Layout from '../src/components/Layout'
import LoadingSpinner from '../src/components/ui/LoadingSpinner'

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover tools organized by category to find exactly what you need
              </p>
            </div>
            <Categories />
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Tools
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hand-picked tools that our community loves most
              </p>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedTools />
            </Suspense>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Perfect Tool
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Search through our extensive collection of tools with advanced filtering
              </p>
            </div>
            <SearchSection />
          </div>
        </section>
      </div>
    </Layout>
  )
} 