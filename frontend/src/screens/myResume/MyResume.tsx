import React, { useRef } from "react";
import styled from "styled-components";
import ExperienceCard from "../../components/ExperienceCard/ExperienceCard";
import UserInfoCard from "../../components/UserInfoCard/UserInfoCard";
import Avatar from "../../components/Avatar/Avatar";
import Text from "../../components/Text/Text";
import { Colors } from "../../shared/utils/color";
import Header from "../../components/Header/Header";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import ButtonComp from "../../components/Button/Button";
import { getDateDifference } from "../../shared/helper/date";
import { WorkType } from "../../types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { toJS } from "mobx";

const MyResume = () => {
    const { resumeStore, visibleStore } = useRootStore();
    const printRef = useRef<null>(null);
    console.log("resume", toJS(resumeStore.myResume));

    const handleDownloadPdf = () => {
        const element = printRef.current;

        domtoimage
            .toPng(element as never)
            .then((dataUrl) => {
                const pdf = new jsPDF("p", "mm", "a4");
                const img = new Image();
                img.src = dataUrl;
                img.onload = function () {
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (img.height * pdfWidth) / img.width;
                    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
                    pdf.save("resume.pdf");
                };
            })
            .catch((error) => {
                console.error("dom-to-image error", error);
            });
    };

    return (
        <MyResumeContainer>
            <Header />
            <div className="fixedIcons">
                {resumeStore.isEdited && (
                    <ButtonComp
                        title="Save"
                        primary
                        onPress={() => resumeStore.saveResume()}
                    />
                )}
                <div className="iconBtn">
                    <IconComp
                        icon={<DynamicIcon name="download" size={24} />}
                        onClick={handleDownloadPdf}
                    />
                </div>
                <div className="iconBtn">
                    <IconComp
                        icon={
                            <DynamicIcon
                                name={
                                    visibleStore.visible.isResumeEditable
                                        ? "x"
                                        : "edit"
                                }
                                size={24}
                            />
                        }
                        onClick={() =>
                            visibleStore.toglevisible("isResumeEditable")
                        }
                    />
                </div>
            </div>
            <div className="box" ref={printRef}>
                <div className="resumeLeft">
                    <UserInfoCard />
                </div>
                <div className="resumeRight">
                    <div className="jobTitle">
                        <Text
                            text={resumeStore.myResume?.basics?.label || ""}
                            textSize="thirtySix"
                            color={Colors.textBlack}
                            isEditable={visibleStore.visible.isResumeEditable}
                            onChange={(e) =>
                                resumeStore.setBasicsField("label", e)
                            }
                            placeholder="Profession"
                        />
                        <Text
                            text={resumeStore.myResume?.basics?.summary || ""}
                            textSize="fourteen"
                            color={Colors.textGray}
                            family="Epilogue-Regular"
                            isEditable={visibleStore.visible.isResumeEditable}
                            rows={6}
                            onChange={(e) =>
                                resumeStore.setBasicsField("summary", e)
                            }
                            placeholder="Description"
                        />
                    </div>
                    <div className="jobExperience">
                        <Text
                            text="Professional experience"
                            textSize="sixteen"
                            color={Colors.textGray}
                            family="Epilogue-SemiBold"
                        />
                        {resumeStore.myResume?.work?.map((item, index) => {
                            return (
                                <div className="card">
                                    <div>
                                        <ExperienceCard
                                            work={item}
                                            key={index}
                                            index={index}
                                        />

                                        {visibleStore.visible
                                            .isResumeEditable && (
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
                                                            color={
                                                                Colors.tomato
                                                            }
                                                        />
                                                    }
                                                    onClick={() =>
                                                        resumeStore.removeWork(
                                                            index
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {visibleStore.visible.isResumeEditable && (
                            <ButtonComp
                                title="Add experience"
                                onPress={() => resumeStore.addWork()}
                            />
                        )}
                    </div>
                    <div className="education">
                        <Text
                            text="Education"
                            textSize="sixteen"
                            color={Colors.textGray}
                            family="Epilogue-SemiBold"
                        />
                        {resumeStore.myResume?.education?.map((item, index) => {
                            return (
                                <div className="card">
                                    <div className="eductionTitle" key={index}>
                                        <Text
                                            text={item.institution || ""}
                                            textSize="twenty"
                                            color={Colors.textBlack}
                                            isEditable={
                                                visibleStore.visible
                                                    .isResumeEditable
                                            }
                                            onChange={(e) =>
                                                resumeStore.updateEducationField(
                                                    index,
                                                    "institution",
                                                    e
                                                )
                                            }
                                            placeholder="Institution"
                                        />
                                        <Text
                                            text={`${item.area}`}
                                            textSize="sixteen"
                                            color={Colors.mainBlue}
                                            family="Epilogue-Regular"
                                            isEditable={
                                                visibleStore.visible
                                                    .isResumeEditable
                                            }
                                            onChange={(e) =>
                                                resumeStore.updateEducationField(
                                                    index,
                                                    "area",
                                                    e
                                                )
                                            }
                                            placeholder="Direction"
                                        />
                                        {visibleStore.visible
                                            .isResumeEditable ? (
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
                                                        resumeStore.myResume
                                                            ?.education[index]
                                                            .startDate
                                                    }
                                                    textSize="fourteen"
                                                    color={Colors.textBlack}
                                                    placeholder="12-12-2020"
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateEducationField(
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
                                                        resumeStore.myResume
                                                            ?.education[index]
                                                            .endDate
                                                    }
                                                    textSize="fourteen"
                                                    color={Colors.textBlack}
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    placeholder="12-12-2022"
                                                    onChange={(e) =>
                                                        resumeStore.updateEducationField(
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
                                                    item?.startDate,
                                                    item?.endDate
                                                )}`}
                                                textSize="fourteen"
                                                color={Colors.textGray}
                                                isEditable={
                                                    visibleStore.visible
                                                        .isResumeEditable
                                                }
                                            />
                                        )}
                                        <Text
                                            text={item.studyType || ""}
                                            textSize="fourteen"
                                            color={Colors.textGray}
                                            family="Epilogue-Regular"
                                            isEditable={
                                                visibleStore.visible
                                                    .isResumeEditable
                                            }
                                            onChange={(e) =>
                                                resumeStore.updateEducationField(
                                                    index,
                                                    "studyType",
                                                    e
                                                )
                                            }
                                            placeholder="Academic dagree"
                                        />
                                        <div className="row">
                                            <Text
                                                text="GPA:"
                                                textSize="fourteen"
                                                color={Colors.textGray}
                                                family="Epilogue-Regular"
                                            />
                                            <Text
                                                text={item.gpa || ""}
                                                textSize="fourteen"
                                                color={Colors.textGray}
                                                family="Epilogue-Regular"
                                                isEditable={
                                                    visibleStore.visible
                                                        .isResumeEditable
                                                }
                                                onChange={(e) =>
                                                    resumeStore.updateEducationField(
                                                        index,
                                                        "gpa",
                                                        e
                                                    )
                                                }
                                                inputWidth={50}
                                                placeholder="4.1"
                                            />
                                        </div>
                                        <div className="row">
                                            {item.courses?.map((item, cI) => {
                                                return (
                                                    <div className="row">
                                                        <Text
                                                            key={cI}
                                                            text={item || ""}
                                                            textSize="fourteen"
                                                            color={
                                                                Colors.textGray
                                                            }
                                                            family="Epilogue-Regular"
                                                            isEditable={
                                                                visibleStore
                                                                    .visible
                                                                    .isResumeEditable
                                                            }
                                                            onChange={(e) =>
                                                                resumeStore.updateEduCourse(
                                                                    index,
                                                                    cI,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Subject"
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
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                }
                                                                onClick={() =>
                                                                    resumeStore.removeEduCourse(
                                                                        index ||
                                                                            0,
                                                                        cI
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {visibleStore.visible
                                                .isResumeEditable && (
                                                <IconComp
                                                    icon={
                                                        <DynamicIcon
                                                            name="plus-circle"
                                                            color={Colors.green}
                                                        />
                                                    }
                                                    onClick={() =>
                                                        resumeStore.addEduCourse(
                                                            index || 0
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
                                                justifyContent: "flex-end",
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
                                                    resumeStore.removeEducation(
                                                        index
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {visibleStore.visible.isResumeEditable && (
                        <ButtonComp
                            title="Add education"
                            onPress={() => resumeStore.addEducation()}
                        />
                    )}
                    <div className="education">
                        <Text
                            text="Certification"
                            textSize="sixteen"
                            color={Colors.textGray}
                            family="Epilogue-SemiBold"
                        />
                        <div className="card">
                            {resumeStore.myResume?.certifications?.map(
                                (item, index) => {
                                    return (
                                        <div>
                                            <div
                                                className="eductionTitle"
                                                key={index}
                                            >
                                                <Text
                                                    text={item.name || ""}
                                                    textSize="twenty"
                                                    color={Colors.textBlack}
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateCertificationField(
                                                            index,
                                                            "name",
                                                            e
                                                        )
                                                    }
                                                    placeholder="Certificate title"
                                                />
                                                <Text
                                                    text={`${item.issuer}`}
                                                    textSize="fourteen"
                                                    color={Colors.mainBlue}
                                                    family="Epilogue-Regular"
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateCertificationField(
                                                            index,
                                                            "issuer",
                                                            e
                                                        )
                                                    }
                                                    placeholder="Issuer"
                                                />

                                                <Text
                                                    text={item.date || ""}
                                                    textSize="fourteen"
                                                    color={Colors.textGray}
                                                    family="Epilogue-Regular"
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateCertificationField(
                                                            index,
                                                            "date",
                                                            e
                                                        )
                                                    }
                                                    placeholder="2023-05-10"
                                                />
                                            </div>
                                            {visibleStore.visible
                                                .isResumeEditable && (
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
                                                                color={
                                                                    Colors.tomato
                                                                }
                                                            />
                                                        }
                                                        onClick={() =>
                                                            resumeStore.removeCertification(
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                    {visibleStore.visible.isResumeEditable && (
                        <ButtonComp
                            title="Add certificate"
                            onPress={() => resumeStore.addCertification()}
                        />
                    )}
                    <div className="education">
                        <Text
                            text="Awards"
                            textSize="sixteen"
                            color={Colors.textGray}
                            family="Epilogue-SemiBold"
                        />
                        <div className="card">
                            {resumeStore.myResume?.awards?.map(
                                (item, index) => {
                                    return (
                                        <div>
                                            <div
                                                className="eductionTitle"
                                                key={index}
                                            >
                                                <Text
                                                    text={item.title || ""}
                                                    textSize="twenty"
                                                    color={Colors.textBlack}
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateAwardField(
                                                            index,
                                                            "title",
                                                            e
                                                        )
                                                    }
                                                    placeholder="Award title"
                                                />
                                                <Text
                                                    text={`${item.awarder}`}
                                                    textSize="fourteen"
                                                    color={Colors.mainBlue}
                                                    family="Epilogue-Regular"
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateAwardField(
                                                            index,
                                                            "awarder",
                                                            e
                                                        )
                                                    }
                                                    placeholder="Awarder name"
                                                />
                                                <Text
                                                    text={item.summary || ""}
                                                    textSize="fourteen"
                                                    color={Colors.textGray}
                                                    family="Epilogue-Regular"
                                                    isEditable={
                                                        visibleStore.visible
                                                            .isResumeEditable
                                                    }
                                                    onChange={(e) =>
                                                        resumeStore.updateAwardField(
                                                            index,
                                                            "summary",
                                                            e
                                                        )
                                                    }
                                                    placeholder="Award description"
                                                />
                                            </div>
                                            {visibleStore.visible
                                                .isResumeEditable && (
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
                                                                color={
                                                                    Colors.tomato
                                                                }
                                                            />
                                                        }
                                                        onClick={() =>
                                                            resumeStore.removeAward(
                                                                index
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                    {visibleStore.visible.isResumeEditable && (
                        <ButtonComp
                            title="Add award"
                            onPress={() => resumeStore.addAward()}
                        />
                    )}
                    <div className="aboutMe">
                        <Text
                            text="About me"
                            textSize="sixteen"
                            color={Colors.textGray}
                            family="Epilogue-SemiBold"
                        />
                        <div className="card">
                            <Text
                                text="Software Engineer with experience in developing web applications, microservices, and distributed systems participating in the complete product development lifecycle of successfully launched applications. An empathetic team player and mentor."
                                textSize="fourteen"
                                color={Colors.textGray}
                                family="Epilogue-Regular"
                                isEditable={
                                    visibleStore.visible.isResumeEditable
                                }
                                rows={6}
                                placeholder="About yourself"
                                // onChange={(e) =>
                                //     resumeStore.setBasicsField("", e)
                                // }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MyResumeContainer>
    );
};

export default observer(MyResume);

const MyResumeContainer = styled.div`
    .box {
        display: grid;
        grid-template-columns: 300px auto;
        gap: 20px;
        /* background-color: ${Colors.light}; */
        margin-top: 16vh;
        /* padding: 0 20px; */
        position: relative;
    }

    .fixedIcons {
        position: fixed;
        right: 20px;
        top: 11vh;
        display: flex;
        gap: 10px;
        z-index: 12;
    }

    .iconBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${Colors.lineColor};
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .resumeLeft {
        border-right: 1.5px solid ${Colors.light};
    }

    .resumeRight {
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding: 30px;
    }
    .card {
        background-color: ${Colors.light};
        padding: 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }
    .jobTitle {
        display: flex;
        flex-direction: column;
        gap: 5px;
        background-color: ${Colors.light};
        padding: 20px;
        border-radius: 10px;
    }
    .jobExperience {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    .education {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .eductionTitle {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
    .aboutMe {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .line {
        width: 100%;
        height: 3px;
        background-color: ${Colors.lineColor};
        margin: 10px 0;
    }
`;
