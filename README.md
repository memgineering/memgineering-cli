# memgineering-cli

The client code of [memgineering](https://memgineering.com), exactly as it is
published on npm.

| Folder                            | npm package                                                  | Version |
| --------------------------------- | ------------------------------------------------------------ | ------- |
| [`memgineering/`](./memgineering) | [`memgineering`](https://www.npmjs.com/package/memgineering) | 0.28.0  |

memgineering gives the AI tools you use one shared memory: a folder of notes
you own, read and written through one CLI. The package's own README is
[`memgineering/README.md`](./memgineering/README.md).

## Install

```bash
npm i -g memgineering
```

## What this repository holds

Each package folder is the npm tarball of that version, unpacked, byte for
byte: the same files `npm i -g memgineering` puts on your machine.
`dist/index.js` is the program as published, one bundled ES module, not
minified. The TypeScript it is built from is not in this repository.

To check the folder against the registry, from the root of this repository:

```bash
npm pack memgineering@0.28.0
mkdir check && tar -xzf memgineering-0.28.0.tgz -C check
diff -r check/package memgineering && echo identical
```

The registry's checksums for that tarball:

- shasum `fb924c26774d410e04f83bb773e5124ab2a8d37a`
- integrity
  `sha512-7JCONHKd1pD/utWtZ06x3nGi9ivb2DhnAO+O/J1yK2NSwFOFKGjkQch8+/C7WHtw6qmScXeArmDYI2Scvf8c+Q==`

Later releases are added as their own commits, so `git log -p memgineering/`
shows what changed between published versions.

The `repository` and `bugs` addresses inside `memgineering/package.json` 0.28.0
point to a repository that is not public. Use this one instead.

## Questions and bugs

Open an issue here, or mail support@memgineering.com. Report security problems
privately, never in an issue: see [SECURITY.md](./SECURITY.md).

## License

Apache License 2.0. [LICENSE](./LICENSE) and [NOTICE](./NOTICE) are copied
unchanged from the published package.
