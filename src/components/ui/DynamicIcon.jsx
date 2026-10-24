import React from "react";
import * as LucideIcons from "lucide-react";

export default function DynamicIcon({ name, className = "w-4 h-4", ...props }) {
  const IconComponent = LucideIcons[name] || LucideIcons.CheckCircle;
  return <IconComponent className={className} {...props} />;
}
