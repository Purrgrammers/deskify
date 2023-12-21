import { FC, createContext, useCallback, useState } from "react";

type Booking = {
  id: string;
  date: string;
  userId: number;
  deskId: number;
  roomId: number;
};

type BookingContextType = {
  bookings: Booking[];
  removeBookingFromState: (bookingId: string) => void;
};

type BookingProviderProps = {
  children: React.ReactNode;
  initialBookings: Booking[];
  removeBookingFromState: (bookingId: string) => void;
};

export const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider: FC<BookingProviderProps> = ({
  children,
  initialBookings,
  removeBookingFromState,
}) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);

  const contextValue: BookingContextType = {
    bookings,
    removeBookingFromState,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};
