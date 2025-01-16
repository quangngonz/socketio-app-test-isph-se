import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

function App() {
  const [stocks, setStocks] = React.useState({});

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    // Event listeners
    socket.on('connect', () => {
      console.log('Connected to the WebSocket server.');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server.');
    });

    // Listen for the 'stockUpdate' event
    socket.on('stockUpdate', (data) => {
      console.log('Stock Update:', data);
      setStocks(data);

      // Example: Parsing and logging stock details
      const stocks = data;
      console.table(
        Object.entries(stocks).map(([key, stock]) => ({
          Stock: key,
          'Full Name': stock.full_name,
          'Current Price': stock.current_price,
          'Market Cap': stock.market_cap,
          'Volume Available': stock.volume_available,
        }))
      );
    });

    // Clean up
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO Stock Updates</h1>
      <p>Check the console for stock updates.</p>
      {Object.entries(stocks).map(([key, stock]) => (
        <div key={key}>
          <h2>{key}</h2>
          <p>Full Name: {stock.full_name}</p>
          <p>Current Price: {stock.current_price}</p>
          <p>Market Cap: {stock.market_cap}</p>
          <p>Volume Available: {stock.volume_available}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
