import { pub, nextJS } from '@/lib/env';

test('Environment variables should exist', async () => {
  // NextJS configs
  expect(nextJS.GENERATE_SOURCEMAP).toBeDefined();
  expect(nextJS.NEXT_NODE_ENV).toBeDefined();

  // public envs
  expect(pub.SITE_URL_PROD).toBeDefined();
  expect(pub.SITE_URL_DEV).toBeDefined();

  // not yet implemented
});
