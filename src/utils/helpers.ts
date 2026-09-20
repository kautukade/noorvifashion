import { storeConfig } from "../config/storeConfig";
import type { Product } from "../data/products";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function inr(n: number): string {
  return `${storeConfig.currency}${n.toLocaleString("en-IN")}`;
}

export function discountPct(price: number, original: number): number {
  if (original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function totalStock(product: Product): number {
  return Object.values(product.stock).reduce((a, b) => a + b, 0);
}

export function stockInfo(
  product: Product
): { label: string; tone: "ok" | "low" | "out" } {
  const total = totalStock(product);
  if (total <= 0) return { label: "SOLD OUT", tone: "out" };
  if (total <= 3) return { label: `ONLY ${total} LEFT`, tone: "low" };
  return { label: "IN STOCK", tone: "ok" };
}

export function isWhatsAppReady(): boolean {
  return /^\d{10,15}$/.test(storeConfig.whatsappNumber);
}

export function buildOrderMessage(args: {
  name: string;
  code: string;
  size?: string;
  color?: string;
  price: number;
}): string {
  return [
    `Hi ${storeConfig.name} 👋`,
    "",
    "I am interested in this product:",
    "",
    `Product: ${args.name}`,
    `Product Code: ${args.code}`,
    `Size: ${args.size ?? "—"}`,
    `Colour: ${args.color ?? "—"}`,
    `Price: ${inr(args.price)}`,
    "",
    "Please confirm availability.",
  ].join("\n");
}

export function waLink(message: string): string {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function timeAgo(ts: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}


/** Replace the original Noorvi brand wording with the current admin-configured shop name. */
export function brandText(text: string, storeName: string): string {
  return text.replace(/Noorvi(?: Ladies Wear| Fashion)?/gi, storeName);
}
