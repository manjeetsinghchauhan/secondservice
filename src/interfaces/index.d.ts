// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="Model.d.ts"/>

// Global type declarations
declare global {
    interface Device {
        deviceId: string;
        platform: string;
        remoteAddress?: string;
    }

    interface GeoLocation {
        latitude: number;
        longitude: number;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
        timezone?: string;
    }

    interface TokenData {
        userId: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        countryCode?: string;
        mobileNo?: string;
        userType: string;
        salt?: string;
        profilePicture?: string;
        profileSteps?: string;
        isApproved?: boolean;
        created?: number;
        platform?: string;
        deviceId?: string;
    }

    interface JwtPayload {
        iss: string;
        aud: string;
        sub: string;
        deviceId: string;
        iat: number;
        exp: number;
        prm: string;
    }

    interface Interests {
        name: string;
        _id?: string;
    }

    interface ListingRequest {
        pageNo?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    }

    interface Pagination {
        pageNo?: number;
        limit?: number;
    }

    interface UserId {
        userId: string;
    }
}

// Export for module usage
export interface Device {
    deviceId: string;
    platform: string;
    remoteAddress?: string;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    timezone?: string;
}

export interface TokenData {
    userId: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    countryCode?: string;
    mobileNo?: string;
    userType: string;
    salt?: string;
    profilePicture?: string;
    profileSteps?: string;
    isApproved?: boolean;
    created?: number;
    platform?: string;
    deviceId?: string;
}

export interface JwtPayload {
    iss: string;
    aud: string;
    sub: string;
    deviceId: string;
    iat: number;
    exp: number;
    prm: string;
}

export interface Interests {
    name: string;
    _id?: string;
}

export interface ListingRequest {
    pageNo?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface Pagination {
    pageNo?: number;
    limit?: number;
}

export interface UserId {
    userId: string;
}

export {};
