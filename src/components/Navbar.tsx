
import { useState } from "react";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-md border-b sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary-foreground" />
          <h1 className="font-bold text-xl">Learnify</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="rounded-full">
            Help
          </Button>
          <Button className="rounded-full">My Account</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
