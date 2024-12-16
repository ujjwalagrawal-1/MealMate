// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';

// const QR = (props) => {
//   const [data, setData] = useState('No result');

//   return (
//     <>
//       <QrReader
//         onResult={(result, error) => {
//           if (!!result) {
//             setData(result?.text);
//           }

//           if (!!error) {
//             console.info(error);
//           }
//         }}
//         style={{ width: '100%' }}
//       />
//       <p>{data}</p>
//     </>
//   );
// };

// export default QR
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QR = () => {
  const [data, setData] = useState('No result');

  const handleScan = (result) => {
    if (result) {
      setData(result);
    }
  };

  const handleError = (error) => {
    console.error('QR Scan Error:', error);
  };

  return (
    <>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );
};

export default QR;
