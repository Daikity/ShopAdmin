type HeaderProps = {
  onOpenMobileNav: () => void
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  return (
    <div className="flex h-14 items-center gap-3 px-4 md:px-6">
      <button
        type="button"
        className="rounded-md border border-border px-3 py-1.5 text-small font-medium text-text-primary lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Открыть меню"
      >
        Меню
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-small text-text-secondary">
          E-commerce operations panel
        </p>
      </div>
      <span className="rounded-md bg-surface-muted px-2.5 py-1 text-caption font-medium text-text-secondary">
        Phase 0
      </span>
    </div>
  )
}
