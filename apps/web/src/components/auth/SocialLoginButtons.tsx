"use client";

import { Button } from "@workspace/ui/components/button";
import { Github, Mail } from "lucide-react";

interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onGithubClick?: () => void;
  disabled?: boolean;
}

export function SocialLoginButtons({
  onGoogleClick,
  onGithubClick,
  disabled = false,
}: SocialLoginButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={onGoogleClick}
        disabled={disabled}
        type="button"
      >
        <Mail className="size-4" aria-hidden="true" />
        <span>Email</span>
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={onGithubClick}
        disabled={disabled}
        type="button"
      >
        <Github className="size-4" aria-hidden="true" />
        <span>GitHub</span>
      </Button>
    </div>
  );
}