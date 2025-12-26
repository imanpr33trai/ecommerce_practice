import { Check } from "lucide-react";

import { Button } from "@/_components/client/button";
import { cn } from "@/lib/utils";

type Step = "address" | "payment" | "review";
interface StepperProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

export default function Stepper({ currentStep, onStepChange }: StepperProps) {
  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "Details" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="mb-8 flex w-full items-center justify-center">
      <div className="flex items-center gap-8">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex((s) => s.id === currentStep) > idx;
          return (
            <div
              key={step.id}
              className="flex items-center"
            >
              <Button
                onClick={() => onStepChange(step.id)}
                variant={"outline"}
                className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium", isActive ? "border-primary bg-primary" : isCompleted ? "border-white bg-green-500, bg-white text-white" : "border-muted-foreground text-muted-foreground")}
              >
                {isCompleted ? <Check className="" /> : idx + 1}
              </Button>
              <span className={cn("ml-2 font-medium text-sm", isActive ? "text-primary" : currentStep > step.label ? "text-white" : "text-muted-foreground")}>{step.label}</span>
              {idx < steps.length - 1 && <div className={cn("h[2px] mx-4 w-16", isCompleted ? "bg-green-500" : "bg-muted")} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
