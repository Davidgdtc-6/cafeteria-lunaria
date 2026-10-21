export const WHATSAPP_BASE = "https://api.whatsapp.com/send?phone=593980649164";

export function whatsAppUrl(message) {
  return `${WHATSAPP_BASE}&text=${encodeURIComponent(message)}`;
}
