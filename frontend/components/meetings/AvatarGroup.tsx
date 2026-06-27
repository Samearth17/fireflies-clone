export function AvatarGroup({ names, limit = 4 }: { names: string[]; limit?: number }) {
  const visible = names.slice(0, limit);
  const hidden = Math.max(0, names.length - visible.length);

  return (
    <div className="flex -space-x-2" aria-label={`${names.length} participants`}>
      {visible.map((name) => (
        <div
          key={name}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-700"
          title={name}
        >
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
      ))}
      {hidden > 0 && <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-semibold text-white">+{hidden}</div>}
    </div>
  );
}
