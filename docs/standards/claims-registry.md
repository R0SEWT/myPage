# Claims Registry Standard

## Purpose

`evidence/claims.md` is the traceability registry for claims that may appear in the CV, website, or agent responses.

## Required Fields

Each claim block must contain:

- `claim_id`: stable short identifier
- `surface`: `cv`, `web`, or `both`
- `publicable`: `yes` or `no`
- `claim`: factual statement
- `supports`: one or more support references

## Support Types

Allowed support prefixes:

- `repo`
- `public_url`
- `paper`
- `vault_doc`
- `screenshot`

`vault_doc` may point to private PDFs, publisher records, or private email exports indexed in `.cv-vault/INDEX.md`.

## Writing Rules

- Keep claims factual and compact.
- Use `publicable: no` for internal or work-sensitive claims.
- Avoid large bundled claims when smaller verifiable claims are possible.
- If a claim cannot be supported today, either reduce it, mark it non-public, or remove it from the registry.

## Future Extensions

If the repo later adds fields like `status` or `sensitivity`, update this standard before relying on them in automation.
