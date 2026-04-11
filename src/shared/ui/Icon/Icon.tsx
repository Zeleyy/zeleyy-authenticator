import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: number | string;
}

export const Icon = ({ name, size = 24, className, ...rest }: IconProps) => {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            fill="currentColor"
            stroke="currentColor"
            {...rest}
        >
            <use href={`/sprite.svg#${name}`} />
        </svg>
    );
};
