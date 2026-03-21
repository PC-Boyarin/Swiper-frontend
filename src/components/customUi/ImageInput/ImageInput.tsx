//@ts-nocheck
import * as React from "react";
import { cn } from "../../ui/utils";

interface ImageInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
    onImageSelect?: (file: File, previewUrl: string) => void;
    onImageClear?: () => void;
    accept?: string;
    maxSize?: number; // в байтах
    previewClassName?: string;
    showPreview?: boolean;
}

const ImageInput = React.forwardRef<HTMLInputElement, ImageInputProps>(
    (
        {
            className,
            onImageSelect,
            onImageClear,
            accept = "image/jpeg,image/png,image/gif,image/webp",
            maxSize = 5 * 1024 * 1024, // 5MB по умолчанию
            previewClassName,
            showPreview = true,
            disabled,
            ...props
        }, ref
    ) => {
        const [preview, setPreview] = React.useState<string | null>(null);
        const [error, setError] = React.useState<string | null>(null);
        const [fileName, setFileName] = React.useState<string>("");
        const inputRef = React.useRef<HTMLInputElement>(null);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setError(null);

            if (!file) {
                handleClear();
                return;
            }

            // Проверка типа файла
            if (!accept.split(",").includes(file.type)) {
                setError(`Неподдерживаемый формат. Разрешены: ${accept}`);
                handleClear();
                return;
            }

            // Проверка размера
            if (file.size > maxSize) {
                setError(`Файл слишком большой. Максимальный размер: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
                handleClear();
                return;
            }

            setFileName(file.name);

            // Создаём превью
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setPreview(previewUrl);
                onImageSelect?.(file, previewUrl);
            };
            reader.readAsDataURL(file);
        };

        const handleClear = () => {
            setPreview(null);
            setFileName("");
            setError(null);
            onImageClear?.();
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        };

        const triggerFileInput = () => {
            if (!disabled) {
                inputRef.current?.click();
            }
        };

        return (
            <div className="space-y-2">
                {/* Скрытый input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled}
                    {...props}
                />

                {/* Область для загрузки */}
                {showPreview && preview ? (
                    // Режим превью (когда изображение выбрано)
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className={cn(
                                "w-full max-h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700",
                                previewClassName
                            )}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="px-3 py-1 bg-white text-gray-800 rounded-md text-sm hover:bg-gray-100 transition"
                            >
                                Изменить
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                            >
                                Удалить
                            </button>
                        </div>
                        {fileName && (
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {fileName}
                            </div>
                        )}
                    </div>
                ) : showPreview ? (
                    // Режим загрузки (когда изображение не выбрано)
                    <div
                        onClick={triggerFileInput}
                        className={cn(
                            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                            "border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400",
                            disabled && "opacity-50 cursor-not-allowed",
                            className
                        )}
                    >
                        <div className="p-8 text-center">
                            <svg
                                className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Нажмите или перетащите изображение
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {accept.split(",").map(format => format.replace("image/", "").toUpperCase()).join(", ")} • до {(maxSize / (1024 * 1024)).toFixed(1)}MB
                            </p>
                        </div>
                    </div>
                ) : (
                    // Режим кнопки (без превью)
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={disabled}
                        className={cn(
                            "px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        Выбрать изображение
                    </button>
                )}

                {/* Ошибка */}
                {error && (
                    <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                )}

                {/* Отображение выбранного файла (без превью) */}
                {!showPreview && fileName && !preview && (
                    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <span className="text-sm truncate">{fileName}</span>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

ImageInput.displayName = "ImageInput";

export { ImageInput };