import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Download, Plane, Calendar, MapPin, User, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { currentBooking, resetBooking } = useBookingStore();

  useEffect(() => {
    if (!currentBooking) {
      navigate('/');
      return;
    }

    // Celebrate!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0066b3', '#00a0e9', '#f5a623', '#00c853'],
    });
  }, [currentBooking, navigate]);

  if (!currentBooking) return null;

  const { flight, passengers, seats, totalPrice, id } = currentBooking;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8 animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Your flight has been booked successfully. A confirmation email has been sent.
              </p>
            </div>

            {/* Booking Reference */}
            <Card className="p-6 mb-6 text-center bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-3xl font-bold text-primary tracking-wider">{id}</p>
            </Card>

            {/* Flight Details */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Plane className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Flight Details</h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.departureTime}</p>
                      <p className="text-lg font-medium">{flight.fromCode}</p>
                      <p className="text-sm text-muted-foreground">{flight.from}</p>
                    </div>

                    <div className="flex-1 px-4 relative">
                      <div className="border-t-2 border-dashed border-muted-foreground/30 w-full" />
                      <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary transform rotate-90" />
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {flight.duration}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                      <p className="text-lg font-medium">{flight.toCode}</p>
                      <p className="text-sm text-muted-foreground">{flight.to}</p>
                    </div>
                  </div>
                </div>

                <div className="md:border-l md:pl-6 md:border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Flight:</span>
                    <span className="font-medium">{flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Aircraft:</span>
                    <span className="font-medium">{flight.aircraft}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Class:</span>
                    <span className="font-medium capitalize">{flight.classType}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passengers */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Passengers</h2>
              </div>

              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div
                    key={passenger.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {passenger.firstName} {passenger.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{passenger.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Seat {seats[index]?.row}{seats[index]?.column}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {seats[index]?.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Total Paid</p>
                  <p className="text-3xl font-bold text-primary">${totalPrice}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="default" size="lg" className="w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  View My Trips
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  resetBooking();
                  navigate('/');
                }}
                className="w-full sm:w-auto"
              >
                <Plane className="h-4 w-4 mr-2" />
                Book Another Flight
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
