# src/lib/mattermost/CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the `src/lib/mattermost/` directory.

> **Context pressure:** This is a leaf-level context. For the pod instantiation route that calls this module, see `src/app/api/CLAUDE.md`.

## What this module does

- Creates a channel for each new pod: `POST /api/v4/channels`, named `pod-<pod_id>`
- Sends a welcome DM to each new pod member with their ladder position and Jitsi link
- Sends a facilitator brief DM to the pod facilitator
- Posts session reminders when a session record is created

## Hard constraints

- **Never read member channel messages.** `GET /api/v4/channels/{id}/posts` and any equivalent endpoint are off-limits. The bot is send-only.
- **Never act on message events.** No webhooks or subscriptions that read message content.

## Naming conventions

- Channel name: `pod-<pod_id>` — deterministic, no slug needed
- Jitsi link: `https://meet.jit.si/<pod_id>-<session_slug>` — generated locally, no external call

## Client

All calls go through `lib/mattermost/client.ts`. Never call the Mattermost REST API directly from feature code or API routes.

## Env vars

- `MATTERMOST_BASE_URL` — e.g. `https://chat.wwwrise.org`
- `MATTERMOST_BOT_TOKEN` — bot user token (send permissions only)
