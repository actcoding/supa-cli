# Installation

## Preamble

We recommend using [Bun](https://bun.sh) as your package manager.

While other package managers might technically work too, we only use Bun for testing.
Additionally, the pure TypeScript files are shipped in the current packages's state.

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

```shell
#!/bin/sh

bun run cli/index.ts $*
```

We like to call it just `supa`, but you may use any name you want.

Don't forget to make it executable:

```sh
chmod +x ./supa
```
