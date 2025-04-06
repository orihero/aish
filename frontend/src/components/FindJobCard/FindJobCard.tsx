import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { VacancyType } from "../../types";
import { observer } from "mobx-react-lite";
import { DynamicIcon } from "lucide-react/dynamic";
import { Colors } from "../../shared/utils/color";
import { Tag } from "../Tag/Tag";
import ButtonComp from "../Button/Button";

type Props = {
    vacancy: VacancyType;
};

const FindJobCard: FC<Props> = ({ vacancy }) => {
    return (
        <Container>
            <div className="titleBox">
                <Text
                    text={vacancy.title}
                    color={Colors.textBlack}
                    textSize="twenty"
                />
                <div>
                    <DynamicIcon name={"heart"} size={24} />
                </div>
            </div>
            <div className="tags">
                <Tag text={vacancy.workType} />
                <Tag text={vacancy.employmentType} />
            </div>
            <div className="info">
                <Text
                    text={`${vacancy.creator.firstName} ${vacancy.creator.lastName}`}
                    color={Colors.textGray}
                    textSize="fourteen"
                />
                <Text
                    text={`Salary: ${vacancy.salary.min}-${vacancy.salary.max} ${vacancy.salary.currency}`}
                    color={Colors.textBlack}
                    textSize="eighteen"
                />
            </div>
            <ButtonComp title="Respond" primary className="respond" />
        </Container>
    );
};

export default observer(FindJobCard);

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid ${Colors.lineColor};
    padding: 20px;
    border-radius: 16px;

    .titleBox {
        display: flex;
        justify-content: space-between;
    }
    .info {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .tags {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .respond {
        display: flex;
        justify-content: center;
        width: 150px;
        border-radius: 10px;
    }
`;
