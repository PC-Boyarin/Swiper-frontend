import {SelectContent, SelectItem, SelectTrigger, SelectValue, Select} from "../../ui/select.tsx";
import type {SelectType} from "../../../types/ui.ts";
interface CustomSelectType {
    options: SelectType[]
    value?: string
    onValueChange: (value?: string) => void;
    placeholder?: string
    required?: boolean
}
export default function CustomSelect({options, value, onValueChange, required, placeholder = ''}: CustomSelectType) {
    return (
        <Select required={required} value={value} onValueChange={(e => onValueChange(e))}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options?.map(channel => (
                    <SelectItem value={channel?.value}>{channel?.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}