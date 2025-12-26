import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@comp/card";
import { Input } from "@comp/input";

import { Button } from "@/_components/client/button";

const ShippingForm = ({ onNext }: { onNext: () => void }) => {
  return (
    <Card className="jusbtify-between relative col-span-1 flex flex-col not-last:rounded-3xl p-6 md:col-span-3 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">Shipping Information</CardTitle>
        <CardDescription>Enter Your Shipping Details Below</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 py-5">
        <Input placeholder="Email" />
        <div className="flex w-full flex-row gap-4">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
        </div>
        <Input placeholder="Phone Number" />
        <Input placeholder="Address" />
        <Input placeholder="Apt,Suite,etc(optional)" />
        <Input placeholder="Country" />
        <div className="flex w-full flex-row gap-4">
          {" "}
          <Input placeholder="State" />
          <Input placeholder="City" />
          <Input placeholder="Zip Code" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <Button onClick={onNext}>Continue to Payment</Button>
      </CardFooter>
    </Card>
  );
};
export default ShippingForm;
