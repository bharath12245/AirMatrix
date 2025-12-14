import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { fetchMyBookings } from '@/lib/paymentService';
import AeroSenseChat from '@/components/AeroSenseChat';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plane, Calendar, MapPin, Clock, ChevronRight, Ticket } from 'lucide-react';

const DashboardPage = () => {
  const { currentBooking, recentSearches } = useBookingStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      const myBookings = await fetchMyBookings();
      setBookings(myBookings);
      setLoading(false);
    };
    loadBookings();
  }, []);

  // Use the latest confirmed booking or the one from store as fallback/primary
  const latestBooking = bookings.length > 0 ? bookings[0] : null;
  // For display, prefer the realtime data, but fall back to store if we just made a booking and it's not in DB yet (though it should be)

  const displayBooking = latestBooking || (currentBooking ? {
    // Map store booking to display format if needed, or if schemas align
    flight: currentBooking.flight,
    id: currentBooking.id,
    ...currentBooking
  } : null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Trips</h1>
            <p className="text-muted-foreground">Manage your bookings and travel history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Bookings */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Active Bookings
                </h2>

                {loading ? (
                  <Card className="p-8 text-center">
                    <p>Loading your trips...</p>
                  </Card>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Plane className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {booking.origin} → {booking.destination}
                              </p>
                              <p className="text-muted-foreground">
                                {booking.flight_number} • {new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded">{booking.status}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(booking.departure_time).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Booking Ref</p>
                              <p className="font-bold text-primary">{booking.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Plane className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">No Active Bookings</h3>
                    <p className="text-muted-foreground mb-4">
                      Ready for your next adventure? Start searching for flights.
                    </p>
                    <Link to="/">
                      <Button variant="hero">Search Flights</Button>
                    </Link>
                  </Card>
                )}
              </div>

              {/* Recent Searches */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Searches
                </h2>

                {recentSearches.length > 0 ? (
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <Card
                        key={index}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {search.from} → {search.to}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {search.date} • {search.passengers} passenger{search.passengers > 1 ? 's' : ''} • {search.classType}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No recent searches yet</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plane className="h-4 w-4 mr-2" />
                      Book a Flight
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Booking
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Check-in Online
                  </Button>
                </div>
              </Card>

              {/* Travel Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Travel Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Trips</span>
                    <span className="font-bold text-2xl">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Miles Traveled</span>
                    <span className="font-bold text-2xl">{bookings.length * 1240}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Countries Visited</span>
                    <span className="font-bold text-2xl">{bookings.length > 0 ? 1 : 0}</span>
                  </div>
                </div>
              </Card>

              {/* Promo */}
              <Card className="p-6 gradient-hero text-primary-foreground">
                <h3 className="font-semibold mb-2">AirMatrix Rewards</h3>
                <p className="text-sm opacity-90 mb-4">
                  Join our rewards program and earn points on every flight!
                </p>
                <Button variant="glass" size="sm">
                  Learn More
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AeroSenseChat />
    </div>
  );
};

export default DashboardPage;
