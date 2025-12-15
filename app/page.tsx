"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

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

  const exportToCSV = () => {
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

  const exportToExcel = () => {
    if (history.length === 0) return;

    // Prepare data for Excel
    const data = history.map(entry => ({
      "Fecha y Hora": entry.timestamp.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      "Binario": entry.binary,
      "Decimal": entry.decimal,
      "Hexadecimal": entry.hex,
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Fecha y Hora
      { wch: 20 }, // Binario
      { wch: 15 }, // Decimal
      { wch: 15 }, // Hexadecimal
    ];

    // Download the file
    XLSX.writeFile(workbook, `historial_conversiones_${new Date().toISOString().split('T')[0]}.xlsx`);
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

            {/* Export Buttons */}
            {history.length > 0 && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={exportToExcel}
                  className="w-full px-6 py-3 bg-[#4ec9b0] hover:bg-[#3da88f] text-[#1e1e1e] font-semibold rounded transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar a Excel (.xlsx)
                </button>
                <button
                  onClick={exportToCSV}
                  className="w-full px-6 py-3 bg-[#007acc] hover:bg-[#005a9e] text-white font-semibold rounded transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar a CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <div className="text-sm text-[#858585]">
            <p className="mb-2">Herramienta de conversión numérica universal</p>
            <p className="text-xs">
              💾 Tu historial se guarda localmente y persiste entre sesiones
            </p>
          </div>

          {/* Developer Watermark */}
          <div className="border-t border-[#3e3e42] pt-4">
            <p className="text-sm text-[#858585] mb-2">
              Desarrollado con <span className="text-[#f48771]">♥️</span> desde Argentina por{" "}
              <span className="text-[#4ec9b0] font-semibold">Juan Cruz Larraya</span>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a
                href="https://www.linkedin.com/in/juan-cruz-larraya/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#007acc] hover:text-[#4ec9b0] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <span className="text-[#3e3e42]">•</span>
              <a
                href="https://github.com/juan-LARRAYA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#007acc] hover:text-[#4ec9b0] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
