"use client";

import { useState, useEffect } from "react";

type NumberBase = "binary" | "decimal" | "hexadecimal";

interface ConversionEntry {
  id: number;
  binary: string;
  decimal: string;
  hex: string;
  timestamp: Date;
}

export default function Home() {
  const [binaryValue, setBinaryValue] = useState("");
  const [decimalValue, setDecimalValue] = useState("");
  const [hexValue, setHexValue] = useState("");
  const [lastEdited, setLastEdited] = useState<NumberBase | null>(null);
  const [history, setHistory] = useState<ConversionEntry[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string>("");

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem("conversor_session_id");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("conversor_session_id", id);
    }
    setSessionId(id);
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    if (!sessionId) return;

    try {
      const savedHistory = localStorage.getItem(`conversor_history_${sessionId}`);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((entry: ConversionEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
    setIsLoaded(true);
  }, [sessionId]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded || !sessionId) return;

    try {
      localStorage.setItem(`conversor_history_${sessionId}`, JSON.stringify(history));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }, [history, sessionId, isLoaded]);

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

  const saveValues = () => {
    if (!binaryValue && !decimalValue && !hexValue) {
      return;
    }

    const newEntry: ConversionEntry = {
      id: Date.now(),
      binary: binaryValue || "0",
      decimal: decimalValue || "0",
      hex: hexValue || "0",
      timestamp: new Date(),
    };

    setHistory([newEntry, ...history]);
  };

  const deleteEntry = (id: number) => {
    setHistory(history.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(`${type}-${value}`);
      setTimeout(() => setCopiedValue(""), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const exportToExcel = () => {
    if (history.length === 0) return;

    // Create CSV content
    const headers = "Fecha y Hora,Binario,Decimal,Hexadecimal\n";
    const rows = history.map(entry => {
      const date = entry.timestamp.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return `"${date}","${entry.binary}","${entry.decimal}","${entry.hex}"`;
    }).join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `historial_conversiones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Converter Section */}
          <div className="bg-[#252526] rounded-lg shadow-2xl p-6 md:p-8 border border-[#3e3e42]">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#4ec9b0]">
              Conversor de Números
            </h1>
            <p className="text-center text-[#858585] mb-8">
              Binario • Decimal • Hexadecimal
            </p>

            <div className="space-y-6">
              {/* Binary Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#9cdcfe]">
                  Binario (Base 2)
                </label>
                <input
                  type="text"
                  value={binaryValue}
                  onChange={(e) => handleBinaryChange(e.target.value)}
                  placeholder="Ej: 1010"
                  className="w-full px-4 py-3 text-lg border-2 border-[#3e3e42] rounded bg-[#1e1e1e] text-[#d4d4d4] placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#007acc] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-[#858585]">
                  Solo dígitos 0 y 1
                </p>
              </div>

              {/* Decimal Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#ce9178]">
                  Decimal (Base 10)
                </label>
                <input
                  type="text"
                  value={decimalValue}
                  onChange={(e) => handleDecimalChange(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-full px-4 py-3 text-lg border-2 border-[#3e3e42] rounded bg-[#1e1e1e] text-[#d4d4d4] placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#4ec9b0] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-[#858585]">
                  Números del 0 al 9
                </p>
              </div>

              {/* Hexadecimal Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#c586c0]">
                  Hexadecimal (Base 16)
                </label>
                <input
                  type="text"
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="Ej: A"
                  className="w-full px-4 py-3 text-lg border-2 border-[#3e3e42] rounded bg-[#1e1e1e] text-[#d4d4d4] placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#c586c0] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-[#858585]">
                  Dígitos 0-9 y letras A-F
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveValues}
                  className="flex-1 px-6 py-3 bg-[#007acc] hover:bg-[#005a9e] text-white font-semibold rounded transition-all transform hover:scale-105 active:scale-95"
                >
                  Guardar Valores
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 px-6 py-3 bg-[#f48771] hover:bg-[#e06856] text-white font-semibold rounded transition-all transform hover:scale-105 active:scale-95"
                >
                  Limpiar Todo
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg">
              <h2 className="font-semibold text-[#4ec9b0] mb-2">
                ¿Cómo usar?
              </h2>
              <ul className="text-sm text-[#858585] space-y-1">
                <li>• Escribe un número en cualquier campo</li>
                <li>• La conversión se realiza automáticamente</li>
                <li>• Presiona &quot;Guardar Valores&quot; para agregar al historial</li>
              </ul>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-[#252526] rounded-lg shadow-2xl p-6 md:p-8 border border-[#3e3e42]">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-[#4ec9b0]">
                  Historial de Conversiones
                </h2>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="px-4 py-2 bg-[#f48771] hover:bg-[#e06856] text-white text-sm font-semibold rounded transition-all"
                  >
                    Limpiar Historial
                  </button>
                )}
              </div>
              {sessionId && (
                <div className="flex items-center gap-2 text-xs text-[#858585]">
                  <div className="w-2 h-2 bg-[#4ec9b0] rounded-full animate-pulse"></div>
                  <span>Sesión activa - Tus datos se guardan automáticamente</span>
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-[#858585]">
                <p className="text-lg mb-2">No hay conversiones guardadas</p>
                <p className="text-sm">Realiza una conversión y presiona &quot;Guardar Valores&quot;</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-4 hover:border-[#007acc] transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs text-[#858585]">
                        {entry.timestamp.toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-[#f48771] hover:text-[#e06856] text-sm font-semibold transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-[#9cdcfe] font-semibold block mb-1">BIN</span>
                        <button
                          onClick={() => copyToClipboard(entry.binary, `${entry.id}-bin`)}
                          className="text-[#d4d4d4] font-mono break-all hover:bg-[#3e3e42] px-2 py-1 rounded transition-all text-left w-full relative group"
                          title="Click para copiar"
                        >
                          {entry.binary}
                          {copiedValue === `${entry.id}-bin-${entry.binary}` && (
                            <span className="absolute -top-8 left-0 bg-[#4ec9b0] text-[#1e1e1e] text-xs px-2 py-1 rounded">
                              ¡Copiado!
                            </span>
                          )}
                        </button>
                      </div>
                      <div>
                        <span className="text-[#ce9178] font-semibold block mb-1">DEC</span>
                        <button
                          onClick={() => copyToClipboard(entry.decimal, `${entry.id}-dec`)}
                          className="text-[#d4d4d4] font-mono break-all hover:bg-[#3e3e42] px-2 py-1 rounded transition-all text-left w-full relative group"
                          title="Click para copiar"
                        >
                          {entry.decimal}
                          {copiedValue === `${entry.id}-dec-${entry.decimal}` && (
                            <span className="absolute -top-8 left-0 bg-[#4ec9b0] text-[#1e1e1e] text-xs px-2 py-1 rounded">
                              ¡Copiado!
                            </span>
                          )}
                        </button>
                      </div>
                      <div>
                        <span className="text-[#c586c0] font-semibold block mb-1">HEX</span>
                        <button
                          onClick={() => copyToClipboard(entry.hex, `${entry.id}-hex`)}
                          className="text-[#d4d4d4] font-mono break-all hover:bg-[#3e3e42] px-2 py-1 rounded transition-all text-left w-full relative group"
                          title="Click para copiar"
                        >
                          {entry.hex}
                          {copiedValue === `${entry.id}-hex-${entry.hex}` && (
                            <span className="absolute -top-8 left-0 bg-[#4ec9b0] text-[#1e1e1e] text-xs px-2 py-1 rounded">
                              ¡Copiado!
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Export Button */}
            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={exportToExcel}
                  className="w-full px-6 py-3 bg-[#4ec9b0] hover:bg-[#3da88f] text-[#1e1e1e] font-semibold rounded transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar a Excel (.csv)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-[#858585]">
          <p className="mb-2">Herramienta de conversión numérica universal</p>
          <p className="text-xs">
            💾 Tu historial se guarda localmente y persiste entre sesiones
          </p>
        </div>
      </div>
    </div>
  );
}
