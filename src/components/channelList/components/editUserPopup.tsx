import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../../ui/dialog.tsx";
import {Input} from "../../ui/input.tsx";
import {Button} from "../../ui/button.tsx";
import {ImageInput} from "../../customUi/ImageInput/ImageInput.tsx";
import {updateUser} from "../../../api/user.ts";


type EditUserPopupProps = {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    currentUser: any
}
export default function EditUserPopup({isOpen, onOpenChange, currentUser}: EditUserPopupProps) {

    const [userName, setUserName] = useState(currentUser?.username || '');
    const [selectedImage, setSelectedImage] = useState<{
        file: File | string;
        preview: string;
    } | null>({file: '', preview: currentUser?.image_icon});

    const handleImageSelect = (file: File, previewUrl: string) => {
        console.log("Selected:", file.name, file.size);
        setSelectedImage({ file, preview: previewUrl });
    };

    const handleImageClear = () => {
        setSelectedImage(null);
    };

    async function updateUserHandler() {
        try {
            const body = {
                username: userName,
                image_icon: selectedImage?.preview,
                user_id: currentUser?.id,
            }
            //@ts-ignore
            const response = await updateUser(body)
            onOpenChange(false)
            // console.log(selectedImage)
            console.log('response', response)
        } catch (err) {
            console.log('updateUserHandler', err);
        }
    }

    return (
        <Dialog open={isOpen} modal={true} onOpenChange={() => onOpenChange(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование профиля</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    <Input
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        placeholder={'Username'}
                    />

                    <ImageInput
                        onImageSelect={handleImageSelect}
                        onImageClear={handleImageClear}
                        maxSize={10 * 1024 * 1024} // 10MB
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        showPreview={true}
                        className="mb-2"
                    />

                    <div className="flex gap-2">
                        {/*<textarea*/}
                        {/*    placeholder="Введите сообщение..."*/}
                        {/*    className="flex-1 p-2 rounded-lg border"*/}
                        {/*/>*/}
                        {/*<button*/}
                        {/*    onClick={() => {*/}
                        {/*        if (selectedImage) {*/}
                        {/*            // Отправить сообщение с изображением*/}
                        {/*            console.log("Sending image:", selectedImage.file);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*    className="px-4 py-2 bg-blue-500 text-white rounded-lg"*/}
                        {/*>*/}
                        {/*    Отправить*/}
                        {/*</button>*/}
                    </div>
                </div>

                <div className="flex justify-end gap-1">
                    <Button variant={'outline'} onClick={() => onOpenChange(false)}>Отменить</Button>
                    <Button variant={'outline'} onClick={updateUserHandler}>Сохранить</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}