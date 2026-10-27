import { test, expect } from '../../api/fixtures';

test.describe('Health & Auth', () => {
  test('ping returns 201', { tag: '@smoke' }, async ({ bookingApi }) => {
    // restful-booker returns 201 (not 200) for its health check
    const res = await bookingApi.ping();
    expect(res.status()).toBe(201);
  });

  test('valid credentials return a token', { tag: '@smoke' }, async ({ bookingApi }) => {
    const res = await bookingApi.auth();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid credentials are rejected', async ({ bookingApi }) => {
    const res = await bookingApi.auth('admin', 'wrong');
    // The API returns 200 with a reason instead of 401
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });
});
