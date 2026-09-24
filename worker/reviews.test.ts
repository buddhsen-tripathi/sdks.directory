import { describe, expect, test } from "bun:test";
import {
  bodyKey,
  inferAgent,
  normalizeAgent,
  normalizeReviewBody,
  parseStars,
  reviewHandle,
} from "./review-input";

describe("agent review handles", () => {
  test("known agents collapse to a short slug", () => {
    expect(normalizeAgent("Claude")).toBe("claude");
    expect(normalizeAgent("ChatGPT")).toBe("chatgpt");
    expect(normalizeAgent("claude code")).toBe("claude");
    expect(normalizeAgent("GitHub Copilot")).toBe("copilot");
    expect(normalizeAgent("Grok")).toBe("grok");
    expect(normalizeAgent("Cursor")).toBe("cursor");
  });

  test("unknown agents get a readable slug", () => {
    expect(normalizeAgent("Windsurf")).toBe("windsurf");
    expect(normalizeAgent("My Agent")).toBe("myagent");
  });

  test("crawler and generic names are rejected", () => {
    expect(normalizeAgent("googlebot")).toBeNull();
    expect(normalizeAgent("user")).toBeNull();
    expect(normalizeAgent("a")).toBeNull();
  });

  test("handle is agent plus six digits", () => {
    expect(reviewHandle("claude", "482913")).toBe("claude-482913");
    expect(reviewHandle("chatgpt", "004821")).toBe("chatgpt-004821");
  });

  test("user agent inference skips crawlers", () => {
    expect(inferAgent("Claude-User/1.0")).toBe("claude");
    expect(inferAgent("ChatGPT-User")).toBe("chatgpt");
    expect(inferAgent("Mozilla/5.0 (compatible; AhrefsBot/7.0)")).toBeNull();
    expect(inferAgent("Mozilla/5.0")).toBeNull();
  });
});

describe("review body and stars", () => {
  test("accepts one or two lines inside the length window", () => {
    expect(normalizeReviewBody("Search found the Stripe skill fast.")).toEqual({
      ok: true,
      body: "Search found the Stripe skill fast.",
    });
    expect(
      normalizeReviewBody("Clear install paths.\nSkill bodies were inline."),
    ).toEqual({
      ok: true,
      body: "Clear install paths.\nSkill bodies were inline.",
    });
  });

  test("rejects a third line, a short note, and a long note", () => {
    expect(normalizeReviewBody("one\ntwo\nthree").ok).toBe(false);
    expect(normalizeReviewBody("too short").ok).toBe(false);
    expect(normalizeReviewBody("x".repeat(181)).ok).toBe(false);
    expect(normalizeReviewBody(5).ok).toBe(false);
  });

  test("stars are integers 1 through 5", () => {
    expect(parseStars(5)).toBe(5);
    expect(parseStars("4")).toBe(4);
    expect(parseStars(4.5)).toBeNull();
    expect(parseStars(0)).toBeNull();
    expect(parseStars(6)).toBeNull();
  });

  test("duplicate check ignores case and extra space", () => {
    expect(bodyKey("Hello  there")).toBe(bodyKey("hello there"));
  });
});
