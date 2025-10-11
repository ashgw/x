# REST models Naming convention

```bash
<Resource><Action><Ro> => RO types
<Resource><Action><Query/Path/Body/Headers><Dto> => DTO types

<Resource><Action><Schema><Ro> => RO schema
<Resource><Action><Query/Path/Body/Headers><Schema><Dto> => DTO schema


<Resource><Action><SchemaResponses> => Response schemas
<Resource><Action><Responses> => Response types
```

## Schema strictness

- No `any`. No `z.any()`. Use precise primitives, enums, and unions.
- Validate aggressively: `.min()`, `.max()`, `.regex()`, `.email()`, `.length()`. Always think of abuse by bad actors.
- Numbers from query arrive as strings. Validate as `string` then `.transform(Number)` and `pipe` to bounded `z.number().int()`.
- Use `z.discriminatedUnion('kind', [...])` for polymorphic bodies.
- Add `.describe()` to every public field and response for docs/openAPI.
- Headers for protected routes must extend `authedMiddlewareHeaderSchemaDto`.
