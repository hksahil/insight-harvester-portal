
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  onButtonClick: () => void;
  showPromoCode?: boolean;
  onApplyPromo?: (code: string) => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  features,
  buttonText,
  onButtonClick,
  showPromoCode,
  onApplyPromo,
  isLoading,
}) => {
  const [promoCode, setPromoCode] = React.useState('');

  return (
    <Card className="w-full border border-border/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="pt-4">
          <span className="text-4xl font-bold">₹{price}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-5 w-5 flex-shrink-0 text-primary" />
              ) : (
                <span className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm text-muted-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>

        {showPromoCode && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={() => onApplyPromo?.(promoCode)}
              disabled={!promoCode || isLoading}
            >
              Apply
            </Button>
          </div>
        )}

        <Button
          onClick={onButtonClick}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
