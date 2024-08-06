# @actcoding/supa-cli

> Advanced CLI tooling for Supabase.

This project provides an [`artisan`](https://laravel.com/docs/artisan)-like experience
for [Supabase](https://supabase.com/) projects.

We're also collecting all the experience we've had with Supabase projects in the past within this repository.

## Features

- TypeScript migrations and seeders using [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- Email templates using [MJML](https://mjml.io/)
- Auth debugging

## Configuration

Configuration is done via environment variables. The CLI uses [dotenv](https://www.npmjs.com/package/dotenv) for parsing.

The following environment variables are **required** when working with linked projects:

| Name | Description |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | An [access token](https://supabase.com/dashboard/account/tokens) to access the management api. |
| `SUPABASE_PASSWORD` | The database password. |
| `SUPABASE_ANON_KEY` | The anonymous key. |
| `SUPABASE_SERVICE_KEY` | The service key. |

## Todo

- i18n for emails
- tests
- use something other than `commander.js`
