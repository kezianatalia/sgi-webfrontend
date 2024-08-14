import React from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const QRScannerComponent = ({ onScan }) => {
  const navigate = useNavigate();

  const handleScan = data => {
    if (data) {
      onScan(data);
      // history.push(-1);
    }
  };

  const handleError = err => {
    console.error(err);
  };

  return (
    <div>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QRScannerComponent;
