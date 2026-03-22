import { Home, Plus } from 'lucide-react';
import {useServers} from "../api/servers.ts";

type SidebarProps = {
    userId?: number | null;
}
export function Sidebar({ userId }: SidebarProps) {
    const {data: servers } = useServers(userId)

  return (
    <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2">
      {/* Home Button */}
      <button className="w-12 h-12 bg-[#5865f2] hover:bg-[#4752c4] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center group relative">
        <Home className="w-6 h-6 text-white" />
      </button>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-[#36393f] rounded-full my-1"></div>

      {/* Server Icons */}
      {servers?.map((server) => (
        <button
          key={server.id}
          className="w-12 h-12 bg-[#36393f] hover:bg-[#5865f2] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center group relative"
          title={server.name}
        >
          <span className="text-2xl">{server.icon}</span>
        </button>
      )) || []}

      {/* Add Server Button */}
      <button className="w-12 h-12 bg-[#36393f] hover:bg-[#3ba55d] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center group">
        <Plus className="w-6 h-6 text-[#3ba55d] group-hover:text-white" />
      </button>
    </div>
  );
}
