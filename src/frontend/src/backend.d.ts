import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RegionEntry {
    id: Id;
    region: string;
    country: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    artistName: string;
    subregion: string;
}
export interface WatchListEntry {
    id: Id;
    bio: string;
    socialLinks: Array<SocialLink>;
    isActive: boolean;
    updatedAt: Time;
    imageUrl: string;
    artistName: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface RundownStory {
    id: Id;
    title: string;
    contentBody: string;
    isPublished: boolean;
    publishedAt: Time;
    author: string;
    summary: string;
    imageUrl: string;
}
export interface SocialLink {
    url: string;
    platform: string;
}
export interface BeatChartEntry {
    id: Id;
    bpm: bigint;
    title: string;
    rank: bigint;
    audioLink: string;
    isActive: boolean;
    genre: string;
    producer: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type Id = bigint;
export interface Subscriber {
    id: Id;
    subscribedAt: Time;
    email: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface ProducerTip {
    id: Id;
    isPublished: boolean;
    producerImageUrl: string;
    producerName: string;
    tipTitle: string;
    tipBody: string;
}
export interface SongSubmission {
    id: Id;
    status: string;
    paymentStatus: string;
    songLink: string;
    songTitle: string;
    submittedAt: Time;
    genre: string;
    contactEmail: string;
    artistName: string;
    contactPhone: string;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    id: Id;
    isPublished: boolean;
    songTitle: string;
    reviewerName: string;
    reviewedAt: Time;
    genre: string;
    rating: bigint;
    artistName: string;
    commentary: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBeatChartEntry(entry: BeatChartEntry): Promise<Id>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createProducerTip(tip: ProducerTip): Promise<Id>;
    createRegionEntry(entry: RegionEntry): Promise<Id>;
    createReview(review: Review): Promise<Id>;
    createRundownStory(story: RundownStory): Promise<Id>;
    createSongSubmission(submission: SongSubmission): Promise<Id>;
    createSubscriber(email: string): Promise<Id>;
    createWatchListEntry(entry: WatchListEntry): Promise<Id>;
    deleteBeatChartEntry(id: Id): Promise<void>;
    deleteProducerTip(id: Id): Promise<void>;
    deleteRegionEntry(id: Id): Promise<void>;
    deleteReview(id: Id): Promise<void>;
    deleteRundownStory(id: Id): Promise<void>;
    deleteSongSubmission(id: Id): Promise<void>;
    deleteSubscriber(id: Id): Promise<void>;
    getActiveWatchList(): Promise<WatchListEntry>;
    getAllActiveBeatChartEntries(): Promise<Array<BeatChartEntry>>;
    getAllActiveRegionEntries(): Promise<Array<RegionEntry>>;
    getAllPublishedProducerTips(): Promise<Array<ProducerTip>>;
    getAllPublishedReviews(): Promise<Array<Review>>;
    getAllRundownStories(): Promise<Array<RundownStory>>;
    getAllSongSubmissions(): Promise<Array<SongSubmission>>;
    getAllSubscribers(): Promise<Array<Subscriber>>;
    getAllWatchListEntries(): Promise<Array<WatchListEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublishedRundownStories(): Promise<Array<RundownStory>>;
    getRundownStory(id: Id): Promise<RundownStory>;
    getSongSubmission(id: Id): Promise<SongSubmission>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setActiveWatchList(id: Id): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBeatChartEntry(id: Id, entry: BeatChartEntry): Promise<void>;
    updateProducerTip(id: Id, tip: ProducerTip): Promise<void>;
    updateRegionEntry(id: Id, entry: RegionEntry): Promise<void>;
    updateReview(id: Id, review: Review): Promise<void>;
    updateRundownStory(id: Id, story: RundownStory): Promise<void>;
    updateSubmissionPaymentStatus(id: Id, paymentStatus: string): Promise<void>;
    updateSubmissionStatus(id: Id, status: string): Promise<void>;
    updateWatchListEntry(id: Id, entry: WatchListEntry): Promise<void>;
}
