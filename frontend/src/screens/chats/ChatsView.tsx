import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ChatList from "../../components/Chat/ChatLists/ChatLists";
import ChatDetail from "../../components/Chat/ChatDetails/ChetDetails";

const ChatsView = () => {
    const { id } = useParams();
    
    console.log("ChatsView: Route parameter id =", id);

    return (
        <ChatsViewContainer>
            <ChatList />
            {id && <ChatDetail chatId={id} />}
        </ChatsViewContainer>
    );
};

export default ChatsView;

const ChatsViewContainer = styled.div`
    display: grid;
    grid-template-columns: 350px auto;
    height: 100vh;
    overflow: hidden;
`;
