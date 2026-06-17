import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 60; // Revalidate every 60 seconds

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug
}`;

// Fallback dummy posts using Unsplash environment images
const FALLBACK_POSTS = [
  {
    _id: "mock-1",
    title: "The Restorative Power of Urban Rewilding",
    slug: { current: "restorative-power-of-urban-rewilding" },
    hook: "How bringing native forests back into our cities is reclaiming lost biodiversity, cooling urban spaces, and reconnecting communities with the wild.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
      alt: "Dense mist-covered forest with sunrays filtering through tall trees"
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Conservation", slug: { current: "conservation" } }],
    author: { name: "Elena Rostova" }
  },
  {
    _id: "mock-2",
    title: "Decarbonizing the Grid: The Solar Frontier",
    slug: { current: "decarbonizing-the-grid-solar-frontier" },
    hook: "A deep dive into the engineering breakthroughs driving new photovoltaic cells past 30% efficiency, paving the way for a fossil-free future.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
      alt: "Polycrystalline solar panels reflecting a bright blue sky"
    },
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    categories: [{ title: "Energy", slug: { current: "energy" } }],
    author: { name: "Marcus Thorne" }
  },
  {
    _id: "mock-3",
    title: "Deep Ocean Ecosystems Under Immediate Threat",
    slug: { current: "deep-ocean-ecosystems-under-threat" },
    hook: "Exploring the mysterious twilight zones of our oceans and why upcoming deep-sea mining proposals pose an existential risk to marine life.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800",
      alt: "Shallow turquoise ocean water showing waves and underwater sand"
    },
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    categories: [{ title: "Oceans", slug: { current: "oceans" } }],
    author: { name: "Sarah Lin" }
  },
  {
    _id: "mock-4",
    title: "Regenerative Agriculture: Healing Our Soils",
    slug: { current: "regenerative-agriculture-healing-soils" },
    hook: "Why industrial farming is depleting Earth's topsoil and how multi-crop rotating, cover cropping, and zero-tillage can restore balance.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
      alt: "Verdant green agricultural fields spanning rolling hills"
    },
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    categories: [{ title: "Agriculture", slug: { current: "agriculture" } }],
    author: { name: "Elena Rostova" }
  }
];

const FALLBACK_CATEGORIES = [
  { _id: "c-1", title: "Conservation", slug: { current: "conservation" } },
  { _id: "c-2", title: "Energy", slug: { current: "energy" } },
  { _id: "c-3", title: "Oceans", slug: { current: "oceans" } },
  { _id: "c-4", title: "Agriculture", slug: { current: "agriculture" } }
];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || null;

  let categories = [];
  try {
    categories = await client.fetch(CATEGORIES_QUERY);
  } catch (error) {
    console.warn("Could not fetch categories from Sanity, using fallback:", error);
    categories = FALLBACK_CATEGORIES;
  }

  let POSTS_QUERY = `*[ _type == "post" && defined(slug.current) ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    hook,
    mainImage,
    publishedAt,
    categories[]->{ title, slug },
    author->{ name }
  }`;

  if (currentCategory) {
    POSTS_QUERY = `*[ _type == "post" && defined(slug.current) && $category in categories[]->slug.current ] | order(publishedAt desc) {
      _id,
      title,
      slug,
      hook,
      mainImage,
      publishedAt,
      categories[]->{ title, slug },
      author->{ name }
    }`;
  }

  let posts = [];
  let isUsingFallback = false;

  try {
    posts = await client.fetch(POSTS_QUERY, currentCategory ? { category: currentCategory } : {});
    if (!posts || posts.length === 0) {
      isUsingFallback = true;
      posts = currentCategory
        ? FALLBACK_POSTS.filter(p => p.categories.some(cat => cat.slug.current === currentCategory))
        : FALLBACK_POSTS;
    }
  } catch (error) {
    console.warn("Could not fetch posts from Sanity, using fallback:", error);
    isUsingFallback = true;
    posts = currentCategory
      ? FALLBACK_POSTS.filter(p => p.categories.some(cat => cat.slug.current === currentCategory))
      : FALLBACK_POSTS;
  }
  
  const heroPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <main className="bg-[#f6f5f2] w-full min-h-screen pb-32">
      {/* Editorial Marker Strip */}
      <div className="pt-28 md:pt-36 w-full z-40 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto flex justify-between items-center pb-2 border-b border-black/10">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/60 mx-auto sm:mx-0">
          The Journal
        </span>
        <span className="text-[11px] font-display italic text-black/60 hidden sm:block">
          Ecological Insights & Environmental News
        </span>
      </div>

      {/* Intro Header */}
      <section className="pt-16 pb-12 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-black"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-black">Planet Nurture</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-normal text-black leading-none tracking-tight mb-8">
          The <span className="italic text-[var(--color-accent)]">Eco-Log.</span>
        </h1>
        <p className="text-black/60 text-lg md:text-xl max-w-2xl font-light">
          Documenting the complex state of our biosphere, exploring cutting-edge green technologies, and profiling conservation voices worldwide.
        </p>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="px-4 sm:px-8 md:px-16 pb-12 max-w-7xl mx-auto flex flex-wrap gap-4">
          <Link 
            href="/" 
            className={`px-6 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 ${!currentCategory ? 'bg-[var(--color-accent)] text-white' : 'border border-black/10 text-black/50 hover:border-black/30 hover:text-black'}`}
          >
            All
          </Link>
          {categories.map((cat: any) => (
            <Link 
              key={cat._id}
              href={`/?category=${cat.slug.current}`} 
              className={`px-6 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 ${currentCategory === cat.slug.current ? 'bg-[var(--color-accent)] text-white' : 'border border-black/10 text-black/50 hover:border-black/30 hover:text-black'}`}
            >
              {cat.title}
            </Link>
          ))}
        </section>
      )}

      {/* Fallback Notice for Developers */}
      {isUsingFallback && (
        <section className="px-4 sm:px-8 md:px-16 max-w-7xl mx-auto mb-6">
          <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 p-4 rounded text-xs text-[var(--color-accent)] font-mono">
            [Notice] Viewing mock ecological content. To populate live content, initialize your Sanity.io studio dataset at `kqmmq1b9`.
          </div>
        </section>
      )}

      {/* Hero Post (Full Width) */}
      {heroPost && (
        <section className="px-4 sm:px-8 md:px-16 max-w-7xl mx-auto mb-20">
          <Link 
            href={`/posts/${heroPost.slug.current}`} 
            className="group block relative w-full overflow-hidden bg-black/5 aspect-[4/3] md:aspect-[21/9]"
          >
            {heroPost.mainImage && (
              <img 
                src={heroPost.mainImage.url ? heroPost.mainImage.url : (urlForImage(heroPost.mainImage)?.url() || '')} 
                alt={heroPost.title}
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white/80">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-semibold">
                  {heroPost.publishedAt ? new Date(heroPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                </span>
                {heroPost.categories && heroPost.categories.length > 0 && (
                  <>
                    <span className="text-white/30 text-xs">/</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent-light)]">
                      {heroPost.categories[0].title}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-white max-w-4xl group-hover:text-white/85 transition-colors duration-500 leading-tight">
                {heroPost.title}
              </h2>
              {heroPost.hook && (
                <p className="text-white/70 font-light leading-relaxed max-w-2xl hidden md:block text-sm md:text-base">
                  {heroPost.hook}
                </p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Articles Grid (2 Column) */}
      <section className="px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-black/50 text-xl font-light italic border-t border-black/5 pt-12">
            No articles published in this category yet.
          </div>
        ) : gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {gridPosts.map((post: any) => (
              <Link 
                href={`/posts/${post.slug.current}`} 
                key={post._id}
                className="group flex flex-col gap-6"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5">
                  {post.mainImage ? (
                    <img 
                      src={post.mainImage.url ? post.mainImage.url : (urlForImage(post.mainImage)?.url() || '')} 
                      alt={post.title}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/10 flex items-center justify-center text-black/30 font-mono text-xs uppercase tracking-widest">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/60 font-semibold">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                    </span>
                    {post.categories && post.categories.length > 0 && (
                      <>
                        <span className="text-black/20 text-xs">/</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)]">
                          {post.categories[0].title}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display text-black group-hover:text-black/60 transition-colors duration-500 leading-[1.15]">
                    {post.title}
                  </h2>
                  {post.hook && (
                    <p className="text-black/60 font-light leading-relaxed mt-2 text-sm md:text-base line-clamp-3">
                      {post.hook}
                    </p>
                  )}
                  {post.author && (
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 mt-4 block">
                      By {post.author.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
