/** @boulevard/blvd-book-sdk ships JS only — minimal types for `tsc`. */
declare module "@boulevard/blvd-book-sdk" {
  export enum PlatformTarget {
    Sandbox = 0,
    Live = 1,
  }

  export class Blvd {
    constructor(apiKey: string, businessId: string, target?: PlatformTarget);
    businesses: {
      get(): Promise<{
        getLocations(): Promise<Array<{ id: string; name: string }>>;
      }>;
    };
    carts: {
      create(location: unknown): Promise<Cart>;
    };
  }

  /** Cart instance returned by the Book SDK (methods match runtime). */
  export interface Cart {
    startTime?: string;
    bookingQuestions?: Array<{
      id: string;
      valueType?: string;
      label?: string;
      name?: string;
      required?: boolean;
      options?: Array<{ id: string; name?: string; label?: string }>;
      answer?: unknown;
      submitAnswer: (value: unknown) => Promise<Cart>;
    }>;
    summary?: {
      paymentMethodRequired?: boolean;
      total?: number;
      depositAmount?: number;
      subtotal?: number;
    };
    getAvailableCategories(): Promise<
      Array<{
        availableItems: object[];
      }>
    >;
    getSelectedItems(): Promise<Array<{ id: string }>>;
    removeSelectedItem(item: { id: string }): Promise<Cart>;
    addBookableItem(item: object, opts?: object): Promise<Cart>;
    getBookableDates(opts?: object): Promise<Array<{ date: string }>>;
    getBookableTimes(args: { date: string }, opts?: object): Promise<
      Array<{ id: string; startTime: string }>
    >;
    reserveBookableItems(bookableTime: object): Promise<Cart>;
    update(opts: object): Promise<Cart>;
    addCardPaymentMethod(details: object, opts?: object): Promise<Cart>;
    checkout(): Promise<unknown>;
  }
}
