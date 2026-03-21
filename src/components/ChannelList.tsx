//@ts-nocheck

import { Hash, Volume2, ChevronDown, Plus, Mic, Headphones, Settings as SettingsIcon } from 'lucide-react';
import {useEffect, useState} from "react";
import {createChannel, getAllChannels} from "../api/channels.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import CustomSelect from "./customUi/Select";
import { Input } from "./ui/input.tsx";
import {Switch} from "./ui/switch.tsx";
import {Button} from "./ui/button.tsx";
import type {Channel} from "../types/Channel.ts";

type ChannelListType = {
  userId: number | null
  setChannelId: React.Dispatch<React.SetStateAction<null | number>>
}

export function ChannelList({ userId, setChannelId }: ChannelListType) {
  const [textChannels, setTextChannels] = useState<Channel[]>([])
  const [selectedChannels, setSelectedChannels] = useState('')
  const [isOpenCreateChannel, setIsOpenCreateChannel] = useState(false)
  const voiceChannels = [
    { id: 1, name: 'Общий', users: 3 },
    { id: 2, name: 'Игровая', users: 0 },
    { id: 3, name: 'Музыка', users: 2 },
  ];
//'text' | 'voice' | 'announcement' | 'stage' | 'forum';
  const channelsTypes = [
    {
      label: 'text',
      value: 'text',
    },
    {
      label: 'voice',
      value: 'voice',
    },
    {
      label: 'announcement',
      value: 'announcement',
    },
    {
      label: 'stage',
      value: 'stage',
    },
    {
      label: 'forum',
      value: 'forum',
    },
  ]
  const [channelName, setChannelName] = useState('')
  const [isChannelPrivate, setIsChannelPrivate] = useState(false)

  async function getAllChannelsHandler() {
    try {
      const response = await getAllChannels({server_id: 2})
      if(response) {
        setTextChannels(response?.data)
      }
    } catch (err) {
      console.log('getAllChannelsHandler', err);
    }
  }

  async function createChannelHandler() {
    const variables: Channel = {
      server_id: 2,
      is_private: isChannelPrivate,
      created_by: Number(userId),
      name: channelName,
      type: selectedChannels
    }

    try {
      await createChannel(variables)
      await getAllChannelsHandler()
      setIsOpenCreateChannel(false)
    } catch (err) {
      console.log('createChannelHandler', err)
    }
  }

  useEffect(() => {
    getAllChannelsHandler()
  }, [])

  return (
    <div className="flex relative">

      <div>
        <Dialog open={isOpenCreateChannel} modal={true} onOpenChange={() => setIsOpenCreateChannel(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создание канала</DialogTitle>
            </DialogHeader>
            <div>
              <CustomSelect
                options={channelsTypes}
                value={selectedChannels}
                onValueChange={e => setSelectedChannels(String(e))}
                placeholder={'Выберите тип канала'}
              />

              <Input
                value={channelName}
                onChange={e => setChannelName(e.target.value)}
                placeholder={'Введите название канала'}
              />

              <Switch
                value={Number(isChannelPrivate)}
                onCheckedChange={e => setIsChannelPrivate(e)}
              ></Switch>
            </div>

            <div className="flex justify-end gap-1">
              <Button variant={'outline'} onClick={() => setIsOpenCreateChannel(false)} >Отменить</Button>
              <Button disabled={!channelName} variant={'outline'} onClick={createChannelHandler}>Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-60 bg-[#2f3136] flex flex-col">
        {/* Server Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-md hover:bg-[#34373c] cursor-pointer">
          <span className="font-semibold">Мой Сервер</span>
          <ChevronDown className="w-5 h-5" />
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* Text Channels */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 mb-1 group">
              <div className="flex items-center gap-1 text-[#96989d] text-xs uppercase cursor-pointer hover:text-[#dcddde]">
                <ChevronDown className="w-3 h-3" />
                <span>Текстовые каналы</span>
              </div>
              <Plus onClick={() => setIsOpenCreateChannel(!isOpenCreateChannel)} className="w-4 h-4 text-[#96989d] opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#dcddde]" />
            </div>
            {textChannels?.map((channel) => (
              <div
                onClick={() => setChannelId(Number(channel?.id))}
                key={channel.id}
                className="flex items-center gap-2 px-2 py-1.5 mx-0.5 rounded cursor-pointer text-[#96989d] hover:bg-[#3c3f45] hover:text-[#dcddde] group"
              >
                <Hash className="w-5 h-5" />
                <span>{channel.name}</span>
              </div>
            )) || []}
          </div>

          {/* Voice Channels */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1 group">
              <div className="flex items-center gap-1 text-[#96989d] text-xs uppercase cursor-pointer hover:text-[#dcddde]">
                <ChevronDown className="w-3 h-3" />
                <span>Голосовые каналы</span>
              </div>
              <Plus className="w-4 h-4 text-[#96989d] opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#dcddde]" />
            </div>
            {voiceChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center gap-2 px-2 py-1.5 mx-0.5 rounded cursor-pointer text-[#96989d] hover:bg-[#3c3f45] hover:text-[#dcddde]"
              >
                <Volume2 className="w-5 h-5" />
                <span>{channel.name}</span>
                {channel.users > 0 && (
                    <span className="ml-auto text-xs text-[#96989d]">{channel.users}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Panel */}
        <div className="h-[52px] bg-[#292b2f] px-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
              <span>👤</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-white">Пользователь</span>
              <span className="text-xs text-[#b9bbbe]">#1234</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#3c3f45] rounded">
              <Mic className="w-5 h-5 text-[#b9bbbe] hover:text-[#dcddde]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#3c3f45] rounded">
              <Headphones className="w-5 h-5 text-[#b9bbbe] hover:text-[#dcddde]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#3c3f45] rounded">
              <SettingsIcon className="w-5 h-5 text-[#b9bbbe] hover:text-[#dcddde]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
