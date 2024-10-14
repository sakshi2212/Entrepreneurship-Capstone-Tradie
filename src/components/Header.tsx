import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="bg-card text-card-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Trading Copilot</h1>
        <nav>
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;