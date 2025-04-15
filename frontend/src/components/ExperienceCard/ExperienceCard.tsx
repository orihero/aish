import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { DynamicIcon } from "lucide-react/dynamic";
import useRootStore from "../../shared/hooks/UseRootStore";
import IconComp from "../../shared/constants/iconBtn";
import { WorkType } from "../../types";
import { getDateDifference } from "../../shared/helper/date";
import { observer } from "mobx-react-lite";

type Props = {
    work?: WorkType;
    index: number;
};

const ExperienceCard: FC<Props> = ({ work, index }) => {
    const { resumeStore, visibleStore } = useRootStore();

    return (
        <ExperienceCardContainer>
            <div className="nameBox">
                <Text
                    text={work?.position || ""}
                    textSize="twenty"
                    color={Colors.textBlack}
                    placeholder="Position"
                    isEditable={visibleStore.visible.isResumeEditable}
                    onChange={(e) =>
                        resumeStore.updateWorkField(index, "position", e)
                    }
                />
                <Text
                    text={work?.name || ""}
                    textSize="fourteen"
                    color={Colors.textColor}
                    isEditable={visibleStore.visible.isResumeEditable}
                    placeholder="Company"
                    textAlign={"end"}
                    onChange={(e) =>
                        resumeStore.updateWorkField(index, "name", e)
                    }
                />
            </div>
            <div className="description">
                <div>
                    {visibleStore.visible.isResumeEditable ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <Text
                                text={"Start date"}
                                textSize="fourteen"
                                color={Colors.textBlack}
                            />
                            <Text
                                text={
                                    resumeStore.myResume?.work?.[index]
                                        .startDate
                                }
                                textSize="fourteen"
                                color={Colors.textBlack}
                                placeholder="12-12-2020"
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                onChange={(e) =>
                                    resumeStore.updateWorkField(
                                        index,
                                        "startDate",
                                        e
                                    )
                                }
                            />
                            <Text
                                text={"End date"}
                                textSize="fourteen"
                                color={Colors.textBlack}
                            />
                            <Text
                                text={
                                    resumeStore.myResume.work?.[index].endDate
                                }
                                textSize="fourteen"
                                color={Colors.textBlack}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                placeholder="12-12-2022"
                                onChange={(e) =>
                                    resumeStore.updateWorkField(
                                        index,
                                        "endDate",
                                        e
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <Text
                            text={`${getDateDifference(
                                work?.startDate,
                                work?.endDate
                            )}`}
                            textSize="fourteen"
                            color={Colors.mainBlue}
                            isEditable={visibleStore.visible.isResumeEditable}
                        />
                    )}
                </div>
                <Text
                    text={work?.summary || ""}
                    textSize="fourteen"
                    color={Colors.textGray}
                    family="Epilogue-Regular"
                    placeholder="About the work done"
                    isEditable={visibleStore.visible.isResumeEditable}
                    onChange={(e) =>
                        resumeStore.updateWorkField(index, "summary", e)
                    }
                    rows={4}
                />
            </div>
            <div className="highlights">
                {work?.highlights?.map((item, i) => {
                    return (
                        <div className="highlight" key={i}>
                            <Text
                                text={item || ""}
                                textSize="fourteen"
                                color={Colors.textBlack}
                                inputWidth={80}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                placeholder="Langugae"
                                onChange={(e) =>
                                    resumeStore.updateWorkHighlight(index, i, e)
                                }
                                isTag
                            />

                            {visibleStore.visible.isResumeEditable && (
                                <IconComp
                                    icon={
                                        <DynamicIcon
                                            name="x-circle"
                                            color={Colors.tomato}
                                            size={20}
                                        />
                                    }
                                    onClick={() =>
                                        resumeStore.removeWorkHighlight(
                                            index || 0,
                                            i
                                        )
                                    }
                                />
                            )}
                        </div>
                    );
                })}
                {visibleStore.visible.isResumeEditable && (
                    <IconComp
                        icon={
                            <DynamicIcon
                                name="plus-circle"
                                color={Colors.green}
                            />
                        }
                        onClick={() => resumeStore.addWorkHighlight(index || 0)}
                    />
                )}
            </div>
        </ExperienceCardContainer>
    );
};

export default observer(ExperienceCard);

const ExperienceCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;

    .nameBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .description {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .highlights {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .highlight {
        display: flex;
        align-items: center;
        gap: 5px;
    }
`;
