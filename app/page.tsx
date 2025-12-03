"use client";

import { useState, useEffect } from "react";

type NumberBase = "binary" | "decimal" | "hexadecimal";

export default function Home() {
  const [binaryValue, setBinaryValue] = useState("");
  const [decimalValue, setDecimalValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [lastEdited, setLastEdited] = useState<NumberBase | null>(null);

  const isValidBinary = (value: string): boolean => {
    return /^[01]*$/.test(value);
  };

  const isValidDecimal = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const isValidHex = (value: string): boolean => {
    return /^[0-9A-Fa-f]*$/.test(value);
  };

  const convertFromBinary = (binary: string) => {
    if (!binary || !isValidBinary(binary)) {
      setDecimalValue("");
      setHexValue("");
      return;
    }
    const decimal = parseInt(binary, 2);
    setDecimalValue(decimal.toString());
    setHexValue(decimal.toString(16).toUpperCase());
  };

  const convertFromDecimal = (decimal: string) => {
    if (!decimal || !isValidDecimal(decimal)) {
      setBinaryValue("");
      setHexValue("");
      return;
    }
    const num = parseInt(decimal, 10);
    setBinaryValue(num.toString(2));
    setHexValue(num.toString(16).toUpperCase());
  };

  const convertFromHex = (hex: string) => {
    if (!hex || !isValidHex(hex)) {
      setBinaryValue("");
      setDecimalValue("");
      return;
    }
    const decimal = parseInt(hex, 16);
    setBinaryValue(decimal.toString(2));
    setDecimalValue(decimal.toString());
  };

  const handleBinaryChange = (value: string) => {
    if (isValidBinary(value)) {
      setBinaryValue(value);
      setLastEdited("binary");
    }
  };

  const handleDecimalChange = (value: string) => {
    if (isValidDecimal(value)) {
      setDecimalValue(value);
      setLastEdited("decimal");
    }
  };

  const handleHexChange = (value: string) => {
    const upperValue = value.toUpperCase();
    if (isValidHex(upperValue)) {
      setHexValue(upperValue);
      setLastEdited("hexadecimal");
    }
  };

  useEffect(() => {
    if (lastEdited === "binary") {
      convertFromBinary(binaryValue);
    } else if (lastEdited === "decimal") {
      convertFromDecimal(decimalValue);
    } else if (lastEdited === "hexadecimal") {
      convertFromHex(hexValue);
    }
  }, [binaryValue, decimalValue, hexValue, lastEdited]);

  const clearAll = () => {
    setBinaryValue("");
    setDecimalValue("");
    setHexValue("");
    setLastEdited(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Conversor de Números
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Binario • Decimal • Hexadecimal
          </p>

          <div className="space-y-6">
            {/* Binary Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Binario (Base 2)
              </label>
              <input
                type="text"
                value={binaryValue}
                onChange={(e) => handleBinaryChange(e.target.value)}
                placeholder="Ej: 1010"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Solo dígitos 0 y 1
              </p>
            </div>

            {/* Decimal Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Decimal (Base 10)
              </label>
              <input
                type="text"
                value={decimalValue}
                onChange={(e) => handleDecimalChange(e.target.value)}
                placeholder="Ej: 10"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Números del 0 al 9
              </p>
            </div>

            {/* Hexadecimal Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Hexadecimal (Base 16)
              </label>
              <input
                type="text"
                value={hexValue}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="Ej: A"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dígitos 0-9 y letras A-F
              </p>
            </div>

            {/* Clear Button */}
            <button
              onClick={clearAll}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Limpiar Todo
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              ¿Cómo usar?
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Escribe un número en cualquier campo</li>
              <li>• La conversión se realiza automáticamente</li>
              <li>• Funciona en todos los sentidos simultáneamente</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Herramienta de conversión numérica universal
        </p>
      </div>
    </div>
  );
}
