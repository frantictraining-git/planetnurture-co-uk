import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 60; // Revalidate every 60 seconds

const POST_QUERY = `*[ _type == "post" && slug.current == $slug ][0] {
  _id,
  title,
  mainImage,
  body,
  publishedAt,
  categories[]->{ title, slug },
  author->{ name, role, image },
  estimatedReadingTime,
  relatedPosts[]->{ _id, title, slug, mainImage, publishedAt }
}`;

const SIDEBAR_QUERY = `{
  "categories": *[_type == "category"] | order(title asc) { _id, title, slug },
  "featured": *[_type == "post" && isFeatured == true && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...4] { _id, title, slug, mainImage, publishedAt },
  "recent": *[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...4] { _id, title, slug, mainImage, publishedAt }
}`;

// Rich mock data to fall back on
const MOCK_POSTS: Record<string, any> = {
  "restorative-power-of-urban-rewilding": {
    _id: "mock-1",
    title: "The Restorative Power of Urban Rewilding",
    hook: "How bringing native forests back into our cities is reclaiming lost biodiversity, cooling urban spaces, and reconnecting communities with the wild.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
      caption: "Native flora reclaiming space within an engineered urban corridor."
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Conservation", slug: { current: "conservation" } }],
    author: { 
      name: "Elena Rostova", 
      role: "Lead Ecologist & Writer",
      image: { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" } 
    },
    estimatedReadingTime: 6,
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [{ _key: "s1", _type: "span", text: "Urban centers have long been conceived as the antithesis of nature—concrete monoliths built to contain human activity while pushing the biosphere to the fringes. However, a growing global movement known as rewilding is challenging this dynamic, demonstrating that cities can become vital sanctuaries for biodiversity." }]
      },
      {
        _key: "b2",
        _type: "block",
        style: "normal",
        children: [{ _key: "s2", _type: "span", text: "Rewilding is not merely landscaping; it is the deliberate hands-off restoration of ecosystems, allowing natural processes to reclaim dominance. When applied to cities, this means replacing manicured lawns with native wildflowers, transforming concrete canals into bio-swales, and planting dense, multi-layered pocket forests using methods like the Miyawaki technique." }]
      },
      {
        _key: "q1",
        _type: "block",
        style: "blockquote",
        children: [{ _key: "s3", _type: "span", text: "We aren't just planting trees; we are re-establishing the complex network of relationships that allows biodiversity to heal itself." }]
      },
      {
        _key: "b3",
        _type: "block",
        style: "h2",
        children: [{ _key: "s4", _type: "span", text: "The Microclimate Miracle" }]
      },
      {
        _key: "b4",
        _type: "block",
        style: "normal",
        children: [{ _key: "s5", _type: "span", text: "Beyond ecological integrity, urban rewilding addresses one of the most pressing dangers of climate change in cities: the urban heat island effect. Concrete and asphalt absorb solar radiation, releasing it slowly and raising city temperatures by up to 10°C compared to nearby rural areas. Native woodland pockets transpire moisture and cast deep shade, creating localized cooling cells that make neighborhoods noticeably more livable." }]
      }
    ],
    relatedPosts: [
      { _id: "mock-3", title: "Deep Ocean Ecosystems Under Immediate Threat", slug: { current: "deep-ocean-ecosystems-under-threat" }, mainImage: { url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() },
      { _id: "mock-4", title: "Regenerative Agriculture: Healing Our Soils", slug: { current: "regenerative-agriculture-healing-soils" }, mainImage: { url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
    ]
  },
  "decarbonizing-the-grid-solar-frontier": {
    _id: "mock-2",
    title: "Decarbonizing the Grid: The Solar Frontier",
    hook: "A deep dive into the engineering breakthroughs driving new photovoltaic cells past 30% efficiency, paving the way for a fossil-free future.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200",
      caption: "Advanced silicon-perovskite tandem cells ready for validation."
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Energy", slug: { current: "energy" } }],
    author: { 
      name: "Marcus Thorne", 
      role: "Climate Tech Journalist",
      image: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" } 
    },
    estimatedReadingTime: 5,
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [{ _key: "s1", _type: "span", text: "Solar energy has long been the cornerstone of the transition to renewable grids, but traditional silicon photovoltaic cells have begun hitting their theoretical physical boundaries. Known as the Shockley-Queisser limit, standard single-junction silicon cells can convert a maximum of about 29% of sunlight into electricity. In commercial practice, most operate between 18% and 22%." }]
      },
      {
        _key: "b2",
        _type: "block",
        style: "h2",
        children: [{ _key: "s2", _type: "span", text: "The Promise of Perovskite Tandems" }]
      },
      {
        _key: "b3",
        _type: "block",
        style: "normal",
        children: [{ _key: "s3", _type: "span", text: "To break through this barrier, materials scientists are turning to a crystalline structure called perovskite. By layering a thin film of perovskite over a traditional silicon base, engineers create a 'tandem cell.' The perovskite layer is tuned to capture high-energy blue and green light, while the underlying silicon absorbs the lower-energy red and infrared spectrum. This combined approach has already achieved laboratory efficiencies exceeding 33%." }]
      }
    ],
    relatedPosts: [
      { _id: "mock-1", title: "The Restorative Power of Urban Rewilding", slug: { current: "restorative-power-of-urban-rewilding" }, mainImage: { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
    ]
  },
  "deep-ocean-ecosystems-under-threat": {
    _id: "mock-3",
    title: "Deep Ocean Ecosystems Under Immediate Threat",
    hook: "Exploring the mysterious twilight zones of our oceans and why upcoming deep-sea mining proposals pose an existential risk to marine life.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=1200",
      caption: "Benthic life on the ocean floor, thousands of meters deep."
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Oceans", slug: { current: "oceans" } }],
    author: { 
      name: "Sarah Lin", 
      role: "Marine Biologist",
      image: { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" } 
    },
    estimatedReadingTime: 8,
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [{ _key: "s1", _type: "span", text: "The deep sea remains the least explored ecosystem on our planet, yet it is currently at the center of a major geopolitical debate. Companies and nations are eyeing the abyssal plains for polymetallic nodules—potato-sized rocks rich in cobalt, nickel, and manganese, crucial for producing electric vehicle batteries." }]
      },
      {
        _key: "b2",
        _type: "block",
        style: "h2",
        children: [{ _key: "s2", _type: "span", text: "An Irreversible Disruption" }]
      },
      {
        _key: "b3",
        _type: "block",
        style: "normal",
        children: [{ _key: "s3", _type: "span", text: "These nodules take millions of years to form and support highly specialized, slow-growing ecosystems of sponges, corals, and unique micro-organisms. Dredging them would not only destroy these habitats outright but would also create massive underwater sediment plumes, choking filter feeders for miles around. Ecologists warn that the destruction of benthic plains could disrupt ocean carbon cycles, with repercussions reaching the upper atmosphere." }]
      }
    ],
    relatedPosts: [
      { _id: "mock-1", title: "The Restorative Power of Urban Rewilding", slug: { current: "restorative-power-of-urban-rewilding" }, mainImage: { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
    ]
  },
  "regenerative-agriculture-healing-soils": {
    _id: "mock-4",
    title: "Regenerative Agriculture: Healing Our Soils",
    hook: "Why industrial farming is depleting Earth's topsoil and how multi-crop rotating, cover cropping, and zero-tillage can restore balance.",
    mainImage: {
      url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200",
      caption: "Polyculture farms supporting soil microbial health."
    },
    publishedAt: new Date().toISOString(),
    categories: [{ title: "Agriculture", slug: { current: "agriculture" } }],
    author: { 
      name: "Elena Rostova", 
      role: "Lead Ecologist & Writer",
      image: { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" } 
    },
    estimatedReadingTime: 6,
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [{ _key: "s1", _type: "span", text: "Modern agricultural systems rely heavily on chemical inputs and mechanical tilling to maintain yields, but this model has led to severe soil degradation. According to the UN, a third of the world's topsoil is already degraded, threatening food security and compounding carbon release." }]
      },
      {
        _key: "b2",
        _type: "block",
        style: "h2",
        children: [{ _key: "s2", _type: "span", text: "Restoring the Living Underworld" }]
      },
      {
        _key: "b3",
        _type: "block",
        style: "normal",
        children: [{ _key: "s3", _type: "span", text: "Regenerative agriculture treats the soil as a living organism. By employing no-till farming, farmers leave soil mycorrhizal networks intact. Cover cropping ensures the soil is never bare, preventing erosion and keeping organic carbon locked underground. This system not only sequesters carbon but creates highly resilient farms capable of withstanding extreme droughts." }]
      }
    ],
    relatedPosts: [
      { _id: "mock-2", title: "Decarbonizing the Grid: The Solar Frontier", slug: { current: "decarbonizing-the-grid-solar-frontier" }, mainImage: { url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
    ]
  }
};

const FALLBACK_SIDEBAR = {
  categories: [
    { _id: "c-1", title: "Conservation", slug: { current: "conservation" } },
    { _id: "c-2", title: "Energy", slug: { current: "energy" } },
    { _id: "c-3", title: "Oceans", slug: { current: "oceans" } },
    { _id: "c-4", title: "Agriculture", slug: { current: "agriculture" } }
  ],
  featured: [
    { _id: "mock-1", title: "The Restorative Power of Urban Rewilding", slug: { current: "restorative-power-of-urban-rewilding" }, mainImage: { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
  ],
  recent: [
    { _id: "mock-2", title: "Decarbonizing the Grid: The Solar Frontier", slug: { current: "decarbonizing-the-grid-solar-frontier" }, mainImage: { url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() },
    { _id: "mock-3", title: "Deep Ocean Ecosystems Under Immediate Threat", slug: { current: "deep-ocean-ecosystems-under-threat" }, mainImage: { url: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800" }, publishedAt: new Date().toISOString() }
  ]
};

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref && !value?.url) {
        return null;
      }
      return (
        <div className="my-16 w-full">
          <img
            alt={value.alt || 'Article Image'}
            loading="lazy"
            src={value.url ? value.url : (urlForImage(value)?.url() || '')}
            className="w-full h-auto object-cover rounded"
          />
          {value.caption && (
            <p className="text-center text-[10px] font-mono uppercase tracking-widest text-black/40 mt-4">{value.caption}</p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-display mt-16 mb-6 text-black leading-tight tracking-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-display mt-12 mb-4 text-black/80">{children}</h3>,
    normal: ({ children }: any) => <p className="text-base md:text-lg font-body text-black/70 leading-[1.75] mb-6 font-light">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-12 relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-[var(--color-accent)] pl-6 md:pl-8">
        <div className="text-xl md:text-2xl font-display text-black italic leading-[1.3] tracking-tight">{children}</div>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-black">{children}</strong>,
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-black underline decoration-black/20 hover:decoration-[var(--color-accent)] underline-offset-4 transition-colors">
          {children}
        </a>
      );
    },
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  let post = null;
  let sidebarData = FALLBACK_SIDEBAR;
  let isUsingFallback = false;

  try {
    const [fetchedPost, fetchedSidebar] = await Promise.all([
      client.fetch(POST_QUERY, { slug: resolvedParams.slug }),
      client.fetch(SIDEBAR_QUERY, { slug: resolvedParams.slug })
    ]);

    post = fetchedPost;
    sidebarData = fetchedSidebar;
    
    // Fallback to mock data if Sanity dataset is empty
    if (!post && MOCK_POSTS[resolvedParams.slug]) {
      post = MOCK_POSTS[resolvedParams.slug];
      isUsingFallback = true;
    }
  } catch (error) {
    console.warn("Error fetching from Sanity, falling back to mock data:", error);
    post = MOCK_POSTS[resolvedParams.slug];
    isUsingFallback = true;
  }

  if (isUsingFallback) {
    const allMockPosts = Object.values(MOCK_POSTS);
    sidebarData = {
      categories: FALLBACK_SIDEBAR.categories,
      featured: allMockPosts
        .filter((p: any) => p.isFeatured && p.slug.current !== resolvedParams.slug)
        .slice(0, 4),
      recent: allMockPosts
        .filter((p: any) => p.slug.current !== resolvedParams.slug)
        .slice(0, 4)
    };
  }

  if (!post) {
    notFound();
  }

  const readTime = post.estimatedReadingTime || 5;
  const shareUrl = `https://planetnurture.co.uk/posts/${resolvedParams.slug}`;

  return (
    <main className="bg-[#f6f5f2] w-full min-h-screen pb-32">
      {/* Article Hero Header */}
      <section className="pt-32 pb-12 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-4 mb-12 group">
          <div className="w-8 h-[1px] bg-black/30 group-hover:w-16 group-hover:bg-[var(--color-accent)] transition-all duration-500"></div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/50 group-hover:text-black transition-colors">Back to Journal</span>
        </Link>
        
        <div className="flex flex-col justify-between gap-6 max-w-4xl">
          <div className="flex items-center flex-wrap gap-4 mb-4">
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--color-accent)] font-semibold">
                  {post.categories[0].title}
                </span>
                <span className="text-black/20 text-xs">/</span>
              </>
            )}
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
            </span>
            <span className="text-black/20 text-xs">/</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50">
              {readTime} Min Read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-black leading-[1.1] tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Fallback Banner */}
        {isUsingFallback && (
          <div className="mt-8 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 p-4 rounded text-xs text-[var(--color-accent)] font-mono max-w-4xl">
            [Notice] Viewing mock article details. To populate live content, initialize your Sanity.io studio dataset at `kqmmq1b9`.
          </div>
        )}

        {/* Author Byline */}
        {post.author && (
          <div className="mt-12 flex items-center gap-4 border-t border-black/10 pt-6 max-w-4xl">
            {post.author.image && (
              <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                <img 
                  src={post.author.image.url ? post.author.image.url : (urlForImage(post.author.image)?.url() || '')} 
                  alt={post.author.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base font-display text-black">{post.author.name}</span>
              {post.author.role && (
                <span className="text-[9px] font-mono uppercase tracking-widest text-black/50 mt-0.5">{post.author.role}</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Main Hero Image */}
      {post.mainImage && (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 mb-16">
          <div className="w-full aspect-video md:aspect-[21/9] bg-black/5 overflow-hidden rounded-sm">
            <img 
              src={post.mainImage.url ? post.mainImage.url : (urlForImage(post.mainImage)?.url() || '')} 
              alt={post.mainImage.alt || post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {post.mainImage.caption && (
            <p className="text-center text-[10px] font-mono uppercase tracking-widest text-black/40 mt-4">{post.mainImage.caption}</p>
          )}
        </section>
      )}

      {/* Two-Column Layout */}
      <section className="px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
          
          {/* Social Share Sticky Sidebar (Desktop Only) */}
          <div className="hidden lg:flex flex-col items-center gap-6 sticky top-40 h-fit text-black/30">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Share</span>
            <div className="w-[1px] h-12 bg-black/10 mx-auto"></div>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="hover:text-[var(--color-accent)] transition-colors text-[10px] font-mono uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>X / Twitter</a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="hover:text-[var(--color-accent)] transition-colors text-[10px] font-mono uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>LinkedIn</a>
          </div>

          {/* Left Column: Body */}
          <div className="w-full lg:flex-1">
            {post.body ? (
              <div className="prose-custom max-w-3xl">
                <PortableText 
                  value={post.body} 
                  components={portableTextComponents}
                />
              </div>
            ) : (
              <p className="text-black/50 italic font-light">Content is empty.</p>
            )}

            {/* Mobile Share */}
            <div className="flex lg:hidden items-center gap-6 mt-12 pt-6 border-t border-black/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/40">Share:</span>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="text-xs font-mono uppercase tracking-widest text-black/60 hover:text-[var(--color-accent)]">X</a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="text-xs font-mono uppercase tracking-widest text-black/60 hover:text-[var(--color-accent)]">LinkedIn</a>
            </div>

            {/* Related Articles Footer */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-24 pt-12 border-t border-black/10">
                <h3 className="text-2xl font-display text-black mb-8">Read Next</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {post.relatedPosts.map((related: any) => (
                    <Link href={`/posts/${related.slug.current}`} key={related._id} className="group flex flex-col gap-4">
                      {related.mainImage && (
                        <div className="w-full aspect-[4/3] overflow-hidden bg-black/5 rounded-sm">
                          <img 
                            src={related.mainImage.url ? related.mainImage.url : (urlForImage(related.mainImage)?.url() || '')} 
                            alt={related.title} 
                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-750" 
                          />
                        </div>
                      )}
                      <h4 className="text-xl font-display text-black group-hover:text-black/60 transition-colors">{related.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (30%) */}
          <aside className="w-full lg:w-[30%] flex flex-col gap-12 border-t lg:border-t-0 lg:border-l border-black/10 pt-12 lg:pt-0 lg:pl-12 relative">
            {/* Categories */}
            {sidebarData.categories?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-6">Categories</h4>
                <ul className="flex flex-col gap-3">
                  {sidebarData.categories.map((cat: any) => (
                    <li key={cat._id}>
                      <Link 
                        href={`/?category=${cat.slug.current}`} 
                        className="text-black/60 hover:text-[var(--color-accent)] font-light transition-colors text-base"
                      >
                        {cat.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Featured */}
            {sidebarData.featured?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">Featured</h4>
                <div className="flex flex-col gap-8">
                  {sidebarData.featured.map((feat: any) => (
                    <Link 
                      href={`/posts/${feat.slug.current}`} 
                      key={feat._id}
                      className="group flex flex-col gap-3"
                    >
                      {feat.mainImage && (
                        <div className="w-full aspect-video overflow-hidden bg-black/5 rounded-sm">
                          <img 
                            src={feat.mainImage.url ? feat.mainImage.url : (urlForImage(feat.mainImage)?.url() || '')} 
                            alt={feat.title}
                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="text-lg font-display text-black group-hover:text-black/60 transition-colors leading-tight">
                          {feat.title}
                        </h5>
                        <span className="block mt-1 text-[9px] font-mono uppercase tracking-[0.2em] text-black/40">
                          {feat.publishedAt ? new Date(feat.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {sidebarData.recent?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/30 mb-6">Recent</h4>
                <div className="flex flex-col gap-8">
                  {sidebarData.recent.map((rec: any) => (
                    <Link 
                      href={`/posts/${rec.slug.current}`} 
                      key={rec._id}
                      className="group flex flex-col gap-3"
                    >
                      {rec.mainImage && (
                        <div className="w-full aspect-[4/3] overflow-hidden bg-black/5 rounded-sm">
                          <img 
                            src={rec.mainImage.url ? rec.mainImage.url : (urlForImage(rec.mainImage)?.url() || '')} 
                            alt={rec.title}
                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="text-lg font-display text-black group-hover:text-black/60 transition-colors leading-tight">
                          {rec.title}
                        </h5>
                        <span className="block mt-1 text-[9px] font-mono uppercase tracking-[0.2em] text-black/40">
                          {rec.publishedAt ? new Date(rec.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
