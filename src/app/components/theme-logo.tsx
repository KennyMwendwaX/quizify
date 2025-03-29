"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeLogo({ width = 20, height = 20, alt = "Logo" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} />;
  }

  const logoSrc =
    resolvedTheme === "dark" ? "/logo-light.svg" : "/logo-dark.svg";

  return <Image src={logoSrc} width={width} height={height} alt={alt} />;
}
