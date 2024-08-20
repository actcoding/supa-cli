# db:reset

> Re-creates the local database

## Usage

```shell
db:reset [options]
```

## Options

### Local

* `-m, --migrate` - Run migrations afterwards

* `-s, --seed` - Seed the database afterwards

* `-t, --typegen` - Generate types afterwards

### Global

* `-V, --version` - output the version number

* `-v, --verbose` - Increase output level

* `-f, --force` - Force the operation to run without asking for confirmation.

* `--linked` - Works with the linked database instead of the local one.
