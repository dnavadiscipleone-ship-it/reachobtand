export const mockDatabase = {
  vehicles: [
    {
      id: '1',
      licensePlate: 'ABC1234',
      vin: '1HGCM82633A123456',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      color: 'Silver',
      towYardId: 'yard1',
      status: 'in-yard',
      towedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      reason: 'Expired meter - Street cleaning',
      location: {
        latitude: 40.7580,
        longitude: -73.9855
      },
      fees: {
        towing: 150,
        storage: 25,
        processing: 35
      }
    },
    {
      id: '2',
      licensePlate: 'XYZ5678',
      vin: '2G1FB1E30D1282158',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2019,
      color: 'Black',
      towYardId: 'yard2',
      status: 'in-yard',
      towedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      reason: 'Parking violation - No parking zone',
      location: {
        latitude: 40.7282,
        longitude: -73.7949
      },
      fees: {
        towing: 175,
        storage: 50,
        processing: 35
      }
    },
    {
      id: '3',
      licensePlate: 'DEF9012',
      vin: '5TDJKRFH0LS123456',
      make: 'Toyota',
      model: 'Highlander',
      year: 2021,
      color: 'White',
      towYardId: 'yard1',
      status: 'ready-for-pickup',
      towedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      reason: 'Blocking fire hydrant',
      location: {
        latitude: 40.7580,
        longitude: -73.9855
      },
      fees: {
        towing: 150,
        storage: 0,
        processing: 35
      }
    }
  ],
  towYards: [
    {
      id: 'yard1',
      name: 'Central Tow Yard',
      address: '123 Industrial Ave, New York, NY 10001',
      phone: '(212) 555-0100',
      email: 'info@centraltow.com',
      location: {
        latitude: 40.7580,
        longitude: -73.9855
      },
      hours: '8:00 AM - 6:00 PM',
      acceptedPayment: ['Cash', 'Credit Card', 'Debit Card'],
      capacity: 500,
      currentVehicles: 187
    },
    {
      id: 'yard2',
      name: 'Downtown Impound Lot',
      address: '456 Queens Blvd, Queens, NY 11374',
      phone: '(718) 555-0200',
      email: 'contact@downtownimpound.com',
      location: {
        latitude: 40.7282,
        longitude: -73.7949
      },
      hours: '7:00 AM - 8:00 PM',
      acceptedPayment: ['Cash', 'Credit Card', 'Debit Card', 'Check'],
      capacity: 750,
      currentVehicles: 432
    }
  ]
};
