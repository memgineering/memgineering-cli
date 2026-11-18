# Security policy

## Reporting a vulnerability

Please report security problems privately, by email to
**support@memgineering.com**, with "security" in the subject line. Do not open
a public issue for them.

It helps to include:

- the package and version (`memgineering --version`) and your operating system;
- what someone could do with the problem, and the steps to reproduce it;
- anything the problem depends on, such as a setting, a second machine or a
  hosted account.

The maintainer reads this mailbox. Please give us time to publish a fix before
you disclose the problem publicly, and say whether you would like to be
credited.

## Scope

- The npm packages in this repository (currently `memgineering`).
- The hosted memgineering services they connect to.

When you test, use only your own account and your own data. Do not read or
change other people's notes or accounts, and do not put load on the service
that could slow it down for anyone else.

## Supported versions

Security fixes are released as a new version on npm. Use the latest one:
`npm i -g memgineering@latest`, or `memgineering update`.
