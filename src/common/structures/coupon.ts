import dayjs from 'dayjs';

export interface Coupon {
  id: string;
  quantity?: number | null;
  start_date: Date;
  end_date: Date;
  valid_period: number;
  discount_type: string;
  discount_value: number;
}

export namespace Coupon {
  export type CouponDiscountType = 'absolute' | 'percentage';

  export const calculateExpirationDate = (days: number, end_date: Date) => {
    const expiration_date = dayjs().add(days, 'days');
    if (dayjs(end_date).isBefore(expiration_date)) return end_date;
    return expiration_date.toDate();
  };

  export const calculateDiscountValue = (
    discount_value: number,
    price: number,
  ) => {
    return {
      absolute: fixedDiscountValue(discount_value, price),
      percentage: percentDiscountValue(discount_value, price),
    };
  };

  function percentDiscountValue(discount_value: number, price: number) {
    return price * (discount_value / 100);
  }

  function fixedDiscountValue(discount_value: number, price: number) {
    if (discount_value > price) return 0;
    return price - discount_value;
  }
}
