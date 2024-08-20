Title:   supabaseStatus
Summary:
Resolves various variables for interacting with a Supabase instance.

# `supabaseStatus(): SupabaseStatus`

>

Resolves various variables for interacting with a Supabase instance.

## Return value

`SupabaseStatus`

An object holding various information about the Supabase environment.

### Examples

`SupabaseStatus` is an object of the following shape:

```json
{
 "ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
 "API_URL": "http://127.0.0.1:54321",
 "DB_URL": "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
 "GRAPHQL_URL": "http://127.0.0.1:54321/graphql/v1",
 "INBUCKET_URL": "http://127.0.0.1:54324",
 "JWT_SECRET": "super-secret-jwt-token-with-at-least-32-characters-long",
 "S3_PROTOCOL_ACCESS_KEY_ID": "625729a08b95bf1b7ff351a663f3a23c",
 "S3_PROTOCOL_ACCESS_KEY_SECRET": "850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907",
 "S3_PROTOCOL_REGION": "local",
 "SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
 "STORAGE_S3_URL": "http://127.0.0.1:54321/storage/v1/s3",
 "STUDIO_URL": "http://127.0.0.1:54323"
}
```

See [the Supabase documentation](https://supabase.com/docs/reference/cli/supabase-status) for reference.

## Usage

```js
import { supabaseStatus } from '@actcoding/supa-cli'
```