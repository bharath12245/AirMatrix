import { Flight } from '@/store/bookingStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, AlertTriangle, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const getDelayBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
            <CheckCircle className="h-3 w-3 mr-1" /> Low Delay Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
            <Circle className="h-3 w-3 mr-1" /> Medium Risk
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
            <AlertTriangle className="h-3 w-3 mr-1" /> High Risk
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:w-48">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{flight.airline}</p>
            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center justify-between lg:justify-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.fromCode}</p>
          </div>

          <div className="flex-1 max-w-[200px] relative px-4">
            <div className="border-t-2 border-dashed border-muted-foreground/30 w-full" />
            <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary transform rotate-90" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{flight.duration}</span>
              {flight.stops > 0 && (
                <span className="text-xs text-accent">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.toCode}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col items-end gap-2 lg:w-48">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {flight.aircraft}
          </div>
          {getDelayBadge(flight.delayRisk)}
          <p className="text-sm text-muted-foreground">{flight.availableSeats} seats left</p>
        </div>

        {/* Price & Book */}
        <div className="flex flex-col items-center gap-2 lg:w-40 lg:border-l lg:pl-6 lg:border-border">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">₹{flight.price.toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground capitalize">{flight.classType}</p>
          </div>
          <Button
            variant="hero"
            onClick={() => onSelect(flight)}
            className="w-full lg:w-auto"
          >
            Select Flight
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlightCard;
