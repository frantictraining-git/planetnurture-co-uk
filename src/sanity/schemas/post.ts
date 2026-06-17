import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hook',
      title: 'Hook / Excerpt',
      type: 'text',
      description: 'A short, engaging description for the blog homepage.',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        { name: 'alt', type: 'string', title: 'Alternative text', options: { isHighlighted: true } },
        { name: 'caption', type: 'string', title: 'Caption', options: { isHighlighted: true } }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alternative text', options: { isHighlighted: true } },
            { name: 'caption', type: 'string', title: 'Caption', options: { isHighlighted: true } }
          ]
        }
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'estimatedReadingTime',
      title: 'Estimated Reading Time (Minutes)',
      type: 'number',
      description: 'Leave blank to auto-calculate based on body text length, or set a specific number.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'post' } }],
      description: 'Select articles to display in the Read Next section.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Toggle on to display this article in the featured sidebar or main hero position.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
