interface OptionType {
    label?: string;
    value?: string | number;
    name?: string;
    code?: string;
    command?: () => void;
}

export type { OptionType };
