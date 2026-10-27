import { APIRequestContext } from '@playwright/test';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export const sampleBooking = (overrides: Partial<Booking> = {}): Booking => ({
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: { checkin: '2026-01-01', checkout: '2026-01-05' },
  additionalneeds: 'Breakfast',
  ...overrides,
});

/**
 * The API equivalent of a page object: wraps each restful-booker endpoint
 * so specs read as "what" is being tested rather than "how" to call it.
 */
export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  ping() {
    return this.request.get('/ping');
  }

  auth(username = 'admin', password = 'password123') {
    return this.request.post('/auth', { data: { username, password } });
  }

  async getToken(): Promise<string> {
    const res = await this.auth();
    return (await res.json()).token;
  }

  getBookingIds(filters?: Partial<Pick<Booking, 'firstname' | 'lastname'>>) {
    return this.request.get('/booking', { params: filters });
  }

  getBooking(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  createBooking(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  updateBooking(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeader(token) });
  }

  partialUpdateBooking(id: number, fields: Partial<Booking>, token?: string) {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.authHeader(token) });
  }

  deleteBooking(id: number, token?: string) {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeader(token) });
  }

  private authHeader(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }
}
