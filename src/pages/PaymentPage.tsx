import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AeroSenseChat from '@/components/AeroSenseChat';
import { useBookingStore, Booking } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBooking } from '@/lib/paymentService';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { selectedFlight, selectedSeats, searchParams, passengers, setCurrentBooking } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const totalSeatPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const totalPrice = (selectedFlight?.price || 0) * (searchParams?.passengers || 1) + totalSeatPrice;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      toast.error('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    // Call Booking Service
    const bookingDetails = {
      passengers,
      contactEmail: 'user@example.com', // Placeholder or get from form if available
      contactPhone: '1234567890'
    };

    const result = await createBooking({
      flight: selectedFlight!,
      bookingDetails: bookingDetails as any, // Cast as the store might differ slightly from service expectations
      totalPrice
    });

    if (!result.success) {
      toast.error(result.error || 'Booking failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    const booking: Booking = {
      id: result.bookingId!,
      flight: selectedFlight!,
      passengers: passengers,
      seats: selectedSeats,
      totalPrice: totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod: 'Credit Card',
    };

    setCurrentBooking(booking);
    toast.success('Booking confirmed successfully!');
    setIsProcessing(false);
    navigate('/confirmation');
  };

  if (!selectedFlight || !searchParams || passengers.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-20 pb-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment</h1>
              <p className="text-muted-foreground">Complete your booking securely</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {['Flight', 'Seats', 'Passengers', 'Payment', 'Confirmation'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= 3
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-12 h-0.5 mx-1 ${index < 3 ? 'bg-primary' : 'bg-muted'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Secure Payment</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-muted-foreground">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => navigate('/passengers')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ${totalPrice}</>
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Flight */}
              <div className="border-b border-border pb-4 mb-4">
                <p className="font-medium text-foreground mb-1">
                  {selectedFlight.from} → {selectedFlight.to}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedFlight.flightNumber} • {selectedFlight.departureTime}
                </p>
              </div>

              {/* Passengers */}
              <div className="border-b border-border pb-4 mb-4">
                <p className="font-medium text-foreground mb-2">Passengers</p>
                {passengers.map((p, i) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {p.firstName} {p.lastName}
                    </span>
                    <span>Seat {selectedSeats[i]?.row}{selectedSeats[i]?.column}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tickets ({searchParams.passengers}x ${selectedFlight.price})
                  </span>
                  <span>${selectedFlight.price * searchParams.passengers}</span>
                </div>
                {totalSeatPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seat Selection</span>
                    <span>+${totalSeatPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-border mt-3">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AeroSenseChat />
    </div>
  );
};

export default PaymentPage;
