"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle, CircleCheck } from "lucide-react";
import { docUrl, lessons } from "@/lib/doc-catalog";

const key = "rc-learn-v1";
function readCompleted(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value)
      ? lessons.map((lesson) => lesson.slug).filter((slug) => value.includes(slug))
      : [];
  } catch {
    return [];
  }
}

function useProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    const load = () => setCompleted(readCompleted());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  function toggle(slug: string) {
    const next = completed.includes(slug)
      ? completed.filter((value) => value !== slug)
      : [...completed, slug];
    setCompleted(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Progress remains available on this page. */
    }
  }
  return { completed, toggle };
}

export function LessonCompletion({ slug }: { readonly slug: string }) {
  const { completed, toggle } = useProgress();
  const done = completed.includes(slug);
  return (
    <button
      type="button"
      className="btn secondary lesson-complete"
      aria-pressed={done}
      onClick={() => toggle(slug)}
    >
      {done ? <CircleCheck size={17} /> : <Circle size={17} />}{" "}
      {done ? "Lesson complete" : "Mark lesson complete"}
    </button>
  );
}

export function CoursePath() {
  const { completed } = useProgress();
  const next = lessons.find((lesson) => !completed.includes(lesson.slug));
  let action = "Start course";
  if (completed.length) action = next ? "Continue course" : "Review course";
  return (
    <div className="course-grid">
      <aside className="course-panel">
        <div className="section-kicker">Your progress</div>
        <div className="course-total">
          {completed.length}
          <small> / {lessons.length} lessons</small>
        </div>
        <progress value={completed.length} max={lessons.length} aria-label="Course progress" />
        <p>Mark each lesson complete as you go. Progress is saved in this browser.</p>
        <Link className="btn primary" href={docUrl(next ?? lessons[0])}>
          {action}
          <ArrowRight size={16} />
        </Link>
      </aside>
      <ol className="lesson-list">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link href={docUrl(lesson)}>
              <span className="lesson-num">
                {completed.includes(lesson.slug) ? (
                  <Check size={21} aria-label="Completed" />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.summary}</p>
              </div>
              <ArrowRight size={19} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
