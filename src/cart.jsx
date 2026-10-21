import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { whatsAppUrl } from "./whatsapp";

export const CART_STORAGE_KEY = "lunaria-cart-v1";

export const DELIVERY_MINIMUM = 1.5;

export const MODALITIES = {
  pickup: {
    id: "pickup",
    label: "Para llevar",
    hint: "Recojo en el local",
  },
  delivery: {
    id: "delivery",
    label: "Envío a domicilio",
    hint: `Pedido mínimo ${formatPrice(DELIVERY_MINIMUM)}`,
  },
};

export function parsePrice(raw) {
  if (typeof raw === "number") return { kind: "single", values: [raw] };

  const text = String(raw ?? "");
  if (/consultar/i.test(text)) return { kind: "consult", values: null };

  const values = text
    .split("/")
    .map((part) => part.replace(/[^\d,.]/g, "").trim())
    .filter(Boolean)
    .map((part) => Number(part.replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (!values.length) return { kind: "consult", values: null };
  return values.length > 1
    ? { kind: "variants", values }
    : { kind: "single", values };
}

export function formatPrice(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `$${safe.toFixed(2).replace(".", ",")}`;
}

export function buildOrderMessage(lines, options = {}) {
  const { note = "", modality = "pickup", address = "" } = options;
  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  const detail = lines
    .map(
      (line) =>
        `• ${line.qty} × ${line.name} — ${formatPrice(line.unitPrice)} c/u — Subtotal: ${formatPrice(line.unitPrice * line.qty)}`,
    )
    .join("\n");
  const notes = (note ?? "").trim();
  const delivery = modality === "delivery";
  const destination = (address ?? "").trim();

  return [
    delivery
      ? "¡Hola! 👋 Quiero realizar un pedido con envío a domicilio en Cafetería Lunaria."
      : "¡Hola! 👋 Quiero realizar un pedido para llevar en Cafetería Lunaria.",
    "",
    "MI PEDIDO:",
    "",
    detail,
    "",
    `TOTAL: ${formatPrice(total)}`,
    "",
    `MODALIDAD: ${delivery ? "Envío a domicilio" : "Para llevar"}.`,
    ...(delivery && destination ? ["", `DIRECCIÓN DE ENTREGA: ${destination}`] : []),
    ...(notes ? ["", `NOTAS: ${notes}`] : []),
    "",
    "¡Gracias! 😊",
  ].join("\n");
}

function toLine(product, unitPrice) {
  return {
    lineId: `${product.id}::${unitPrice}`,
    productId: product.id,
    name: product.name,
    unitPrice,
    image: product.image,
    category: product.category,
    section: product.section,
    subcategory: product.subcategory,
    qty: 1,
  };
}

const CartContext = createContext(null);

export function CartProvider({ products, children }) {
  const catalog = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const [lines, setLines] = useState([]);
  const [note, setNote] = useState("");
  const [modality, setModality] = useState("pickup");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);

        if (Array.isArray(saved?.lines)) {
          const restored = saved.lines
            .map((entry) => {
              const product = catalog.get(entry?.productId);
              if (!product) return null;

              const options = product.priceOptions;
              if (!Array.isArray(options) || !options.length) return null;

              const unitPrice = options.some(
                (option) => Math.abs(option - entry.unitPrice) < 0.001,
              )
                ? entry.unitPrice
                : options[0];

              const qty = Math.max(1, Math.floor(Number(entry.qty) || 1));
              return { ...toLine(product, unitPrice), qty };
            })
            .filter(Boolean);

          setLines(restored);
        }

        if (typeof saved?.note === "string") setNote(saved.note);
        if (saved?.modality === "delivery" || saved?.modality === "pickup") {
          setModality(saved.modality);
        }
        if (typeof saved?.address === "string") setAddress(saved.address);
      }
    } catch {
      // Almacenamiento corrupto o no disponible: se empieza con el carrito vacío.
    }

    setHydrated(true);
  }, [catalog]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          lines: lines.map((line) => ({
            productId: line.productId,
            unitPrice: line.unitPrice,
            qty: line.qty,
          })),
          note,
          modality,
          address,
        }),
      );
    } catch {
      // Sin persistencia (modo privado): el carrito sigue funcionando en memoria.
    }
  }, [lines, note, modality, address, hydrated]);

  const addItem = useCallback((product, unitPrice) => {
    setLines((current) => {
      const lineId = `${product.id}::${unitPrice}`;
      const existing = current.find((line) => line.lineId === lineId);

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [...current, { ...toLine(product, unitPrice), qty: 1 }];
    });
  }, []);

  const increment = useCallback((lineId) => {
    setLines((current) =>
      current.map((line) =>
        line.lineId === lineId ? { ...line, qty: line.qty + 1 } : line,
      ),
    );
  }, []);

  const decrement = useCallback((lineId) => {
    setLines((current) =>
      current.map((line) =>
        line.lineId === lineId ? { ...line, qty: Math.max(1, line.qty - 1) } : line,
      ),
    );
  }, []);

  const removeItem = useCallback((lineId) => {
    setLines((current) => current.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setNote("");
    setModality("pickup");
    setAddress("");
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty, 0),
    [lines],
  );

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0),
    [lines],
  );

  const isDelivery = modality === "delivery";
  const missingForMinimum = Math.max(0, DELIVERY_MINIMUM - total);
  const belowMinimum = isDelivery && missingForMinimum > 0.001;
  const missingAddress = isDelivery && !address.trim();
  const canOrder = lines.length > 0 && !belowMinimum && !missingAddress;

  const orderMessage = useMemo(
    () => buildOrderMessage(lines, { note, modality, address }),
    [lines, note, modality, address],
  );

  const orderLink = useMemo(
    () => (canOrder ? whatsAppUrl(orderMessage) : ""),
    [canOrder, orderMessage],
  );

  // Al preparar el pedido el carrito queda limpio: si el cliente vuelve a la web
  // no ve el pedido anterior y no puede duplicarlo por error.
  const prepareOrder = useCallback(() => {
    setLines([]);
    setNote("");
    setModality("pickup");
    setAddress("");
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      lines,
      count,
      total,
      note,
      setNote,
      modality,
      setModality,
      address,
      setAddress,
      isDelivery,
      belowMinimum,
      missingForMinimum,
      missingAddress,
      canOrder,
      isOpen,
      openCart,
      closeCart,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      prepareOrder,
      orderMessage,
      orderLink,
    }),
    [
      lines,
      count,
      total,
      note,
      modality,
      address,
      isDelivery,
      belowMinimum,
      missingForMinimum,
      missingAddress,
      canOrder,
      isOpen,
      openCart,
      closeCart,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
      prepareOrder,
      orderMessage,
      orderLink,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {count === 0
          ? "El carrito está vacío."
          : `${count} ${count === 1 ? "producto" : "productos"} en el pedido. Total ${formatPrice(total)}.`}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

/**
 * Enlace de WhatsApp para el pedido. Al pulsarlo se abre la conversación con el
 * mensaje ya escrito y el carrito queda vaciado, de modo que si el cliente vuelve
 * a la web no encuentre el pedido anterior y no pueda duplicarlo.
 */
export function useOrderWhatsApp() {
  const { orderLink, prepareOrder, lines } = useCart();
  const url =
    orderLink || whatsAppUrl("Hola, quiero hacer un pedido en Cafetería Lunaria.");

  const handleClick = (event) => {
    const href = event.currentTarget.getAttribute("href");

    if (!href) {
      event.preventDefault();
      return;
    }

    // window.open con "noopener" devuelve null por especificacion, asi que se abre
    // la pestana y se anula el opener a mano para poder detectar el bloqueo.
    const opened = window.open(href, "_blank");

    if (opened) {
      opened.opener = null;
      event.preventDefault();
      if (lines.length) prepareOrder();
    }
    // Si el navegador bloquea la pestana, el enlace nativo se encarga y el carrito
    // se conserva para que el cliente no pierda el pedido.
  };

  return { url, handleClick };
}

export function AddToCartControl({ product, className = "" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const options = product.priceOptions;
  const isConsult = !Array.isArray(options) || options.length === 0;

  const confirmAdd = (unitPrice) => {
    addItem(product, unitPrice);
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1400);
  };

  if (isConsult) {
    return (
      <a
        href={whatsAppUrl(
          `Hola, quiero consultar el precio de "${product.name}" en Cafetería Lunaria.`,
        )}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-lunaria-coffee/15 bg-white px-4 py-2.5 text-xs font-extrabold text-lunaria-coffee transition hover:-translate-y-0.5 hover:bg-lunaria-cream ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        Consultar precio
      </a>
    );
  }

  const isVariant = options.length > 1;

  return (
    <div className={className}>
      {isVariant && (
        <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-lunaria-coffee/55">
          Opciones
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {isVariant
          ? options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => confirmAdd(option)}
                title={`Añadir ${product.name} al pedido`}
                aria-label={`Añadir ${product.name} al pedido por ${formatPrice(option)}`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-lunaria-coal px-3 py-2.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-lunaria-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
              >
                <Plus className="h-3.5 w-3.5" />
                {formatPrice(option)}
              </button>
            ))
          : null}

        {!isVariant && (
          <button
            type="button"
            onClick={() => confirmAdd(options[0])}
            aria-label={`Añadir ${product.name} al pedido`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lunaria-coal px-4 py-2.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-lunaria-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Añadido
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Añadir
              </>
            )}
          </button>
        )}
      </div>

      {isVariant && added && (
        <p className="mt-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-lunaria-solar">
          Añadido al pedido
        </p>
      )}
    </div>
  );
}

export function CartButton({ className = "" }) {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        count
          ? `Ver mi pedido, ${count} ${count === 1 ? "producto" : "productos"}`
          : "Ver mi pedido, carrito vacío"
      }
      className={`relative grid h-11 w-11 place-items-center rounded-full bg-lunaria-warm text-lunaria-coal transition hover:-translate-y-0.5 hover:bg-lunaria-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span
          key={count}
          className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-lunaria-coffee px-1 font-mono text-[10px] font-bold text-white shadow-soft lunaria-badge-pop"
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function CartFab({ className = "" }) {
  const { count, openCart, isOpen } = useCart();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        count
          ? `Ver mi pedido, ${count} ${count === 1 ? "producto" : "productos"}`
          : "Ver mi pedido, carrito vacío"
      }
      className={`fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-lunaria-coal px-5 py-4 text-sm font-extrabold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-lunaria-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lunaria-solar sm:bottom-6 sm:right-6 ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span>Pedido</span>
      {count > 0 && (
        <span
          key={count}
          className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-lunaria-cream px-1.5 font-mono text-[11px] font-bold text-lunaria-coffee lunaria-badge-pop"
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const {
    lines,
    count,
    total,
    note,
    setNote,
    modality,
    setModality,
    address,
    setAddress,
    isDelivery,
    belowMinimum,
    missingForMinimum,
    missingAddress,
    canOrder,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
    clearCart,
    orderLink,
  } = useCart();

  const { handleClick } = useOrderWhatsApp();

  const [rendered, setRendered] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      restoreFocusRef.current = document.activeElement;
      const timer = setTimeout(() => panelRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }

    if (restoreFocusRef.current) {
      restoreFocusRef.current.focus?.();
      restoreFocusRef.current = null;
    }

    const timer = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setConfirmClear(false);
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeCart}
        className={`absolute inset-0 h-full w-full cursor-default bg-lunaria-coal/45 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col bg-lunaria-warm shadow-warm outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-l-[2rem] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-lunaria-coffee/10 px-5 py-5">
          <div>
            <span className="section-kicker !px-3 !py-1.5 !text-[10px]">
              {isDelivery ? "Envío a domicilio" : "Para llevar"}
            </span>
            <h2 className="mt-2 text-2xl font-black text-lunaria-coal">
              Tu pedido
              <span className="ml-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-lunaria-solar">
                {count} {count === 1 ? "producto" : "productos"}
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar el pedido"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lunaria-coal shadow-soft transition hover:-translate-y-0.5 hover:bg-lunaria-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-lunaria-cream text-lunaria-coffee">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <p className="font-serif text-2xl italic text-lunaria-solar">
              Tu pedido está vacío.
            </p>
            <p className="max-w-xs text-sm leading-6 text-lunaria-coal/64">
              Elige tus favoritos en el menú y los verás aquí, listos para
              enviar por WhatsApp.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-lunaria-coal px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-lunaria-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lunaria-solar"
            >
              Ver el menú
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map((line) => (
                <article
                  key={line.lineId}
                  className="flex gap-3 rounded-[1.25rem] border border-lunaria-coffee/10 bg-white p-3 shadow-soft"
                >
                  <img
                    src={line.image}
                    alt={line.name}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-[0.9rem] object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-extrabold leading-tight text-lunaria-coal">
                        {line.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(line.lineId)}
                        aria-label={`Eliminar ${line.name} del pedido`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lunaria-coffee/45 transition hover:bg-lunaria-latte/60 hover:text-lunaria-coffee focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar sm:h-8 sm:w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-0.5 font-mono text-[11px] text-lunaria-coffee/65">
                      {formatPrice(line.unitPrice)} c/u
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-lunaria-warm p-1">
                        <button
                          type="button"
                          onClick={() => decrement(line.lineId)}
                          disabled={line.qty <= 1}
                          aria-label={`Quitar una unidad de ${line.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-lunaria-coal transition hover:bg-lunaria-cream disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span
                          aria-label={`Cantidad de ${line.name}`}
                          className="min-w-[1.75rem] text-center font-mono text-sm font-bold text-lunaria-coal"
                        >
                          {line.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => increment(line.lineId)}
                          aria-label={`Añadir una unidad de ${line.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-lunaria-coal transition hover:bg-lunaria-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-lunaria-coal">
                        {formatPrice(line.unitPrice * line.qty)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              <fieldset className="rounded-[1.25rem] border border-lunaria-coffee/10 bg-white p-3 shadow-soft">
                <legend className="px-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-lunaria-coffee/60">
                  Modalidad
                </legend>

                <div className="mt-1 grid grid-cols-2 gap-2">
                  {Object.values(MODALITIES).map((option) => {
                    const active = modality === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setModality(option.id)}
                        aria-pressed={active}
                        className={`rounded-2xl border px-3 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar ${
                          active
                            ? "border-lunaria-solar bg-lunaria-solar text-white shadow-soft"
                            : "border-lunaria-coffee/12 bg-lunaria-warm text-lunaria-coal hover:bg-lunaria-cream"
                        }`}
                      >
                        <span className="block text-xs font-extrabold leading-tight">
                          {option.label}
                        </span>
                        <span
                          className={`mt-0.5 block font-mono text-[10px] font-medium ${
                            active ? "text-white/80" : "text-lunaria-coffee/60"
                          }`}
                        >
                          {option.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isDelivery && (
                  <label className="mt-3 block">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-lunaria-coffee/60">
                      Dirección de entrega
                    </span>
                    <input
                      type="text"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      maxLength={160}
                      placeholder="Calle, número, referencia y sector"
                      className="mt-2 w-full rounded-2xl border border-lunaria-coffee/10 bg-lunaria-warm/60 px-3 py-2 text-sm text-lunaria-coal outline-none transition placeholder:text-lunaria-coffee/40 focus:border-lunaria-solar"
                    />
                  </label>
                )}
              </fieldset>

              <label className="block rounded-[1.25rem] border border-lunaria-coffee/10 bg-white p-3 shadow-soft">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-lunaria-coffee/60">
                  Notas del pedido (opcional)
                </span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={2}
                  maxLength={280}
                  placeholder="Sin azúcar, sin cebolla, prepararlo bien frío..."
                  className="mt-2 w-full resize-none rounded-2xl border border-lunaria-coffee/10 bg-lunaria-warm/60 px-3 py-2 text-sm text-lunaria-coal outline-none transition placeholder:text-lunaria-coffee/40 focus:border-lunaria-solar"
                />
              </label>
            </div>

            <footer className="border-t border-lunaria-coffee/10 bg-white/70 px-4 py-4 backdrop-blur-xl">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-lunaria-coffee/60">
                    Total a pagar
                  </p>
                  <p className="font-mono text-3xl font-bold text-lunaria-coal">
                    {formatPrice(total)}
                  </p>
                </div>

                {confirmClear ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="rounded-full bg-lunaria-coffee px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-lunaria-coal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
                    >
                      Sí, vaciar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="rounded-full bg-lunaria-warm px-3 py-2 text-[11px] font-extrabold text-lunaria-coal transition hover:bg-lunaria-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-extrabold text-lunaria-coffee/70 transition hover:bg-lunaria-latte/50 hover:text-lunaria-coffee focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lunaria-solar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Vaciar
                  </button>
                )}
              </div>

              {(belowMinimum || missingAddress) && (
                <p
                  role="alert"
                  className="mt-3 rounded-2xl border border-lunaria-coffee/15 bg-lunaria-latte/40 px-3 py-2.5 text-xs font-bold leading-5 text-lunaria-coffee"
                >
                  {belowMinimum
                    ? `El envío a domicilio pide un mínimo de ${formatPrice(
                        DELIVERY_MINIMUM,
                      )}. Te faltan ${formatPrice(missingForMinimum)}.`
                    : "Escribe la dirección de entrega para poder enviar el pedido."}
                </p>
              )}

              {canOrder ? (
                <a
                  href={orderLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleClick}
                  aria-label="Hacer pedido por WhatsApp"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lunaria-coal px-5 py-4 text-sm font-extrabold text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-lunaria-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lunaria-solar"
                >
                  <MessageCircle className="h-5 w-5" />
                  Hacer pedido por WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="Hacer pedido por WhatsApp"
                  className="mt-3 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-lunaria-coal/35 px-5 py-4 text-sm font-extrabold text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  Hacer pedido por WhatsApp
                </button>
              )}

              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-lunaria-coffee/45">
                Se abrirá WhatsApp con el pedido listo para enviar
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
