// ─── Field Whitelists for Admin Updates ───
// Prevents arbitrary field injection via .update(body)

// ─── Courses ───

const ALLOWED_COURSE_FIELDS = [
    "title",
    "description",
    "subtitle",
    "emoji",
    "level",
    "is_free",
    "published",
    "order_index",
] as const;

export function sanitizeCourseUpdate(
    body: Record<string, unknown>
): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_COURSE_FIELDS) {
        if (key in body) sanitized[key] = body[key];
    }
    return sanitized;
}

// ─── Modules ───

const ALLOWED_MODULE_FIELDS = ["title", "order_index"] as const;

export function sanitizeModuleUpdate(
    body: Record<string, unknown>
): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_MODULE_FIELDS) {
        if (key in body) sanitized[key] = body[key];
    }
    return sanitized;
}

// ─── Lessons ───

const ALLOWED_LESSON_FIELDS = [
    "title",
    "youtube_url",
    "duration",
    "content_markdown",
    "xp_reward",
    "order_index",
    "notes",
    "guide",
    "action_links",
] as const;

export function sanitizeLessonUpdate(
    body: Record<string, unknown>
): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_LESSON_FIELDS) {
        if (key in body) sanitized[key] = body[key];
    }
    return sanitized;
}

// ─── Quiz Questions ───

const ALLOWED_QUIZ_FIELDS = [
    "type",
    "question",
    "options",
    "correct_index",
    "explanation",
    "xp",
    "order_index",
] as const;

export function sanitizeQuizUpdate(
    body: Record<string, unknown>
): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const key of ALLOWED_QUIZ_FIELDS) {
        if (key in body) sanitized[key] = body[key];
    }
    return sanitized;
}
