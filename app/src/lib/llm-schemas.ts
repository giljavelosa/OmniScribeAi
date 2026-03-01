import { z } from "zod";

export const NoteSectionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
});

export const NoteSectionsSchema = z.array(NoteSectionSchema).min(1).max(60);

export const NoteAuditSchema = z.object({
  audit: z.object({
    issues: z.array(z.string()).default([]),
    clean: z.boolean(),
  }),
  summary: z.string().trim().min(1).max(1000),
});

export type NoteSection = z.infer<typeof NoteSectionSchema>;
export type NoteSections = z.infer<typeof NoteSectionsSchema>;
export type NoteAudit = z.infer<typeof NoteAuditSchema>;
