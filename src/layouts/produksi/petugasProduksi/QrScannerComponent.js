import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const QRScannerComponent = ({ onScan }) => {
  const navigate = useNavigate();
  const [constraint, setConstraint] = useState({});

  const handleScan = data => {
    if (data) {
      onScan(data);
      // history.push(-1);
    }
  };

  const handleError = err => {
    console.error(err);
  };

  var backupdevice = null;
  navigator.mediaDevices.enumerateDevices()
  .then((devices) => {
    devices.forEach((device) => {
      if (device.kind === 'videoinput') {
        backupdevice = device;
        if ((device.label.includes("rear") || device.label.includes("back"))) {
          setConstraint({audio:false, video:{deviceId:device.deviceId}});
        }
      } 
    });
  }).finally(() => {
    if (JSON.stringify(constraint) === '{}'){
      setConstraint({audio:false, video:{deviceId:backupdevice.deviceId}});
    }
  });

  return (
    <div>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
        constraints={constraint}
      />
    </div>
  );
};

export default QRScannerComponent;
