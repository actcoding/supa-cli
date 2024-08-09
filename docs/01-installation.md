# Installation

!!! tip

    We recommend using [Bun](https://bun.sh) as your package manager.

    While other package managers might technically work too, we only use Bun for testing.
    Additionally, the pure TypeScript files are shipped in the current packages's state.

## Environment

The following environment variables are **required** when working with linked projects:

| Name | Description |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | An [access token](https://supabase.com/dashboard/account/tokens) to access the management api. |
| `SUPABASE_PASSWORD` | The database password. |
| `SUPABASE_ANON_KEY` | The anonymous key. |
| `SUPABASE_SERVICE_KEY` | The service key. |

Create a `.env` file in your project root with these variables set.

## Install

```shell
bun add -d @actcoding/supa-cli
```

That's it!

Run the following command to verify everything is working fine:

```shell
bunx supa --version
```

## Shortcut

You might want to create a shortcut script in your project root with the
following content:

```shell title="supa"
#!/bin/sh

bun run cli/index.ts $*
```

We like to call it just `supa`, but you may use any name you want.

Don't forget to make it executable:

```sh
chmod +x ./supa
```
