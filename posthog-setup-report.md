# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Hitbox AI. PostHog is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse-proxy ingestion route at `/ingest` to bypass ad blockers. A shared server-side client in `lib/posthog-server.ts` handles all server action tracking. Users are identified by their InsForge user ID immediately after OAuth callback and again on every dashboard page load for returning sessions.

| Event Name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary "Validate Your Concept" or secondary "Start For Free" CTA on the homepage. | `components/homepage/Hero.tsx` |
| `login_provider_selected` | User clicks the Google or GitHub OAuth login button. | `app/(auth)/login/page.tsx` |
| `login_failed` | An error is displayed after a failed OAuth sign-in attempt. | `app/(auth)/login/page.tsx` |
| `oauth_callback_succeeded` | OAuth code exchange completes successfully; user redirected to onboarding or dashboard. | `app/(auth)/callback/page.tsx` |
| `oauth_callback_failed` | OAuth code exchange fails and an error is shown. Also sends `captureException`. | `app/(auth)/callback/page.tsx` |
| `onboarding_completed` | User successfully submits a username and is redirected to dashboard. Calls `identify`. | `app/onboarding/onboarding-form.tsx` |
| `onboarding_failed` | Username submission fails with a server error. | `app/onboarding/onboarding-form.tsx` |
| `project_context_changed` | User selects a different active game project from the navbar dropdown. | `components/layout/Navbar.tsx` |
| `sign_out_clicked` | Authenticated user clicks sign out; also calls `posthog.reset()`. | `components/layout/Navbar.tsx` |
| `initialize_project_clicked` | User clicks "Initialize Project" on the empty-state dashboard. | `app/dashboard/page.tsx` |
| `start_new_project_clicked` | User clicks "Start New Project" on the empty-state projects page. | `app/projects/page.tsx` |
| `sign_in_initiated` | Server action successfully starts the OAuth flow (server-side). | `actions/auth.ts` |
| `user_profile_updated` | Server action updates the user's username. Also calls server-side `identify`. | `actions/auth.ts` |
| `sign_out_completed` | Server action completes sign-out (server-side). | `actions/auth.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/497595/dashboard/1800777)
- [User Signup Funnel](https://us.posthog.com/project/497595/insights/LUqJbcyn)
- [Hero CTA Clicks Over Time](https://us.posthog.com/project/497595/insights/OLYB12yK)
- [Auth Events Trend](https://us.posthog.com/project/497595/insights/zGUdlxjK)
- [Login & Auth Failure Rate](https://us.posthog.com/project/497595/insights/f7YoNI8D)
- [Project Engagement Actions](https://us.posthog.com/project/497595/insights/aHbI75yh)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent bundler step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `IdentifyUser` component on the dashboard page handles this, but verify it fires correctly by logging in, refreshing the page, and checking that a named person profile appears in PostHog.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
