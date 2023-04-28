-- CreateTable
CREATE TABLE "UserCoupon" (
    "id" UUID NOT NULL,
    "issued_date" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL,
    "used_date" TIMESTAMP(3) NOT NULL,
    "couponId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
