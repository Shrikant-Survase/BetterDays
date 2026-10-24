"use client";

import React from "react";
import Image from "next/image";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Check, CheckSquare } from "lucide-react";

export default function ReferenceModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Paper Habit Tracker Reference"
      description="The original paper system that inspired BetterDays"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden border border-[#D5CEC2] shadow-inner bg-stone-100 max-h-[60vh] flex items-center justify-center">
          <img
            src="/reference_tracker.jpeg"
            alt="Original paper monthly habit tracker"
            className="w-full h-auto object-contain max-h-[55vh]"
          />
        </div>

        <div className="bg-[#EFE8DD] p-4 rounded-xl border border-[#DFD6C7] text-xs text-stone-700 space-y-2">
          <h4 className="font-semibold text-stone-900 font-serif">
            Key Paper Tracker Elements Preserved:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Full 31-day horizontal paper grid</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Original 14 habits & protocols pre-loaded</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>✓ (completed) and ✕ (skipped) cell cycling</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Daily habits Score Graph directly under the days</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Personalized header (Name: {`shrikant`}, Month)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Bottom tagline: "Becoming Better"</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="default" onClick={onClose}>
            Back to Tracker
          </Button>
        </div>
      </div>
    </Modal>
  );
}
