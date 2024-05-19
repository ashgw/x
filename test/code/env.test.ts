import { nextJS, pub } from '@/lib/env';

test('Environment variables should exist', async () => {
  // NextJS configs
  expect(nextJS.GENERATE_SOURCEMAP).toBeDefined();

  // public envs
  expect(pub.SITE_URL_PROD).toBeDefined();
  expect(pub.SITE_URL_DEV).toBeDefined();

  // not yet implemented
});
