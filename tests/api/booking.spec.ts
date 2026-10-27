import { test, expect } from '../../api/fixtures';
import { sampleBooking } from '../../api/BookingApi';

test.describe('Booking - read', () => {
  test('lists booking ids', async ({ bookingApi }) => {
    const res = await bookingApi.getBookingIds();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('filters bookings by name', async ({ bookingApi, bookingId }) => {
    const res = await bookingApi.getBookingIds({ firstname: 'Jim', lastname: 'Brown' });
    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingId);
  });

  test('returns 404 for a missing booking', async ({ bookingApi }) => {
    const res = await bookingApi.getBooking(999_999_999);
    expect(res.status()).toBe(404);
  });
});

test.describe('Booking - create', () => {
  test('creates a booking and can read it back', { tag: '@smoke' }, async ({ bookingApi, token }) => {
    const booking = sampleBooking();
    const res = await bookingApi.createBooking(booking);
    expect(res.status()).toBe(200);

    const { bookingid, booking: created } = await res.json();
    expect(created).toEqual(booking);

    const fetched = await bookingApi.getBooking(bookingid);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(booking);

    await bookingApi.deleteBooking(bookingid, token);
  });
});

test.describe('Booking - update', () => {
  test('full update with PUT', async ({ bookingApi, token, bookingId }) => {
    const updated = sampleBooking({ firstname: 'James', totalprice: 222 });
    const res = await bookingApi.updateBooking(bookingId, updated, token);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  test('partial update with PATCH', async ({ bookingApi, token, bookingId }) => {
    const res = await bookingApi.partialUpdateBooking(bookingId, { additionalneeds: 'Late checkout' }, token);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.additionalneeds).toBe('Late checkout');
    expect(body.firstname).toBe('Jim'); // untouched fields stay the same
  });

  test('update without a token is forbidden', async ({ bookingApi, bookingId }) => {
    const res = await bookingApi.updateBooking(bookingId, sampleBooking());
    expect(res.status()).toBe(403);
  });
});

test.describe('Booking - delete', () => {
  test('deletes a booking', async ({ bookingApi, token }) => {
    const { bookingid } = await (await bookingApi.createBooking(sampleBooking())).json();

    const res = await bookingApi.deleteBooking(bookingid, token);
    // restful-booker returns 201 for a successful delete
    expect(res.status()).toBe(201);
    expect((await bookingApi.getBooking(bookingid)).status()).toBe(404);
  });

  test('delete without a token is forbidden', async ({ bookingApi, bookingId }) => {
    const res = await bookingApi.deleteBooking(bookingId);
    expect(res.status()).toBe(403);
  });
});
