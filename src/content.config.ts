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

/**
 * Chinese versions of event pages, one file per event in src/content/events-zh/<same-slug>.md.
 * Only the fields that read differently in Chinese; date, image and RSVP settings come from the English file.
 * Events without a file here fall back to `titleZh` (if set) and the English summary and body.
 */
const eventsZh = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events-zh" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    time: z.string().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    rsvpLabel: z.string().optional(),
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
    /** Silhouette shown until a headshot is added. Defaults to the male/neutral bust. */
    avatar: z.enum(["male", "female"]).optional(),
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
    /** Chinese twins shown on /zh/ pages. Leave out for entries already written in Chinese. */
    questionZh: z.string().optional(),
    answerZh: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { events, eventsZh, board, sponsors, faq };
