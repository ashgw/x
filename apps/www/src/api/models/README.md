# API Models Rules

- Per feature: `models/<feature>/{dtos.ts,responses.ts,index.ts}`
- Shared building blocks: `models/shared/{dtos.ts,responses.ts,index.ts}`
- Barrel: `models/index.ts` re-exports each feature

## Naming
- Schema values
  - Headers: `<Feature>HeadersSchemaDto`
  - Query: `<Feature>QuerySchemaDto`
  - Body: `<Feature>BodySchemaDto`
  - Responses map: `<Feature>SchemaResponses`
- Types
  - `<Feature>HeadersDto`, `<Feature>QueryDto`, `<Feature>BodyDto`
  - `<Feature>Responses` for the inferred union
- Files
  - Requests in `dtos.ts`
  - Response maps in `responses.ts`
  - Re-exports in `index.ts`

## Schema strictness
- No `any`. No `z.any()`. Use precise primitives, enums, and unions.
- Validate aggressively: `.min()`, `.max()`, `.regex()`, `.email()`, `.length()`. Always think of abuse by bad actors.
- Numbers from query arrive as strings. Validate as `string` then `.transform(Number)` and `pipe` to bounded `z.number().int()`.
- Use `z.discriminatedUnion('kind', [...])` for polymorphic bodies.
- Add `.describe()` to every public field and response for docs/openAPI.
- Headers for protected routes must extend `authedMiddlewareHeaderSchemaDto`.

## Responses
- Build with `createSchemaResponses({ ... })`.
- Success: `okSchemaResponse` for 200, `noContentSchemaResponse` for 204.
- Failures to compose when relevant: `rateLimiterMiddlewareSchemaResponse`, `authedMiddlewareSchemaResponse`, `internalErrorSchemaResponse`.
- Non JSON bodies use `c.otherResponse({ contentType, body })`.

## Exports
- Feature `index.ts` re-exports schemas and types only.
- Add the feature to `models/index.ts` via `export * from "./<feature>";`.

## Contract and handlers
- Contract routes use these schemas and set `strictStatusCodes: true`.
- Handlers return `Promise<<Feature>Responses>` exactly.

