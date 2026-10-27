import { test as base } from '@playwright/test';
import { BookingApi, sampleBooking } from './BookingApi';

type ApiFixtures = {
  bookingApi: BookingApi;
  token: string;
  /** A booking created before the test and deleted after it. */
  bookingId: number;
};

export const test = base.extend<ApiFixtures>({
  bookingApi: async ({ request }, use) => use(new BookingApi(request)),

  token: async ({ bookingApi }, use) => use(await bookingApi.getToken()),

  bookingId: async ({ bookingApi, token }, use) => {
    const res = await bookingApi.createBooking(sampleBooking());
    const { bookingid } = await res.json();
    await use(bookingid);
    await bookingApi.deleteBooking(bookingid, token);
  },
});

export { expect } from '@playwright/test';
