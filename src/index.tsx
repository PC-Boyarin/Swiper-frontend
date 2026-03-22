import {Sidebar} from "./components/Sidebar.tsx";
import {ChannelList} from "./components/channelList/ChannelList.tsx";
import {ChatArea} from "./components/ChatArea.tsx";
import {LoginRegister} from "./components/LoginRegister.tsx";
import Loader from "./components/customUi/loading";
import {useEffect, useState} from "react";

interface MainWrapperProps {
    isLoggedIn: boolean | null
    isLoading: boolean
    userId?: number | null
}

interface LoaderHandlerProps {
    isLoading: boolean
    children: React.ReactNode
}

function LoaderHandler({isLoading, children}: LoaderHandlerProps) {
    if(isLoading) {
        return <Loader/>
    }

    return <>{children}</>
}

export default function MainWrapper({isLoading, isLoggedIn, userId: user_id}: MainWrapperProps) {
    const [isLogged, setIsLogged] = useState<boolean | null>(isLoggedIn)
    const [channelId, setChannelId] = useState<null | number>(null);
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {

        if(isLoggedIn) {
            setIsLogged(isLoggedIn)
        }
    }, [isLoggedIn]);

    return (
        <div>
            <LoaderHandler isLoading={isLoading}>
                {isLogged && !isLoading ? (
                    <div className="flex h-screen bg-[#36393f] text-yellow">
                        <Sidebar userId={userId || user_id} />
                        <ChannelList
                            setChannelId={setChannelId}
                            userId={userId || user_id}
                        />
                        <ChatArea channelId={channelId}/>
                    </div>
                ) : (
                    <LoginRegister
                        onLogin={() => setIsLogged(true)}
                        setUserId={setUserId}
                    />
                )}
            </LoaderHandler>
        </div>
    )
}