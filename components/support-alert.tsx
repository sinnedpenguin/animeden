import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Icons } from "./icons";

export function SupportAlert() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible ? (
      <div className="mt-4 flex items-center justify-between">
        <Alert>
          <div className="flex items-center justify-between">
            <div>
              <AlertDescription>
                Help us enhance your experience!
              </AlertDescription>
            </div>
            <div className="flex items-center">
              <a href="https://ko-fi.com/sinnedpenguin" target="_blank" rel="noopener noreferrer">
                <Button className="mr-2"><Icons.kofi className="mr-2 h-5 w-4" />Support</Button>
              </a>
              <button onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Alert>
      </div>
    ) : null
  );
}