-- CreateTable
CREATE TABLE "Coupon" (
    "id" UUID NOT NULL,
    "quantity" BIGINT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "valid_period" INTEGER NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" INTEGER NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);
