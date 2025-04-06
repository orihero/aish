// FrontendInternCard.js
import React, { FC, useCallback, useEffect } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { VacancyType } from "../../types";
import { observer } from "mobx-react-lite";
import ButtonComp from "../Button/Button";
import { toJS } from "mobx";
import ShortInfoJobCard from "../ShortInfoJobCard/ShortInfoJobCard";
import { useNavigate } from "react-router-dom";
import useRootStore from "../../shared/hooks/UseRootStore";

type Props = {
    vacancy: VacancyType;
};

const FrontendInternCard: FC<Props> = ({ vacancy }) => {
    console.log("vacancy", toJS(vacancy));
    const { vacanciesStore } = useRootStore();
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

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies?.vacancies
            .slice(0, 5)
            ?.map((job, index) => {
                return (
                    <ShortInfoJobCard
                        isborder
                        key={index}
                        title={job.title}
                        creator={job.creator}
                        company={job.company}
                        category={job.category}
                        subcategory={job.subcategory}
                        salary={job.salary}
                        employmentType={job.employmentType}
                        workType={job.workType}
                        isFeatured={job.isFeatured}
                        views={job.views}
                        timestamps={job.timestamps}
                        description={job.description}
                        onPress={() =>
                            vacanciesStore.getVacancyById(job._id, () =>
                                navigation(`/vacancy/${job._id}`)
                            )
                        }
                    />
                );
            });
    }, [navigation, vacanciesStore]);

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
                    <Text
                        text={`Work Experience: not required`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={`Employment: ${vacancy?.employmentType}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={`Work format: ${vacancy?.workType}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={`Category: ${vacancy?.category?.title.map(
                            (item) => item.value
                        )}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    {/* <Text
                        text={`Published: ${vacancy?.createdAt.toString()}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    /> */}
                    <Text
                        text={`Views: ${vacancy?.views}`}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <ButtonComp
                        title="Apply"
                        onPress={() => {}}
                        primary
                        className="apply"
                    />
                </div>
                <div className="company">
                    <div className="companyInfo">
                        <div className="logo"></div>
                        <Text
                            text={`${vacancy?.creator?.firstName} ${vacancy?.creator?.lastName}`}
                            textSize="sixteen"
                            color={Colors.textBlack}
                        />
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

    .company {
        display: flex;
        height: 100px;
        width: 40%;
        padding: 20px;
        gap: 10px;
        border: 1px solid ${Colors.lineColor};
        border-radius: 16px;
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
        margin-top: 20px;
    }

    .companyInfo {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .logo {
        width: 60px;
        height: 60px;
        background-color: ${Colors.mainBlue};
        border-radius: 50%;
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
        .logo {
            width: 50px;
            height: 50px;
        }
        .companyInfo {
            gap: 10px;
        }
    }
`;
