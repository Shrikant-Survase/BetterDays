"use client";

import React, { useState, useRef } from "react";
import { Download, Upload, Trash2, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useHabits } from "@/context/HabitContext";

export default function BackupModal({ isOpen, onClose }) {
  const {
    habits,
    records,
    profile,
    handleExportBackup,
    handleImportBackup,
    handleResetToDefaults,
    handleClearAllData
  } = useHabits();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null); // { type: 'success' | 'error', message }
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const totalCompletions = Object.values(records).reduce((total, day) => {
    return total + Object.values(day).filter(v => v === "completed").length;
  }, 0);

  const datesTrackedCount = Object.keys(records).length;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        handleImportBackup(json);
        setImportStatus({
          type: "success",
          message: `Successfully restored ${json.habits?.length || 0} habits and ${Object.keys(json.records || {}).length} days of data!`
        });
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1800);
      } catch (err) {
        setImportStatus({
          type: "error",
          message: err.message || "Failed to parse JSON backup file."
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onConfirmReset() {
    handleResetToDefaults();
    setConfirmReset(false);
    setImportStatus({
      type: "success",
      message: "Reset successfully to default reference sheet habits and data!"
    });
    setTimeout(() => {
      setImportStatus(null);
      onClose();
    }, 1200);
  }

  function onConfirmClear() {
    handleClearAllData();
    setConfirmClear(false);
    setImportStatus({
      type: "success",
      message: "All habits and records cleared."
    });
    setTimeout(() => {
      setImportStatus(null);
      onClose();
    }, 1200);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Backup & Storage"
      description="All your habit data is stored securely in your browser's local storage."
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        
        {/* Local Storage Stats */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-[#DDD6C9] text-center">
          <div>
            <div className="text-xl font-bold font-mono text-stone-900">{habits.length}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Habits</div>
          </div>
          <div className="border-x border-[#ECE6DC]">
            <div className="text-xl font-bold font-mono text-stone-900">{datesTrackedCount}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Days Logged</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#2D5A43]">{totalCompletions}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Completions</div>
          </div>
        </div>

        {/* Status message */}
        {importStatus && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${
              importStatus.type === "success"
                ? "bg-[#E8F0EB] text-[#2D5A43] border border-[#C6DC CE]"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {importStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Action 1: Export Data */}
        <div className="p-4 bg-white rounded-xl border border-[#DDD6C9] flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">Export Backup</h4>
            <p className="text-xs text-stone-500">
              Download all your habits and logs as a portable JSON file.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportBackup}
            className="shrink-0"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export JSON
          </Button>
        </div>

        {/* Action 2: Import Data */}
        <div className="p-4 bg-white rounded-xl border border-[#DDD6C9] flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">Import Backup</h4>
            <p className="text-xs text-stone-500">
              Restore your habits from a previously exported backup file.
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Upload className="w-3.5 h-3.5 mr-1" />
              Choose File
            </Button>
          </div>
        </div>

        {/* Action 3: Danger Zone / Reset */}
        <div className="p-4 bg-red-50/50 rounded-xl border border-red-200/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-800">
            Reset or Clear Options
          </h4>

          {/* Reset to Reference Defaults */}
          {!confirmReset ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-stone-600">
                Restore the 14 default habits from the reference photo.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmReset(true)}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-stone-500" />
                Reset Defaults
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
              <p className="text-xs text-amber-900 font-medium">
                Reset all habits and load the original reference tracker data?
              </p>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={onConfirmReset}>
                  Yes, Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Clear All Data */}
          {!confirmClear ? (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-red-100">
              <span className="text-xs text-stone-600">
                Permanently delete all habits and history from this browser.
              </span>
              <Button
                variant="dangerOutline"
                size="sm"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1 text-red-600" />
                Clear All
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-red-100/70 rounded-lg border border-red-200 space-y-2">
              <p className="text-xs text-red-900 font-medium">
                Are you sure? This will erase all habits and completion records on this device.
              </p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={onConfirmClear}>
                  Confirm Delete All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 p-3 bg-[#EFE8DC] rounded-xl text-stone-600 text-xs">
          <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0 mt-0.5" />
          <p>
            <strong>Note:</strong> Your data never leaves this computer or browser. There is no external server, sync, or tracking. Export a JSON backup periodically if you wish to keep an offline copy.
          </p>
        </div>

      </div>
    </Modal>
  );
}
