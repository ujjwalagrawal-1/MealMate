import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const MessQRCode = ({hallId}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
    console.log(hallId)
  useEffect(() => {
    const fetchStoredQRCode = async () => {
      try {
        // Attempt to fetch the stored QR code
        const response = await axios.get(
          `${apiUrl}/api/qr/fetchQRCode/${hallId}`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("authToken"),
            },
          }
        );
        console.log(response)
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (err) {
        console.error("QR code not found, generating a new one...");
        await generateQRCode(); // Generate the QR code if not found
      } finally {
        setLoading(false);
      }
    };

    const generateQRCode = async () => {
      try {
        // Call the generate route to create a new QR code
        const response = await axios.get(
          `${apiUrl}/api/qr/generateQRCode/${hallId}`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("authToken"),
            },
          }
        );
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    fetchStoredQRCode();
  }, [hallId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>QR Code for Mess</h1>
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="Mess QR Code" style={{ width: "200px" }} />
      ) : (
        <p>Failed to load QR Code</p>
      )}
    </div>
  );
};

export default MessQRCode;
