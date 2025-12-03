import { cn } from "@/lib/utils"
import { Check } from "lucide-react";
import { Button } from "@/_components/client/button";

type Step = 'address' | 'payment' | 'review';
interface StepperProps {
    currentStep: Step;
    onStepChange: (step: Step) => void
}

export default function Stepper({ currentStep, onStepChange }: StepperProps) {
    const steps: { id: Step; label: string }[] = [
        { id: "address", label: "Details" },
        { id: "payment", label: "Payment" },
        { id: "review", label: "Review" },
    ]

    return (
        <div className="w-full flex items-center justify-center mb-8">
            <div className="flex items-center gap-8">
                {steps.map((step, idx) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = steps.findIndex((s) => s.id === currentStep) > idx;
                    return (
                        <div key={step.id} className="flex items-center">
                            <Button onClick={() => onStepChange(step.id)} variant={"outline"} className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium",
                                isActive ? "bg-primary  border-primary" : isCompleted ? 'bg-green-500, text-white border-white bg-white' : 'border-muted-foreground text-muted-foreground'
                            )}>
                                {isCompleted ? <Check className="" /> : idx + 1}
                            </Button>
                            <span
                                className={cn('ml-2 text-sm font-medium', isActive ? 'text-primary' : currentStep > step.label ? 'text-white' : "text-muted-foreground")}
                            >
                                {step.label}
                            </span>
                            {idx < steps.length - 1 && (
                                <div
                                    className={cn('w-16 h[2px] mx-4', isCompleted ? 'bg-green-500 ' : "bg-muted")}
                                ></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>

    )
}