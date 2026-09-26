export interface Applicant {
    applicationType: string;
    membershipFee: string;
    firstname: string;
    lastname: string;
    alias?: string;
    dob?: string;
    pfgaNumber?: string;
    address?: string;
    city?: string;
    province?: string;
    postal?: string;
    homephone?: string;
    cellphone?: string;
    email: string;
    palType?: string;
    palDate?: string;
    palNum?: string;
    palExpiry?: string;
    disciplines: string[];
    family: Family[];
    clubs: Clubs[];
    courses: Courses[];
    extra: Number;
    familyCount: Number;
    photo?: Photo;
}

export interface Family {
    firstname: string;
    lastname: string;
    pal?: string;
    expiry?: string;
    dob: string;
    photo?: Photo;
}

export interface Clubs {
    name: string;
    city?: string;
    from?: string;
    to?: string;
}

export interface Courses {
    desc?: string;
    trainer?: string;
    location?: string;
    date?: string;
}

export interface Photo {
    name: string;
    type: string;
    data: string;   
}