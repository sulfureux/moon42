import React, { PropsWithChildren } from "react";
import cn from "../../services/cn";

const Button: React.FC<
  PropsWithChildren<{
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    hide?: boolean;
    type?: "button" | "submit" | "reset";
    kind?: "normal" | "success" | "confirm" | "cancel" | "error";
    loading?: boolean;
    size?: "large" | "normal" | "small";
    block?: boolean;
  }>
> = ({ children, onClick, className, disabled, hide, type = "button", loading, kind = "normal", size = "normal", block }) => {
  if (hide) {
    return null;
  }

  return (
    <button
      formNoValidate
      type={type}
      className={cn(
        "select-none cursor-pointer text-[16px] font-bold bg-[#BE513F] text-white hover:bg-[#903d2f] transition",
        disabled ? "bg-gray-500" : "",
        {
          "py-2 px-5": size === "normal",
          "py-1 px-2": size === "small",
          "py-3 px-8 text-[16px]": size === "large",

          block,

          "w-full": block,
        },

        className,
      )}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
