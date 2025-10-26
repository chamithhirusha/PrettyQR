"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import DarkVeil from "./components/DarkVeil";
import { DownloadIcon, HeartIcon, QRIcon, ReloadIcon } from "./components/Icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const defaultFgColor = "#ffffff";
  const defaultBgColor = "#000000";
  const defaultSize = 256;

  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [fgColor, setFgColor] = useState(defaultFgColor);
  const [bgColor, setBgColor] = useState(defaultBgColor);
  const [size, setSize] = useState(defaultSize);
  const [withBackground, setWithBackground] = useState(false);
  const maxCharLength = 800;

  const generateQRCode = async () => {
    if (!input) return;
    try {
      const url = await QRCode.toDataURL(input, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: withBackground ? bgColor : "#00000000" },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input) generateQRCode();
      else setQrCodeUrl("");
    }, 500);
    return () => clearTimeout(timeout);
  }, [input, fgColor, bgColor, size, withBackground]);

  const downloadQRCode = async (format: "png" | "svg") => {
    if (!input) return;

    const lightColor = withBackground
      ? bgColor
      : format === "png"
      ? "#00000000"
      : "transparent";

    if (format === "svg") {
      const svg = await QRCode.toString(input, {
        type: "svg",
        color: { dark: fgColor, light: lightColor },
        width: size,
        margin: 2,
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qr-code.svg";
      link.click();
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (withBackground) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      await QRCode.toCanvas(canvas, input, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: withBackground ? bgColor : "#00000000" },
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qr-code.png";
        link.click();
      });
    }
  };

  const resetAll = () => {
    setInput("");
    setQrCodeUrl("");
    setFgColor(defaultFgColor);
    setBgColor(defaultBgColor);
    setSize(defaultSize);
    setWithBackground(true);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity: 0.5,
        }}
      >
        <DarkVeil />
      </div>

      {/* Floating Heart Icon */}
      <div
        className="fixed bottom-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all cursor-pointer z-20"
        onClick={() => router.push("https://github.com/chamithhirusha")}
      >
        <HeartIcon className="w-4 h-4 text-white/70" />
      </div>

      {/* Foreground content */}
      <main className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-10 p-8 relative z-10 text-white">
        {/* Input & Options */}
        <div className="flex-1 w-full flex justify-center items-start">
          <div
            className="w-full max-w-md p-6 rounded-xl border border-white/20
            bg-white/5 backdrop-blur-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-5xl mb-10 text-center text-white/90 font-special">
              PrettyQR
            </h2>

            <textarea
              rows={4}
              maxLength={maxCharLength}
              className="w-full font-geist-mono p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
            focus:ring-2 focus:ring-white/50 focus:border-white/40 outline-none placeholder-white/50 text-white transition max-h-[350px] min-h-[100px]"
              placeholder="Enter text or URL to encode..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <p className="text-white/50 text-xs mt-1 text-right">
              {input.length}/{maxCharLength}
            </p>

            {/* QR Options */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Foreground Color */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md border border-white/30 cursor-pointer shadow-md"
                    style={{ backgroundColor: fgColor }}
                    onClick={() =>
                      document.getElementById("fgColorInput")?.click()
                    }
                  />
                  <input
                    type="color"
                    id="fgColorInput"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="hidden"
                  />
                </div>
                {/* Background Color */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md border border-white/30 cursor-pointer shadow-md"
                    style={{ backgroundColor: bgColor }}
                    onClick={() =>
                      document.getElementById("bgColorInput")?.click()
                    }
                  />
                  <input
                    type="color"
                    id="bgColorInput"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="hidden"
                  />
                </div>
              </div>
              {/* Size Slider */}
              <div>
                <label className="text-white/70 text-sm">Size: {size}px</label>
                <input
                  type="range"
                  min={128}
                  max={512}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full cursor-pointer rounded-full bg-white/10 backdrop-blur-sm border border-white/20 h-3 accent-white transition-all"
                />
              </div>

              {/* Checkbox for background */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="withBackground"
                  checked={withBackground}
                  onChange={() => setWithBackground(!withBackground)}
                  className="w-5 h-5 rounded-md accent-white cursor-pointer
               bg-white/10 backdrop-blur-sm border border-white/30 shadow-md
               transition-all hover:bg-white/20"
                />
                <label
                  htmlFor="withBackground"
                  className="text-white/80 text-sm"
                >
                  With background color
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={generateQRCode}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 transition font-medium text-white cursor-pointer shadow-md"
              >
                <QRIcon /> Generate QR Code
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQRCode("png")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 transition font-medium text-white cursor-pointer shadow-md"
                >
                  <DownloadIcon /> PNG
                </button>

                <button
                  onClick={() => downloadQRCode("svg")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 transition font-medium text-white cursor-pointer shadow-md"
                >
                  <DownloadIcon /> SVG
                </button>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-red-600/20 backdrop-blur-sm border border-red-500/30
              hover:bg-red-600/40 transition font-medium text-white cursor-pointer shadow-md"
              >
                <ReloadIcon /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="flex-1 flex justify-center items-center">
          <div
            className="w-80 h-80 md:w-96 md:h-96 rounded-2xl border border-white/20
            flex items-center justify-center bg-white/5 backdrop-blur-3xl shadow-lg hover:shadow-2xl transition duration-300"
          >
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-72 h-72 md:w-88 md:h-88 rounded-3xl p-2"
              />
            ) : (
              <span className="text-white/50 text-sm">QR Code Preview</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
