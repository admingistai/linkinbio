import { LinkItem } from "@/lib/types";
import EnhancedLinkButton from "./EnhancedLinkButton";

interface LinkGridProps {
  links: LinkItem[];
  onTalkClick?: () => void;
  isConnecting?: boolean;
}

export default function LinkGrid({ links, onTalkClick, isConnecting }: LinkGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
      {links.map((link, index) => (
        <EnhancedLinkButton
          key={link.id}
          link={link}
          index={index}
          onClick={link.type === "talk" ? onTalkClick : undefined}
          isLoading={isConnecting}
        />
      ))}
    </div>
  );
}