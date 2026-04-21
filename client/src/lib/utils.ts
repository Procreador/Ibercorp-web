import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number) {
  if (!price) return "Consultar";
  const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, ''), 10) : price;
  if (isNaN(num)) return price.toString();
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(num);
}
