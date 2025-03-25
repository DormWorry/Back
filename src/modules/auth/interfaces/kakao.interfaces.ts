export interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  refresh_token_expires_in: number;
}

export interface KakaoUserInfo {
  id: number;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    email?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    profile_needs_agreement?: boolean;
  };
}
