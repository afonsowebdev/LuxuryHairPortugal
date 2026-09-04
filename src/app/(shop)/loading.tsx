export default function ShopLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-plum/15 border-t-gold" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-plum-dark/40">
        A carregar
      </p>
    </div>
  );
}
