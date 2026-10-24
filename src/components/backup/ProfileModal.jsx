"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { useHabits } from "@/context/HabitContext";
import { Check } from "lucide-react";

export default function ProfileModal({ isOpen, onClose }) {
  const { profile, updateProfile } = useHabits();
  const [name, setName] = useState(profile.name || "shrikant");
  const [tagline, setTagline] = useState(profile.tagline || "Becoming Better");
  const [creatorHandle, setCreatorHandle] = useState(profile.creatorHandle || "@shrikantsurvase");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile.name || "shrikant");
    setTagline(profile.tagline || "Becoming Better");
    setCreatorHandle(profile.creatorHandle || "@shrikantsurvase");
  }, [profile, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    updateProfile({
      name: name.trim() || "shrikant",
      tagline: tagline.trim() || "Becoming Better",
      creatorHandle: creatorHandle.trim()
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalize Tracker"
      description="Customize the names displayed on your monthly paper habit sheet."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name / Title"
          id="profile_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. shrikant"
          required
        />

        <Input
          label="Tagline / Motto"
          id="profile_tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Becoming Better"
        />

        <Input
          label="Bottom Sheet Handle / Credit"
          id="profile_handle"
          value={creatorHandle}
          onChange={(e) => setCreatorHandle(e.target.value)}
          placeholder="e.g. @shrikantsurvase"
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E5DFD4]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" type="submit">
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
