import MainWrapper from "./index.tsx";
import useCheckAuth from "./hooks/useCheckAuth";

export default function App() {

    const { isLoggedIn, isLoading, userId } = useCheckAuth()

    return (
        <div>
            <MainWrapper isLoading={isLoading} isLoggedIn={isLoggedIn} userId={userId} />
        </div>
    );
}
