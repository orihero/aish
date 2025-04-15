import React from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { DynamicIcon } from "lucide-react/dynamic";
import { Tag } from "../Tag/Tag";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import IconComp from "../../shared/constants/iconBtn";
import { toJS } from "mobx";

const UserInfoCard = () => {
    const { resumeStore, visibleStore } = useRootStore();

    return (
        <UserInfoCardContainer>
            <div>
                <img
                    src="https://career.comarch.com/files-com/file_45/good_programmer_comarch.jpg"
                    alt="useAvatar"
                    className="useAvatar"
                    // crossOrigin="anonymous"
                />
            </div>
            <div className="name">
                <Text
                    text={resumeStore.myResume?.basics?.name || ""}
                    textSize="twenty"
                    color={Colors.textBlack}
                    family="Epilogue-SemiBold"
                    isEditable={visibleStore.visible.isResumeEditable}
                    textAlign={"center"}
                    onChange={(e) => resumeStore.setBasicsField("name", e)}
                    placeholder="Name"
                />
                <Text
                    text={resumeStore.myResume?.basics?.phone || ""}
                    textSize="fourteen"
                    color={Colors.textGray}
                    isEditable={visibleStore.visible.isResumeEditable}
                    textAlign={"center"}
                    onChange={(e) => resumeStore.setBasicsField("phone", e)}
                    placeholder="Phone number"
                />
                <Text
                    text={resumeStore.myResume?.basics?.email || ""}
                    textSize="fourteen"
                    color={Colors.textGray}
                    isEditable={visibleStore.visible.isResumeEditable}
                    textAlign={"center"}
                    onChange={(e) => resumeStore.setBasicsField("email", e)}
                    placeholder="Email"
                />
                <Text
                    text={
                        `${resumeStore.myResume?.basics?.location?.region}` ||
                        ""
                    }
                    textSize="fourteen"
                    color={Colors.textGray}
                    isEditable={visibleStore.visible.isResumeEditable}
                    textAlign={"center"}
                    onChange={(e) =>
                        resumeStore.setBasicsField("location", {
                            ...resumeStore.myResume?.basics?.location,
                            region: e,
                        })
                    }
                />
                <Text
                    text={
                        `${resumeStore.myResume?.basics?.location?.address}` ||
                        ""
                    }
                    textSize="fourteen"
                    color={Colors.textGray}
                    isEditable={visibleStore.visible.isResumeEditable}
                    textAlign={"center"}
                    rows={2}
                    onChange={(e) =>
                        resumeStore.setBasicsField("location", {
                            ...resumeStore.myResume?.basics?.location,
                            address: e,
                        })
                    }
                />
            </div>
            <div className="profiles">
                {resumeStore.myResume?.basics?.profiles?.map((item, index) => {
                    return (
                        <div className="profile">
                            <Text
                                text={item.network || ""}
                                textSize="fourteen"
                                color={Colors.textBlack}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                onChange={(e) =>
                                    resumeStore.editProfile(index, {
                                        network: e,
                                        url: item.url,
                                        username: item.username,
                                    })
                                }
                            />
                            <Text
                                text={item.username || ""}
                                textSize="fourteen"
                                color={Colors.textBlack}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                textAlign={"end"}
                                onChange={(e) =>
                                    resumeStore.editProfile(index, {
                                        network: item.network,
                                        url: item.url,
                                        username: e,
                                    })
                                }
                            />
                        </div>
                    );
                })}
            </div>
            <div className="skillRateBox">
                <div className="skillRate">
                    <div className="comunitySkill">
                        <Text
                            text="Comunity skill"
                            textSize="fourteen"
                            color={Colors.textBlack}
                        />
                        <Text
                            text="7/10"
                            textSize="fourteen"
                            color={Colors.textBlack}
                            isEditable={visibleStore.visible.isResumeEditable}
                            textAlign={"end"}
                            inputWidth={50}
                        />
                    </div>
                    <div className="skillLine">
                        <div
                            className="lineWidth"
                            style={{ width: "70%" }}
                        ></div>
                    </div>
                </div>
                <div className="skillRate">
                    <div className="comunitySkill">
                        <Text
                            text="Technical skill"
                            textSize="fourteen"
                            color={Colors.textBlack}
                        />
                        <Text
                            text="9/10"
                            textSize="fourteen"
                            color={Colors.textBlack}
                            isEditable={visibleStore.visible.isResumeEditable}
                            textAlign={"end"}
                            inputWidth={50}
                        />
                    </div>
                    <div className="skillLine">
                        <div
                            className="lineWidth"
                            style={{ width: "90%" }}
                        ></div>
                    </div>
                </div>
            </div>
            <Text
                text="Skills"
                textSize="sixteen"
                color={Colors.textGray}
                family="Epilogue-SemiBold"
            />
            <div className="allSkills">
                {resumeStore.myResume?.skills?.map((item, index) => {
                    return (
                        <div>
                            <div key={index} className="skill">
                                <div className="rows">
                                    <Text
                                        text={item.name || ""}
                                        textSize="sixteen"
                                        color={Colors.textBlack}
                                        isEditable={
                                            visibleStore.visible
                                                .isResumeEditable
                                        }
                                        placeholder="Direction"
                                        onChange={(e) =>
                                            resumeStore.updateSkill(
                                                index,
                                                "name",
                                                e
                                            )
                                        }
                                    />
                                    <Text
                                        text={item.level || ""}
                                        textSize="fourteen"
                                        color={Colors.textGray}
                                        isEditable={
                                            visibleStore.visible
                                                .isResumeEditable
                                        }
                                        placeholder="Level"
                                        textAlign={"end"}
                                        onChange={(e) =>
                                            resumeStore.updateSkill(
                                                index,
                                                "level",
                                                e
                                            )
                                        }
                                    />
                                </div>
                                <div className="skillKeywords">
                                    {item.keywords?.map((item, i) => {
                                        return (
                                            <div className="row">
                                                <Text
                                                    text={item || ""}
                                                    textSize="fourteen"
                                                    color={Colors.textBlack}
                                                    inputWidth={80}
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    placeholder="Language"
                                                    onChange={(e) =>
                                                        resumeStore.updateSkillKeyword(
                                                            index,
                                                            i,
                                                            e
                                                        )
                                                    }
                                                    isTag
                                                />
                                                {visibleStore.visible
                                                    .isResumeEditable && (
                                                    <IconComp
                                                        icon={
                                                            <DynamicIcon
                                                                name="x-circle"
                                                                color={
                                                                    Colors.tomato
                                                                }
                                                            />
                                                        }
                                                        onClick={() =>
                                                            resumeStore.removeSkillKeyword(
                                                                index,
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
                                            onClick={() =>
                                                resumeStore.addSkillKeyword(
                                                    index
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {visibleStore.visible.isResumeEditable && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifySelf: "flex-end",
                                        paddingTop: "10px",
                                    }}
                                >
                                    <IconComp
                                        icon={
                                            <DynamicIcon
                                                name="x-circle"
                                                color={Colors.tomato}
                                            />
                                        }
                                        onClick={() =>
                                            resumeStore.removeSkill(index)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {visibleStore.visible.isResumeEditable && (
                <IconComp
                    icon={
                        <DynamicIcon name="plus-circle" color={Colors.green} />
                    }
                    onClick={() => resumeStore.addSkill()}
                />
            )}
            <Text
                text="Languages"
                textSize="sixteen"
                color={Colors.textGray}
                family="Epilogue-SemiBold"
            />
            <div className="lanuages">
                {resumeStore.myResume?.languages?.map((item, index) => {
                    return (
                        <div className="language" key={index}>
                            <Text
                                text={item.language || ""}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                placeholder="Language"
                                onChange={(e) =>
                                    resumeStore.updateLanguage(
                                        index,
                                        "language",
                                        e
                                    )
                                }
                            />
                            <Text
                                text={item.fluency || ""}
                                textSize="fourteen"
                                color={Colors.textGray}
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                placeholder="Fluency"
                                onChange={(e) =>
                                    resumeStore.updateLanguage(
                                        index,
                                        "fluency",
                                        e
                                    )
                                }
                            />
                            {visibleStore.visible.isResumeEditable && (
                                <IconComp
                                    icon={
                                        <DynamicIcon
                                            name="x-circle"
                                            color={Colors.tomato}
                                        />
                                    }
                                    onClick={() =>
                                        resumeStore.removeLanguage(index)
                                    }
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {visibleStore.visible.isResumeEditable && (
                <IconComp
                    icon={
                        <DynamicIcon name="plus-circle" color={Colors.green} />
                    }
                    onClick={() => resumeStore.addLanguage()}
                />
            )}
            <Text
                text="Interests"
                textSize="sixteen"
                color={Colors.textGray}
                family="Epilogue-SemiBold"
            />
            <div className="interests">
                {resumeStore.myResume?.interests?.map((item, index) => {
                    return (
                        <div>
                            <div key={index} className="interest">
                                <Text
                                    text={item.name || ""}
                                    textSize="sixteen"
                                    color={Colors.textGray}
                                    isEditable={
                                        visibleStore.visible.isResumeEditable
                                    }
                                    onChange={(e) =>
                                        resumeStore.updateInterest(
                                            index,
                                            "name",
                                            e
                                        )
                                    }
                                    placeholder="Direction"
                                />

                                <div className="interestKeywords">
                                    {item.keywords?.map((item, i) => {
                                        return (
                                            <div className="row">
                                                <Text
                                                    text={item || ""}
                                                    textSize="fourteen"
                                                    color={Colors.textBlack}
                                                    inputWidth={80}
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    placeholder="Language"
                                                    onChange={(e) =>
                                                        resumeStore.updateInterestKeyword(
                                                            index,
                                                            i,
                                                            e
                                                        )
                                                    }
                                                    isTag
                                                />
                                                {visibleStore.visible
                                                    .isResumeEditable && (
                                                    <IconComp
                                                        icon={
                                                            <DynamicIcon
                                                                name="x-circle"
                                                                color={
                                                                    Colors.tomato
                                                                }
                                                            />
                                                        }
                                                        onClick={() =>
                                                            resumeStore.removeInterestKeyword(
                                                                index,
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
                                            onClick={() =>
                                                resumeStore.addInterestKeyword(
                                                    index
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifySelf: "flex-end",
                                    paddingTop: "10px",
                                }}
                            >
                                {visibleStore.visible.isResumeEditable && (
                                    <IconComp
                                        icon={
                                            <DynamicIcon
                                                name="x-circle"
                                                color={Colors.tomato}
                                            />
                                        }
                                        onClick={() =>
                                            resumeStore.removeInterest(index)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {visibleStore.visible.isResumeEditable && (
                <IconComp
                    icon={
                        <DynamicIcon name="plus-circle" color={Colors.green} />
                    }
                    onClick={resumeStore.addInterest}
                />
            )}
        </UserInfoCardContainer>
    );
};

export default observer(UserInfoCard);

const UserInfoCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 20px;

    .useAvatar {
        width: 140px;
        height: 160px;
        border-radius: 60px;
    }
    .name {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .rows {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .profiles {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .skillRateBox {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
    }

    .skillRate {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
    }

    .skillLine {
        width: 100%;
        height: 5px;
        background-color: ${Colors.lineColor};
        border-radius: 3px;
        overflow: hidden;
    }

    .lineWidth {
        height: 100%;
        border-radius: 3px;
        background-color: ${Colors.mainBlue};
    }

    .comunitySkill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .skills {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .allSkills {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    }

    .skill {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .skillKeywords {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .interests {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    }

    .interest {
        display: flex;
        flex-direction: column;
        /* align-items: center; */
        gap: 10px;
    }
    .interestKeywords {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .lanuages {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .language {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
    }
`;
