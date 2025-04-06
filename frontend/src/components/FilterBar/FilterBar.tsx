import React from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";

const FilterBar = () => {
    return (
        <FilterBarContainer>
            <div className="body">
                <Text
                    text="Filter"
                    textSize="eighteen"
                    color={Colors.textBlack}
                />

                <Text
                    text="Categories"
                    textSize="fourteen"
                    color={Colors.textBlack}
                />
            </div>
        </FilterBarContainer>
    );
};

export default FilterBar;

const FilterBarContainer = styled.div`
    .body {
        display: flex;
        flex-direction: column;
        background-color: ${Colors.white};
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        padding: 20px;
    }
`;
