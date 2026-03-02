import { describe, expect, it } from "vitest";
import { deriveSectionEditEvents } from "@/lib/style-learning";

describe("style-learning lib", () => {
  it("derives section edit events from changed note sections", () => {
    const events = deriveSectionEditEvents({
      userId: "user_1",
      visitId: "visit_1",
      templateId: "template_1",
      previousNoteData: [
        { title: "Subjective", content: "Patient reports mild pain." },
        { title: "Assessment", content: "Initial assessment." },
      ],
      nextNoteData: [
        { title: "Subjective", content: "Patient reports moderate pain." },
        { title: "Assessment", content: "Initial assessment." },
      ],
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      userId: "user_1",
      visitId: "visit_1",
      templateId: "template_1",
      sectionTitle: "Subjective",
      metadata: { source: "visit_patch" },
    });
  });

  it("does not produce events when note content is unchanged", () => {
    const events = deriveSectionEditEvents({
      userId: "user_1",
      visitId: "visit_1",
      previousNoteData: [{ title: "Plan", content: "Continue PT." }],
      nextNoteData: [{ title: "Plan", content: "Continue PT." }],
    });

    expect(events).toHaveLength(0);
  });
});

