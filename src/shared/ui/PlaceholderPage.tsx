type PlaceholderPageProps = {
  title: string
  description: string
}

/** Временная страница-заглушка до реализации домена. */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="space-y-2">
      <h1 className="text-h1">{title}</h1>
      <p className="max-w-2xl text-body text-text-secondary">{description}</p>
    </section>
  )
}
