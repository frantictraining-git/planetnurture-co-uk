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

// Expanded fallback dummy posts using Unsplash environment images to support 5 recent posts + featured
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
    author: { name: "Elena Rostova" },
    isFeatured: true
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
    author: { name: "Marcus Thorne" },
    isFeatured: false
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
    author: { name: "Sarah Lin" },
    isFeatured: false
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
    author: { name: "Elena Rostova" },
    isFeatured: false
  },
  {
    _id: "mock-5",
    title: "The Return of the Apex Predators",
    slug: { current: "return-of-the-apex-predators" },
    hook: "How restoring wolves and lynx to European landscapes is repairing disrupted trophic cascades and reviving natural ecological controls.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1602491453977-63a2af0b3a7a?auto=format&fit=crop&q=80&w=800",
      alt: "Grey wolf profile standing in the snow"
    },
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    categories: [{ title: "Conservation", slug: { current: "conservation" } }],
    author: { name: "Elena Rostova" },
    isFeatured: true
  },
  {
    _id: "mock-6",
    title: "The Rise of Microgrids in Remote Communities",
    slug: { current: "rise-of-microgrids-remote-communities" },
    hook: "How localized solar, wind, and battery storage systems are bypassing centralized fossil-fuel infrastructure in rural regions.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800",
      alt: "Wind turbine standing against a dramatic evening sky"
    },
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    categories: [{ title: "Energy", slug: { current: "energy" } }],
    author: { name: "Marcus Thorne" },
    isFeatured: false
  },
  {
    _id: "mock-7",
    title: "Farming the Kelp Forests: Carbon Drawdown",
    slug: { current: "farming-kelp-forests-carbon-drawdown" },
    hook: "Why kelp farming is the fastest growing sector in aquaculture, and how it actively pulls excess carbon dioxide directly from the sea.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
      alt: "Underwater kelp forest waving with the ocean current"
    },
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
    categories: [{ title: "Oceans", slug: { current: "oceans" } }],
    author: { name: "Sarah Lin" },
    isFeatured: false
  },
  {
    _id: "mock-8",
    title: "Hydroponics and the Urban Food Oasis",
    slug: { current: "hydroponics-urban-food-oasis" },
    hook: "Can vertical indoor farming satisfy metropolitan food demand without the carbon footprint of trans-continental shipping?",
    mainImage: {
      url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800",
      alt: "Indoor vertical farm with green leaf lettuce under purple grow lights"
    },
    publishedAt: new Date(Date.now() - 604800000).toISOString(),
    categories: [{ title: "Agriculture", slug: { current: "agriculture" } }],
    author: { name: "Elena Rostova" },
    isFeatured: false
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
    author->{ name },
    isFeatured
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
      author->{ name },
      isFeatured
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

  // 1. Identify Featured Article for the Side Panel
  // We look for the first post marked isFeatured. If none, fallback to the first post overall.
  const featuredArticle = posts.find((p: any) => p.isFeatured) || (posts.length > 0 ? posts[0] : null);

  // 2. Identify 5 Recent Articles for the Side Panel (excluding the featured article)
  const recentArticles = posts
    .filter((p: any) => p._id !== featuredArticle?._id)
    .slice(0, 5);

  // 3. For the main feed, we display:
  // - A main hero post (the very first post in the filtered list)
  // - Other posts in a 2-column grid
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

      {/* Two Column Layout: Main Feed (70%) + Side Panel (30%) */}
      <section className="px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative">
          
          {/* LEFT COLUMN: Main Feed (Hero + Grid) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-16">
            
            {/* Hero Post */}
            {heroPost && (
              <div className="w-full">
                <Link 
                  href={`/posts/${heroPost.slug.current}`} 
                  className="group block relative w-full overflow-hidden bg-black/5 aspect-[4/3] md:aspect-[16/9]"
                >
                  {heroPost.mainImage && (
                    <img 
                      src={heroPost.mainImage.url ? heroPost.mainImage.url : (urlForImage(heroPost.mainImage)?.url() || '')} 
                      alt={heroPost.title}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-semibold">
                        {heroPost.publishedAt ? new Date(heroPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                      </span>
                      {heroPost.categories && heroPost.categories.length > 0 && (
                        <>
                          <span className="text-white/30 text-xs">/</span>
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent-light)]">
                            {heroPost.categories[0].title}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-display text-white max-w-3xl group-hover:text-white/85 transition-colors duration-500 leading-tight">
                      {heroPost.title}
                    </h2>
                    {heroPost.hook && (
                      <p className="text-white/70 font-light leading-relaxed max-w-xl hidden md:block text-xs md:text-sm">
                        {heroPost.hook}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            )}

            {/* Articles Grid (2 Column) */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                {gridPosts.map((post: any) => (
                  <Link 
                    href={`/posts/${post.slug.current}`} 
                    key={post._id}
                    className="group flex flex-col gap-4"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/5 rounded-sm">
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
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-black/60 font-semibold">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                        </span>
                        {post.categories && post.categories.length > 0 && (
                          <>
                            <span className="text-black/20 text-xs">/</span>
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold">
                              {post.categories[0].title}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-display text-black group-hover:text-black/60 transition-colors duration-500 leading-tight">
                        {post.title}
                      </h3>
                      {post.hook && (
                        <p className="text-black/60 font-light leading-relaxed mt-1 text-xs md:text-sm line-clamp-2">
                          {post.hook}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {posts.length === 0 && (
              <div className="text-black/50 text-xl font-light italic border-t border-black/5 pt-12">
                No articles published in this category yet.
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Side Panel (30%) */}
          <aside className="w-full lg:w-[30%] flex flex-col gap-12 border-t lg:border-t-0 lg:border-l border-black/10 pt-12 lg:pt-0 lg:pl-10 relative">
            <div className="sticky top-28 flex flex-col gap-12">
              
              {/* Featured Article Block */}
              {featuredArticle && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                    Featured Story
                  </h4>
                  <Link 
                    href={`/posts/${featuredArticle.slug.current}`}
                    className="group flex flex-col gap-4"
                  >
                    {featuredArticle.mainImage && (
                      <div className="w-full aspect-[16/10] overflow-hidden bg-black/5 rounded-sm">
                        <img 
                          src={featuredArticle.mainImage.url ? featuredArticle.mainImage.url : (urlForImage(featuredArticle.mainImage)?.url() || '')} 
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-black/50">
                        {featuredArticle.categories?.[0]?.title || 'Featured'}
                      </span>
                      <h5 className="text-lg md:text-xl font-display text-black group-hover:text-black/60 transition-colors leading-snug">
                        {featuredArticle.title}
                      </h5>
                      <p className="text-black/60 font-light text-xs leading-relaxed line-clamp-2">
                        {featuredArticle.hook}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* 5 Recent Articles List */}
              {recentArticles.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-6 font-bold">
                    Recent Stories
                  </h4>
                  <div className="flex flex-col gap-6">
                    {recentArticles.map((rec: any) => (
                      <Link 
                        href={`/posts/${rec.slug.current}`} 
                        key={`recent-${rec._id}`}
                        className="group flex gap-4 items-center"
                      >
                        {rec.mainImage && (
                          <div className="w-14 h-14 shrink-0 overflow-hidden bg-black/5 rounded-sm">
                            <img 
                              src={rec.mainImage.url ? rec.mainImage.url : (urlForImage(rec.mainImage)?.url() || '')} 
                              alt={rec.title}
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <h5 className="text-xs md:text-sm font-display text-black group-hover:text-black/60 transition-colors leading-snug font-medium line-clamp-2">
                            {rec.title}
                          </h5>
                          <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-black/40">
                            {rec.publishedAt ? new Date(rec.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
