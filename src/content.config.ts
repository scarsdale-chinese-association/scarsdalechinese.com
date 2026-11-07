import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleZh: z.string().optional(),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      address: z.string().optional(),
      summary: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      rsvpUrl: z.string().url().optional(),
      rsvpLabel: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});

const board = defineCollection({
  loader: file("./src/content/data/board.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    nameZh: z.string().optional(),
    role: z.string(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const sponsors = defineCollection({
  loader: file("./src/content/data/sponsors.json"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      name: z.string(),
      tier: z.enum(["top", "sponsor", "partner"]),
      image: image(),
      url: z.string().url().optional(),
      order: z.number(),
    }),
});

const faq = defineCollection({
  loader: file("./src/content/data/faq.json"),
  schema: z.object({
    id: z.string(),
    page: z.enum(["membership", "sponsors", "senior-club"]),
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

export const collections = { events, board, sponsors, faq };
