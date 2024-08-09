# Configuration

!!! warning

    Before configuring the CLI, make sure to set the [**required environment variables**](01-installation.md#environment).

While the CLI generally follows a *zero-config* approach, there are options you might want to configure.

## Location

The config can be stored in one of three location:

- `(project root)/.config/supa-cli.json`
- `(project root)/supabase/supa-cli.json`
- `(project root)/supa-cli.json`

The locations are checked from first to last and the first match is used.

## Format

The config file is a plain JSON file.

We provide a JSON schema which you may use, e.g.:

```json title=".config/supa-cli.json"
{
    "$schema": "../node_modules/@actcoding/supa-cli/config.schema.json",
    // ...
}

```

## Options

### `typeFiles`

Specifies the file locations of the generated database types when running `db:typegen`.

Default:

```js
[
    'db.ts',
]
```
