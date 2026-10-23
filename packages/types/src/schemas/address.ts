import { z } from "zod";

// AddressType enum values (from Prisma schema)
export const AddressTypeEnum = z.enum(["SHIPPING", "BILLING"]);

export type AddressType = z.infer<typeof AddressTypeEnum>;

export const AddressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().optional(),

  streetLine1: z.string().min(5, "Street is required"),
  streetLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Zip code is required"),
  country: z.string().min(2, "Country is required"),

  type: AddressTypeEnum.default(AddressTypeEnum.enum.SHIPPING),
  isDefault: z.boolean().default(false),
});

// For updates, fields are optional
export const UpdateAddressSchema = AddressSchema.partial();

export type CreateAddressInput = z.infer<typeof AddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;