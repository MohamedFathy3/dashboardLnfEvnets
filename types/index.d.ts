type ApiResponse = {
    data: Media | Media[] | PublicSetting | PublicSetting[] | City | City[] | Conference | Conference[] | Role | Role[] | Admin | Admin[] | Network | Network[] | Country | Country[] | Resource | Resource[] | Continent | Continent[];
    result: string;
    message: string;
    token: string;
    status: number;
};
type PublicSetting = {
    id: number;
    name: string;
    value: any;
};
type Conference = {
    id: number;
    name: string;
    cityId: number;
    countryId: number;
    city: string;
    country: string;
    flag: string;
    venue: string;
    virtual: boolean;
    active: boolean;
    orderId: number;
    earlyBirdActive: boolean;
    earlyBirdEndDate: string;
    regDeadlineDate: string;
    hotelBookingMaxDuration: string[];
    ebMemberDelegatePrice: number;
    ebMemberSpousePrice: number;
    ebNonMemberDelegatePrice: number;
    ebNonMemberSpousePrice: number;
    memberDelegatePrice: number;
    memberSpousePrice: number;
    nonMemberDelegatePrice: number;
    nonMemberSpousePrice: number;
    duration: string[];
    isPast: boolean;
    logoUrl: string;
    logo: Media; // Adjust the type according to your actual data type
    logoDarkUrl: string;
    logoDark: Media; // Adjust the type according to your actual data type
    deleted: boolean;
    deletedAt: string | null;
};
type Media = {
    id: number;
    name: string;
    fileName: string;
    mimeType: string;
    size: number;
    createdAt: string;
    previewUrl: string;
    url: string;
    fullUrl: string;
};
type Continent = {
    id: number;
    name: string;
    active: boolean;
    orderId: number;
    countries: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
};
type Network = {
    id: number;
    name: string;
    slug: string;
    domain: string;
    active: boolean;
    collection: boolean;
    orderId: string;
    imageUrl: string;
    image: Media;
};
type Resource = {
    id: number;
    active: boolean;
    name: string;
    slug: string;
    orderId: number;
    createdAt: boolean;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
}; // For Certificates | Services | Referrals
type Credentials = {
    email: string;
    password: string;
};
type Role = {
    id: number;
    name: string;
    permissions: string[];
};
type Admin = {
    id: number;
    name: string;
    email: string;
    superAdmin: boolean;
    roleId: number | undefined;
    role: Role;
};
type ToastItem = {
    title: string | null | undefined;
    message: string | null | undefined;
    type: string | null | undefined;
    duration: number | null | undefined;
};

type Country = {
    id: number;
    name: string;
    key: string;
    code: string;
    active: boolean;
    imageUrl: string;
    image: Media;
    orderId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
};
type City = {
    id: number;
    name: string;
    country: Country;
    orderId: number;
    countryName: string;
    countryId: number;
    lat: string;
    lng: string;
    active: number;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    deletedAt: string | null;
};

type SideBarMenu = {
    name: string;
    path: string;
    icon: string;
    subMenus: SideBarMenu[];
};
