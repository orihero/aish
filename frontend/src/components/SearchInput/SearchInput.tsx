import React, { FC } from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";
import { Colors } from "../../shared/utils/color";
import IconBtn from "../../shared/constants/iconBtn";

type Props = {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

const SearchInput: FC<Props> = ({
    placeholder,
    value,
    onChange,
    className,
}) => {
    return (
        <InputContainer className={className}>
            <IconBtn icon={<FiSearch size={20} color={Colors.titleColor} />} />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </InputContainer>
    );
};

export default SearchInput;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 5px;
    margin-right: 10px;
    gap: 10px;

    input {
        border: none;
        outline: none;
        font-size: 14px;
        padding: 10px 0;
        width: 100%;
        border-bottom: 1px solid ${Colors.lineColor};
        font-family: "Epilogue-Regular";

        &::placeholder {
            color: ${Colors.textGray};
        }
    }
`;
