export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: string;
  created_at?: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  tone?: string;
  user_id?: number;
  industry?: string;
  core_values?: string;
  brand_voice?: string;
  communication_style?: string;
  marketing_preferences?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand_id: number;
  category_name?: string;
  usp?: string;
  key_features?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Audience {
  id: number;
  name: string;
  description?: string;
  platform?: string;
  brand_id: number;
  age_min?: number;
  age_max?: number;
  gender?: string;
  interests?: string;
  behaviors?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentRule {
  id: number;
  name: string;
  rules?: string;
  brand_id: number;
  category?: string;
  restricted_words?: string;
  warnings?: string;
  language_preference?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentItem {
  id: number;
  title: string;
  body: string;
  status: string;
  platform: string;
  brand_id: number;
  product_id?: number | null;
  target_customer_id?: number | null;
  rule_id?: number | null;
  content_type: string;
  language_preference?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentVersion {
  id: number;
  content_id: number;
  version_number: number;
  body: string;
  edited_by_user_id: number;
  change_summary?: string;
  created_at?: string;
}

export interface ProductAsset {
  id: number;
  name?: string;
  url: string;
  kind: string;
  product_id: number;
  extracted_tags?: string;
  color_palette?: string;
  created_at?: string;
}

export interface UserFeedback {
  id: number;
  content_id: number;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface AnalyticsSummary {
  total_brands: number;
  total_products: number;
  total_contents: number;
  total_reach: number;
  total_engagement: number;
  total_clicks: number;
}

export interface AnalyticsEvent {
  id: number;
  content_id: number;
  post_url?: string;
  reach_count: number;
  engagement_count: number;
  click_count: number;
  logged_at?: string;
}
