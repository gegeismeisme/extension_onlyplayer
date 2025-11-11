type SidebarProps = {
  folders: Array<{ id: string; name: string }>
  onSelect: (id: string) => void
  emptyLabel: string
}

export function Sidebar({ folders, onSelect, emptyLabel }: SidebarProps) {
  if (folders.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-left text-sm transition hover:border-plasma/50"
          onClick={() => onSelect(folder.id)}
        >
          <span>{folder.name}</span>
          <span className="text-xs text-white/40">↺</span>
        </button>
      ))}
    </div>
  )
}
