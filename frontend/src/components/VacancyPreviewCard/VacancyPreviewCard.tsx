// FrontendInternCard.js
import React, { FC, useCallback, useEffect } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { VacancyType } from "../../types";
import { observer } from "mobx-react-lite";
import ButtonComp from "../Button/Button";
import ShortInfoJobCard from "../ShortInfoJobCard/ShortInfoJobCard";
import { useNavigate } from "react-router-dom";
import useRootStore from "../../shared/hooks/UseRootStore";
import { DynamicIcon } from "lucide-react/dynamic";
import IconComp from "../../shared/constants/iconBtn";
import { Tag } from "../Tag/Tag";
import Avatar from "../Avatar/Avatar";

type Props = {
    vacancy: VacancyType;
};

const FrontendInternCard: FC<Props> = ({ vacancy }) => {
    const { vacanciesStore, visibleStore } = useRootStore();
    const navigation = useNavigate();
    const path = window.location.pathname;

    useEffect(() => {
        const pathArray = path.split("/");
        const id = pathArray[pathArray.length - 1];
        if (id) {
            vacanciesStore.getVacancyById(id);
        }
        window.scrollTo(0, 0);
    }, [path, vacanciesStore]);

    const handleGetVacancy = useCallback(
        (id: string) => {
            navigation(`/vacancy/${id}`);
            vacanciesStore.findVacancyById(id, "findJobs", () =>
                vacanciesStore.getVacancyById(id)
            );
        },
        [navigation, vacanciesStore]
    );

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies?.vacancies
            .slice(0, 5)
            ?.map((job, index) => {
                return (
                    <ShortInfoJobCard
                        isborder
                        key={index}
                        vacancy={job}
                        onPress={() => handleGetVacancy(job._id)}
                    />
                );
            });
    }, [handleGetVacancy, vacanciesStore.vacancies?.vacancies]);

    return (
        <Container>
            <div className="info-card">
                <div className="work-info">
                    <Text
                        text={vacancy?.title}
                        textSize="twentyEight"
                        color="#000"
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text={`The salary: ${vacancy?.salary?.min}-${vacancy?.salary?.max} ${vacancy?.salary?.currency}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <div className="item">
                        <Text
                            text={`Work Experience:`}
                            textSize="sixteen"
                            color={Colors.textBlack}
                        />
                        <Tag text={`not required`} />
                    </div>
                    <div className="item">
                        <Text
                            text={`Employment:`}
                            textSize="sixteen"
                            color={Colors.textBlack}
                        />
                        <Tag text={`${vacancy?.employmentType}`} />
                    </div>
                    <div className="item">
                        <Text
                            text={`Work format:`}
                            textSize="sixteen"
                            color={Colors.textBlack}
                        />
                        <Tag text={`${vacancy?.workType}`} />
                    </div>
                    <div className="item">
                        <Text
                            text="Category:"
                            textSize="sixteen"
                            color={Colors.textBlack}
                        />
                        <Tag
                            text={`${
                                vacancy?.category?.title.find(
                                    (item) =>
                                        item.language ===
                                        visibleStore.currentLang
                                )?.value
                            }`}
                        />
                    </div>
                    <div className="applyBox">
                        <ButtonComp
                            title="Apply"
                            onPress={() => visibleStore.show("applyModal")}
                            primary
                            className="apply"
                        />
                        <div className="views">
                            <div className="viewsCount">
                                <Text
                                    text={`${vacancy.views}`}
                                    textSize="sixteen"
                                    family="Epilogue-Regular"
                                    color={Colors.textGray}
                                    paddingTop="3px"
                                />
                                <DynamicIcon
                                    name={"file-check"}
                                    size={18}
                                    color={Colors.textGray}
                                />
                            </div>
                            <div className="viewsCount">
                                <Text
                                    text={`${vacancy.views}`}
                                    textSize="sixteen"
                                    family="Epilogue-Regular"
                                    color={Colors.textGray}
                                    paddingTop="3px"
                                />
                                <DynamicIcon
                                    name={"eye"}
                                    size={20}
                                    color={Colors.textGray}
                                />
                            </div>
                            <IconComp
                                icon={
                                    <DynamicIcon
                                        name={"heart"}
                                        size={24}
                                        color={Colors.textGray}
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="company">
                    <div className="companyInfo">
                        <div className="logo">
                            <Avatar imageUrl={vacancy?.company?.logo} />
                        </div>
                        <div>
                            <Text
                                text={`${vacancy?.company?.name}`}
                                textSize="eighteen"
                                color={Colors.textBlack}
                            />
                            <Text
                                text={`${vacancy?.company?.location.address} ${vacancy?.company?.location.city} ${vacancy?.company?.location.country}`}
                                textSize="twelve"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                                margin="5px 0 0 0"
                            />
                        </div>
                    </div>
                    <div className="companyDes">
                        {vacancy?.company?.benefits && (
                            <Text
                                text={`${vacancy?.company?.benefits?.join(
                                    ", "
                                )}`}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                family="Epilogue-Regular"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="extra-info">
                <Text
                    text={vacancy?.description}
                    textSize="sixteen"
                    color={Colors.textBlack}
                />
            </div>
            <div className="other-vacancies">
                <Text
                    text="These vacancies are suitable for you"
                    textSize="twenty"
                    color={Colors.textBlack}
                />
                <div className="other-vacancies-cards">{renderJobs()}</div>
            </div>
        </Container>
    );
};

export default observer(FrontendInternCard);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;

    .info-card {
        display: flex;
        gap: 50px;
    }

    .work-info {
        display: flex;
        flex-direction: column;
        padding: 20px;
        gap: 10px;
        border: 1px solid ${Colors.lineColor};
        border-radius: 16px;
        width: 55%;
    }

    .item {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .company {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 40%;
    }

    .companyInfo {
        display: flex;
        border: 1px solid ${Colors.lineColor};
        border-radius: 16px;
        padding: 20px;
        gap: 10px;
    }

    .extra-info {
        width: 50%;
        padding: 20px 0;
    }

    .apply {
        display: flex;
        justify-content: center;
        width: 200px;
        border-radius: 10px;
    }

    .companyInfo {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .other-vacancies {
        display: flex;
        flex-direction: column;
        width: 55%;
        margin-top: 50px;
        gap: 20px;
    }

    .other-vacancies-cards {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
        z-index: 1;
    }

    .applyBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
    }

    .views {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .viewsCount {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    @media (max-width: 768px) {
        .other-vacancies {
            width: 100%;
        }

        .info-card {
            flex-direction: column;
            gap: 20px;
        }
        .work-info {
            width: 100%;
        }
        .company {
            width: 100%;
        }
        .extra-info {
            width: 100%;
        }
        .apply {
            width: 100%;
        }

        .companyInfo {
            gap: 10px;
        }
    }
`;
