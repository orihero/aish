import { makeAutoObservable, reaction, runInAction, toJS } from "mobx";
// import i18n from "../../translations";
import APIs from "../../api/api";
import {
    defaultResumeState,
    FullResumeType,
    InterestType,
    LanguageType,
    ResumeType,
    SkillType,
    User,
} from "../../../types";
import _ from "lodash";
import { AppRootStore } from "../store";

export class ResumeStore {
    private readonly rootStore: AppRootStore;
    resumeFormData: FormData = new FormData();
    fileName: string = "";

    myResume: ResumeType = defaultResumeState as ResumeType;
    myResumeClone: ResumeType = defaultResumeState as ResumeType;
    isEdited: boolean = false;
    myResumeId: string = "";
    isHasResume: boolean = true;

    registerData: User = {} as User;

    loadings: {
        isCreateResumeLoading: boolean;
        isUpdateResumeLoading: boolean;
        isGettingMyResumesLoading: boolean;
    } = {
        isCreateResumeLoading: false,
        isUpdateResumeLoading: false,
        isGettingMyResumesLoading: false,
    };

    setLoading = (key: keyof ResumeStore["loadings"]) => {
        this.loadings[key] = !this.loadings[key];
    };

    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
        reaction(
            () => toJS(this.myResume), // Deep track all changes
            (current) => {
                this.isEdited = !_.isEqual(current, this.myResumeClone);
            }
        );
    }
    myResumesState: FullResumeType[] = [] as FullResumeType[];

    setRegisterField = (key: keyof NonNullable<User>, value: any) => {
        runInAction(() => {
            if (!this.registerData) this.registerData = {} as never;
            this.registerData[key] = value;
        });
    };

    registerWithResume = async (callback?: () => void) => {
        try {
            const register = await APIs.auth.registerWithResume(
                this.registerData
            );
            if (!register) return;
            this.rootStore.localStore.setToken({
                accessToken: register.data?.token,
            } as never);
            callback && callback();
        } catch (error) {
            console.log("error", error);
        }
    };

    getResumeMy = async () => {
        try {
            this.setLoading("isGettingMyResumesLoading");
            const resume = await APIs.resumes.getResumeMy();
            if (resume.data) {
                runInAction(() => {
                    this.myResumesState = resume.data as FullResumeType[];
                    this.rootStore.authStore.setUserResume(resume.data);
                    this.rootStore.applicationStore.setSelectedResume(
                        resume.data[0]
                    );
                });
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            this.setLoading("isGettingMyResumesLoading");
        }
    };

    saveResume() {
        const { name, phone, email } = this.myResume.basics;

        if (!name.trim() || !phone.trim() || !email.trim()) {
            alert("Iltimos, ism, telefon va email maydonlarini to‘ldiring.");
            return;
        }

        // Deep copy — clone the resume
        this.myResumeClone = { ...this.myResume };
        alert("Resume muvaffaqiyatli saqlandi!");
    }
    setResume = (file?: File) => {
        if (file) {
            const newFormData = new FormData();
            newFormData.append("cvFile", file);

            runInAction(() => {
                this.fileName = file.name;
                this.resumeFormData = newFormData;
            });
        }
    };

    onCreateResume = async (callback?: () => void) => {
        try {
            this.setLoading("isCreateResumeLoading");
            Array.from(this.resumeFormData.entries()).forEach(
                ([key, value]) => {
                    console.log(key, value);
                }
            );
            const resume = await APIs.resumes.createResume(this.resumeFormData);
            if (resume.data.success) {
                console.log(" resume.data.data", resume.data.data);
                localStorage.setItem("myResumeId", resume.data.data._id);
                runInAction(() => {
                    this.myResume = resume.data.data;
                    this.myResumeClone = resume.data.data;
                    this.registerData = {
                        email: resume.data.data.basics.email,
                        firstName: resume.data.data.basics.name
                            .split(" ")
                            .slice(1, 2)
                            .toString(),
                        lastName: resume.data.data.basics.name
                            .split(" ")
                            .slice(0, 1)
                            .toString(),
                        password: "",
                        confirmPassword: "",
                        resumeData: resume.data.data,
                        resumeFile: {
                            url: resume.data.fileUrl,
                            filename: resume.data.fileName,
                        },
                    };
                });

                callback && callback();
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            this.setLoading("isCreateResumeLoading");
        }
    };

    updateResumeById = async (callback?: () => void) => {
        try {
            this.setLoading("isUpdateResumeLoading");
            const res = await APIs.resumes.createResume(this.resumeFormData);
            console.log("res", toJS(res));
            callback && callback();
        } catch (error) {
            console.log("error", error);
        } finally {
            this.setLoading("isUpdateResumeLoading");
        }
    };

    setBasicsField = (
        key: keyof NonNullable<ResumeType>["basics"],
        value: any
    ) => {
        runInAction(() => {
            if (!this.myResume.basics) this.myResume.basics = {} as never;
            this.myResume.basics[key] = value;
        });
    };

    editProfile = (
        index: number,
        updatedProfile: NonNullable<ResumeType>["basics"]["profiles"][number]
    ) => {
        runInAction(() => {
            const profiles = this.myResume.basics?.profiles;
            if (profiles && profiles[index]) {
                profiles[index] = updatedProfile;
            }
        });
    };

    updateWorkField = (
        index: number,
        key: keyof NonNullable<ResumeType>["work"][number],
        value: any
    ) => {
        runInAction(() => {
            if (!this.myResume?.work) return;
            const workItem = this.myResume.work[index];
            if (workItem) {
                workItem[key] = value;
            }
        });
    };

    // ✅ Work qo‘shish
    addWork = () => {
        runInAction(() => {
            if (!this.myResume.work) this.myResume.work = [];
            this.myResume.work.push({
                endDate: "",
                name: "",
                position: "",
                url: "",
                startDate: "",
                summary: "",
                highlights: [""],
                location: "",
            });
        });
    };

    // ✅ Work o‘chirish
    removeWork = (index: number) => {
        runInAction(() => {
            this.myResume?.work?.splice(index, 1);
        });
    };

    updateWorkHighlight = (
        index: number,
        highlightIndex: number,
        value: string
    ) => {
        runInAction(() => {
            const workItem = this.myResume?.work?.[index];
            if (
                workItem?.highlights &&
                workItem.highlights[highlightIndex] !== undefined
            ) {
                workItem.highlights[highlightIndex] = value;
            }
        });
    };

    // ✅ Work ichidagi highlight qo‘shish
    addWorkHighlight = (workIndex: number) => {
        runInAction(() => {
            const work = this.myResume?.work?.[workIndex];
            if (work) {
                if (!work.highlights) {
                    work.highlights = [];
                }
                work.highlights.push(""); // default qiymat: bo'sh string
            }
        });
    };

    // ✅ Work ichidagi highlight o‘chirish
    removeWorkHighlight = (workIndex: number, highlightIndex: number) => {
        runInAction(() => {
            const work = this.myResume?.work?.[workIndex];
            if (work?.highlights) {
                work.highlights.splice(highlightIndex, 1);
            }
        });
    };

    // ✅ Education qo‘shish
    addEducation = () => {
        runInAction(() => {
            if (!this.myResume.education) {
                this.myResume.education = [];
            }
            this.myResume.education.push({
                institution: "",
                area: "",
                studyType: "",
                startDate: "",
                endDate: "",
                gpa: "",
                url: "",
                courses: [],
            });
        });
    };

    removeEducation = (index: number) => {
        runInAction(() => {
            this.myResume?.education?.splice(index, 1);
        });
    };

    updateEducationField = (
        index: number,
        key: keyof NonNullable<ResumeType>["education"][number],
        value: any
    ) => {
        runInAction(() => {
            const eduItem = this.myResume?.education?.[index];
            if (eduItem) {
                eduItem[key] = value;
            }
        });
    };

    updateEduCourse = (index: number, courseIndex: number, value: string) => {
        runInAction(() => {
            const eduItem = this.myResume?.education?.[index];
            if (
                eduItem?.courses &&
                eduItem.courses[courseIndex] !== undefined
            ) {
                eduItem.courses[courseIndex] = value;
            }
        });
    };

    // ✅ Work ichidagi highlight qo‘shish
    addEduCourse = (educationIndex: number) => {
        runInAction(() => {
            const education = this.myResume?.education?.[educationIndex];
            if (education) {
                if (!education.courses) {
                    education.courses = [];
                }
                education.courses.push(""); // default qiymat: bo'sh string
            }
        });
    };

    // ✅ Work ichidagi highlight o‘chirish
    removeEduCourse = (eduIndex: number, courseIndex: number) => {
        runInAction(() => {
            const education = this.myResume?.education?.[eduIndex];
            if (education?.courses) {
                education.courses.splice(courseIndex, 1);
            }
        });
    };

    // ✅ Certifications
    addCertification = () => {
        runInAction(() => {
            if (!this.myResume.certifications) {
                this.myResume.certifications = [];
            }
            this.myResume.certifications.push({
                name: "",
                date: "",
                issuer: "",
                url: "",
            });
        });
    };

    removeCertification = (index: number) => {
        runInAction(() => {
            this.myResume?.certifications?.splice(index, 1);
        });
    };

    updateCertificationField = (
        index: number,
        key: keyof NonNullable<ResumeType>["certifications"][number],
        value: any
    ) => {
        runInAction(() => {
            const cert = this.myResume?.certifications?.[index];
            if (cert) {
                cert[key] = value;
            }
        });
    };

    addAward = () => {
        runInAction(() => {
            if (!this.myResume.awards) {
                this.myResume.awards = [];
            }
            this.myResume.awards.push({
                title: "",
                date: "",
                awarder: "",
                summary: "",
            });
        });
    };

    removeAward = (index: number) => {
        runInAction(() => {
            this.myResume?.awards?.splice(index, 1);
        });
    };

    updateAwardField = (
        index: number,
        key: keyof NonNullable<ResumeType>["awards"][number],
        value: any
    ) => {
        runInAction(() => {
            const award = this.myResume?.awards?.[index];
            if (award) {
                award[key] = value;
            }
        });
    };

    // ✅ Skills
    // Skill qo'shish (default qiymat bilan)
    addSkill = () => {
        runInAction(() => {
            if (!this.myResume.skills) this.myResume.skills = [];
            this.myResume.skills.push({
                name: "",
                level: "",
                keywords: [""],
            });
        });
    };

    // Skillni index bo'yicha o'chirish

    removeSkill = (index: number) => {
        runInAction(() => {
            this.myResume.skills?.splice(index, 1);
        });
    };

    // Skillni index bo'yicha yangilash
    updateSkill = (index: number, key: keyof SkillType, value: any) => {
        runInAction(() => {
            if (this.myResume.skills && this.myResume.skills[index]) {
                this.myResume.skills[index][key] = value;
            }
        });
    };

    // Keyword qo'shish (default qiymat bilan)
    addSkillKeyword = (skillIndex: number) => {
        runInAction(() => {
            const skill = this.myResume?.skills?.[skillIndex];
            if (skill) {
                if (!skill.keywords) {
                    skill.keywords = [];
                }
                skill.keywords.push("");
            }
        });
    };

    // Keyword o'chirish

    removeSkillKeyword = (skillIndex: number, keywordIndex: number) => {
        runInAction(() => {
            const skill = this.myResume.skills?.[skillIndex];
            if (skill.keywords) {
                skill.keywords.splice(keywordIndex, 1);
            }
        });
    };

    // Keywordni yangilash
    updateSkillKeyword = (
        skillIndex: number,
        keywordIndex: number,
        newKeyword: string
    ) => {
        runInAction(() => {
            const skill = this.myResume.skills?.[skillIndex];
            if (skill.keywords && skill.keywords[keywordIndex] !== undefined) {
                skill.keywords[keywordIndex] = newKeyword;
            }
        });
    };

    // ✅ Languages
    addLanguage = () => {
        runInAction(() => {
            if (!this.myResume.languages) this.myResume.languages = [];
            this.myResume.languages.push({
                language: "",
                fluency: "",
            });
        });
    };

    removeLanguage = (index: number) => {
        runInAction(() => {
            this.myResume.languages?.splice(index, 1);
        });
    };

    updateLanguage = (index: number, key: keyof LanguageType, value: any) => {
        runInAction(() => {
            if (!this.myResume) {
                this.myResume = {} as ResumeType;
            }
            if (!this.myResume.languages) {
                this.myResume.languages = [];
            }

            if (!this.myResume.languages[index]) {
                this.myResume.languages[index] = {} as LanguageType;
            }

            this.myResume.languages[index][key] = value;
        });
    };

    // ✅ Projects
    addProject = (project: NonNullable<ResumeType>["projects"][number]) => {
        runInAction(() => {
            if (!this.myResume.projects) this.myResume.projects = [];
            this.myResume?.projects.push(project);
        });
    };

    removeProject = (index: number) => {
        runInAction(() => {
            this.myResume?.projects?.splice(index, 1);
        });
    };

    // ✅ Interests

    addInterest = () => {
        runInAction(() => {
            if (!this.myResume.interests) this.myResume.interests = [];
            this.myResume?.interests.push({
                name: "",
                keywords: [""],
            });
        });
    };

    removeInterest = (index: number) => {
        runInAction(() => {
            this.myResume?.interests?.splice(index, 1);
        });
    };

    updateInterest = (index: number, key: keyof InterestType, value: any) => {
        runInAction(() => {
            if (!this.myResume) {
                this.myResume = {} as ResumeType;
            }
            if (!this.myResume.interests) {
                this.myResume.interests = [];
            }

            if (!this.myResume.interests[index]) {
                this.myResume.interests[index] = {} as InterestType;
            }

            this.myResume.interests[index][key] = value;
        });
    };

    addInterestKeyword = (interestIndex: number) => {
        runInAction(() => {
            const interest = this.myResume?.interests?.[interestIndex];
            if (interest) {
                if (!interest.keywords) {
                    interest.keywords = [];
                }
                interest.keywords.push("");
            }
        });
    };

    // Keyword o'chirish

    removeInterestKeyword = (interestIndex: number, keywordIndex: number) => {
        runInAction(() => {
            const interest = this.myResume.interests?.[interestIndex];
            if (interest.keywords) {
                interest.keywords.splice(keywordIndex, 1);
            }
        });
    };

    // Keywordni yangilash
    updateInterestKeyword = (
        interestIndex: number,
        keywordIndex: number,
        newKeyword: string
    ) => {
        runInAction(() => {
            const interest = this.myResume.interests?.[interestIndex];
            if (
                interest.keywords &&
                interest.keywords[keywordIndex] !== undefined
            ) {
                interest.keywords[keywordIndex] = newKeyword;
            }
        });
    };

    // ✅ References
    addReference = (ref: NonNullable<ResumeType>["references"][number]) => {
        runInAction(() => {
            if (!this.myResume.references) this.myResume.references = [];
            this.myResume?.references.push(ref);
        });
    };

    removeReference = (index: number) => {
        runInAction(() => {
            this.myResume?.references?.splice(index, 1);
        });
    };
}
