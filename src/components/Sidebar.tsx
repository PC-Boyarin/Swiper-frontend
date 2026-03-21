import { Home, Plus } from 'lucide-react';
import {useServers} from "../api/servers.ts";

type SidebarProps = {
    userId: number | null;
}
export function Sidebar({ userId }: SidebarProps) {
  // const servers = [
  //   { id: 1, name: 'Сервер 1', icon: '🎮' },
  //   { id: 2, name: 'Сервер 2', icon: '🎨' },
  //   { id: 3, name: 'Сервер 3', icon: '🎵' },
  //   { id: 4, name: 'Сервер 4', icon: '📚' },
  //   { id: 5, name: 'Сервер 5', icon: '⚡' },
  // ];

  // async function getAllServersHandler() {
  //     try {
  //         const response = await getAllServers({user_id: userId});
  //         console.log(response?.data);
  //     } catch (err) {
  //         console.error('getAllServers', err);
  //     }
  // }
  //
  // useEffect(() => {
  //     getAllServersHandler()
  // }, [userId])

    const {data: servers } = useServers(userId)
    // console.log('servers', servers)
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
