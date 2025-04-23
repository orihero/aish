import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";

type Props = {
    title: string;
};

const MessageBox: FC<Props> = ({ title }) => {
    return (
        <Container>
            <Text textSize="sixteen" color={Colors.textBlack} text={title} />
        </Container>
    );
};

export default observer(MessageBox);

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 50px 0;
`;
