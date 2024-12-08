import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { toast } from "@/components/ui/use-toast";
import { Stock } from "@/types/api";

export const PortfolioManager: React.FC = () => {
  const [symbol, setSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { stocks, addStock, removeStock } = usePortfolio();

  const handleAddStock = () => {
    if (!symbol || !buyPrice || !quantity) {
      toast({
        title: "Error",
        description: "Please enter symbol, buy price, and quantity",
        variant: "destructive",
      });
      return;
    }

    addStock({
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      price: parseFloat(buyPrice),
      quantity: parseInt(quantity),
    });
    setSymbol("");
    setBuyPrice("");
    setQuantity("");
    
    toast({
      title: "Stock Added",
      description: `${symbol.toUpperCase()} has been added to your portfolio`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          placeholder="Stock Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="flex-1 bg-background/50"
        />
        <Input
          placeholder="Buy Price"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="w-32 bg-background/50"
        />
        <Input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-32 bg-background/50"
        />
        <Button onClick={handleAddStock} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {stocks.map((stock, index) => (
            <motion.div
              key={`${stock.symbol}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Card className="p-4 flex justify-between items-center glass-effect card-hover">
                <div>
                  <h3 className="font-semibold text-primary">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">
                    Buy Price: ${stock.price.toFixed(2)} | Quantity: {stock.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStock(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};