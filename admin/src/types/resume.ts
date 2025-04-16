export interface Resume {
  title: string
  description: string
  skills: { name: string; level: string; keywords: string[] }[]
  experience: {
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }[]
  education: {
    institution: string
    area: string
    studyType: string
    startDate: string
    endDate: string
    gpa: string
  }[]
}

export interface ResumeData extends Resume {
  cvFile?: {
    url: string
    filename: string
  }
} 