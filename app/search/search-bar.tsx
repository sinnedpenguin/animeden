import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader 
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleSearch = () => {
    setQuery("");
    router.push(`/search/${query}`);
    setOpen(false);
  };

  const handleKeyUp = (e: { key: string }) => {
    if (e.key === "Enter" && query.trim() !== "") {
      handleSearch();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <div className="flex w-full max-w-sm items-center space-x-2">
      <DialogTrigger>
      <Input
        placeholder="Search..."
      />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Type a title or a keyword...
        </DialogHeader>
        <div className="flex">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={handleKeyUp}
            className="mr-2"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSearch}
            disabled={query.trim() === ""}
          >
            <Icons.search className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </div>
    </Dialog>
  );
}