import * as Icons from "@radix-ui/react-icons";

export default function SidebarItem({ href, iconName, children }) {
  const IconComponent = Icons[iconName];

  return (
    <li>
      <a
        href={href}
        className="flex gap-4 text-zinc-400 hover:text-zinc-100 py-3.5 font-semibold 
        transition-all duration-300 ease-in-out hover:translate-y-[-2px]"
      >
        {IconComponent ? (
          <IconComponent className="h-6 w-6" />
        ) : (
          <span className="h-6 w-6" />
        )}
        {children}
      </a>
    </li>
  );
}
