import env from '@/env';

test('Environment variables should actually load', async () => {
  // NextJS configs
  expect(env.nextjs.GENERATE_SOURCEMAP).toBeDefined();
  expect(env.nextjs.NEXT_URL).toBeDefined();
  expect(env.nextjs.NEXT_NODE_ENV).toBeDefined();
  expect(env.nextjs.NEXT_DEV_URL).toBeDefined();

  // rest envs
  expect(env.public.SITE_URL).toBeDefined();

  // not yet implemented
});
