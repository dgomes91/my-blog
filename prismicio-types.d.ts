import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type AboutDocumentDataSlicesSlice = never

/**
 * Item in *About → Principles*
 */
export interface AboutDocumentDataPrinciplesItem {
	/**
	 * Icon field in *About → Principles*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.principles[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"Shield" | "Zap" | "Eye" | "BookOpen">;
	
	/**
	 * Title field in *About → Principles*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.principles[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Body field in *About → Principles*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.principles[].body
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body: prismic.KeyTextField;
}

/**
 * Item in *About → Team Members*
 */
export interface AboutDocumentDataTeamMembersItem {
	
}

/**
 * Item in *About → Timeline*
 */
export interface AboutDocumentDataTimelineItem {
	/**
	 * Year field in *About → Timeline*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.timeline[].year
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	year: prismic.KeyTextField;
	
	/**
	 * Event field in *About → Timeline*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.timeline[].event
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	event: prismic.KeyTextField;
}

/**
 * Content for About documents
 */
interface AboutDocumentData {
	/**
	 * Slice Zone field in *About*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<AboutDocumentDataSlicesSlice>;
	
	/**
	 * Hero Label field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.hero_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	hero_label: prismic.KeyTextField;
	
	/**
	 * Hero Title field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.hero_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	hero_title: prismic.KeyTextField;
	
	/**
	 * Hero Description field in *About*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.hero_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	hero_description: prismic.RichTextField;
	
	/**
	 * Principles field in *About*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.principles[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	principles: prismic.GroupField<Simplify<AboutDocumentDataPrinciplesItem>>;
	
	/**
	 * Team Members field in *About*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.team_members[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	team_members: prismic.GroupField<Simplify<AboutDocumentDataTeamMembersItem>>;
	
	/**
	 * Timeline field in *About*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.timeline[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	timeline: prismic.GroupField<Simplify<AboutDocumentDataTimelineItem>>;
	
	/**
	 * Editorial Policy Title field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.editorial_policy_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	editorial_policy_title: prismic.KeyTextField;
	
	/**
	 * Editorial Policy Body field in *About*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.editorial_policy_body
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	editorial_policy_body: prismic.RichTextField;
	
	/**
	 * Advertise Cta Label field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.advertise_cta_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	advertise_cta_label: prismic.KeyTextField;
	
	/**
	 * Advertise Cta Link field in *About*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.advertise_cta_link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	advertise_cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Contact Cta Label field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.contact_cta_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	contact_cta_label: prismic.KeyTextField;
	
	/**
	 * Contact Cta Link field in *About*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.contact_cta_link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	contact_cta_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Seo Title field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.seo_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_title: prismic.KeyTextField;
	
	/**
	 * Seo Description field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.seo_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_description: prismic.KeyTextField;
	
	/**
	 * Seo Image field in *About*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.seo_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	seo_image: prismic.ImageField<never>;/**
	 * Meta Title field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: about.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *About*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: about.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *About*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * About document from Prismic
 *
 * - **API ID**: `about`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AboutDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<AboutDocumentData>, "about", Lang>;

type ArticleDocumentDataSlicesSlice = NewsletterCtaSlice | CalloutSlice | ComparisonTableSlice | GallerySlice | ImageBlockSlice | ProsConsSlice | PullQuoteSlice | RankingListSlice | RelatedArticlesSlice | RichTextSlice | VideoEmbedSlice

/**
 * Item in *Article → Tags*
 */
export interface ArticleDocumentDataTagsItem {
	/**
	 * Tag field in *Article → Tags*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.tags[].tag
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tag: prismic.KeyTextField;
}

/**
 * Content for Article documents
 */
interface ArticleDocumentData {
	/**
	 * Slice Zone field in *Article*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ArticleDocumentDataSlicesSlice>;
	
	/**
	 * Title field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Excerpt field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.excerpt
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	excerpt: prismic.KeyTextField;
	
	/**
	 * Format field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Notícia
	 * - **API ID Path**: article.format
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	format: prismic.SelectField<"Notícia" | "Review" | "Lista TOP", "filled">;
	
	/**
	 * Cover Image field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.cover_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	cover_image: prismic.ImageField<never>;
	
	/**
	 * Author field in *Article*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.author
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	author: ContentRelationshipFieldWithData<[{"id":"author","fields":["name","avatar","role"]}]>;
	
	/**
	 * Tags field in *Article*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.tags[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	tags: prismic.GroupField<Simplify<ArticleDocumentDataTagsItem>>;
	
	/**
	 * Breaking field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: article.breaking
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	breaking: prismic.BooleanField;
	
	/**
	 * Is Preview field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: article.is_preview
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	is_preview: prismic.BooleanField;
	
	/**
	 * Featured field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: article.featured
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	featured: prismic.BooleanField;
	
	/**
	 * Reading Minutes field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.reading_minutes
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	reading_minutes: prismic.NumberField;
	
	/**
	 * Review Score field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.review_score
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	review_score: prismic.NumberField;
	
	/**
	 * Review Copy Disclosure field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.review_copy_disclosure
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	review_copy_disclosure: prismic.KeyTextField;
	
	/**
	 * Early Access field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: article.early_access
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	early_access: prismic.BooleanField;
	
	/**
	 * Score Revision Note field in *Article*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.score_revision_note
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	score_revision_note: prismic.RichTextField;
	
	/**
	 * List Type field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.list_type
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	list_type: prismic.SelectField<"Tier List" | "Top N" | "Recomendação">;
	
	/**
	 * List Item Count field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.list_item_count
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	list_item_count: prismic.NumberField;
	
	/**
	 * Publish Date Override field in *Article*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.publish_date_override
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	publish_date_override: prismic.DateField;
	
	/**
	 * Seo Title field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.seo_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_title: prismic.KeyTextField;
	
	/**
	 * Seo Description field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.seo_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_description: prismic.KeyTextField;
	
	/**
	 * Seo Image field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.seo_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	seo_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: article.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: article.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Article document from Prismic
 *
 * - **API ID**: `article`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ArticleDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ArticleDocumentData>, "article", Lang>;

/**
 * Item in *Author → Focus Tags*
 */
export interface AuthorDocumentDataFocusTagsItem {
	/**
	 * Tag field in *Author → Focus Tags*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.focus_tags[].tag
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tag: prismic.KeyTextField;
}

/**
 * Item in *Author → Social Links*
 */
export interface AuthorDocumentDataSocialLinksItem {
	/**
	 * Platform field in *Author → Social Links*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.social_links[].platform
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	platform: prismic.SelectField<"X (Twitter)" | "Instagram" | "YouTube" | "Twitch" | "LinkedIn" | "Site Pessoal">;
	
	/**
	 * Url field in *Author → Social Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.social_links[].url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Author documents
 */
interface AuthorDocumentData {
	/**
	 * Name field in *Author*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Role field in *Author*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.role
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	role: prismic.KeyTextField;
	
	/**
	 * Avatar field in *Author*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.avatar
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	avatar: prismic.ImageField<never>;
	
	/**
	 * Bio field in *Author*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.bio
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	bio: prismic.RichTextField;
	
	/**
	 * Focus Tags field in *Author*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.focus_tags[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	focus_tags: prismic.GroupField<Simplify<AuthorDocumentDataFocusTagsItem>>;
	
	/**
	 * Social Links field in *Author*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.social_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	social_links: prismic.GroupField<Simplify<AuthorDocumentDataSocialLinksItem>>;
	
	/**
	 * Email field in *Author*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: author.email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * Is Founder field in *Author*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: author.is_founder
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	is_founder: prismic.BooleanField;
	
	/**
	 * Active field in *Author*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: author.active
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	active: prismic.BooleanField;
}

/**
 * Author document from Prismic
 *
 * - **API ID**: `author`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AuthorDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<AuthorDocumentData>, "author", Lang>;

/**
 * Item in *Game → Platforms*
 */
export interface GameDocumentDataPlatformsItem {
	/**
	 * Platform field in *Game → Platforms*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.platforms[].platform
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	platform: prismic.SelectField<"PC" | "PlayStation 5" | "Xbox Series X|S" | "Nintendo Switch" | "Nintendo Switch 2" | "Mac" | "Linux">;
}

/**
 * Item in *Game → Store Links*
 */
export interface GameDocumentDataStoreLinksItem {
	/**
	 * Store field in *Game → Store Links*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.store_links[].store
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	store: prismic.SelectField<"Steam" | "GOG" | "Epic Games Store" | "PlayStation Store" | "Xbox Store" | "Nintendo eShop" | "Site Oficial">;
	
	/**
	 * Url field in *Game → Store Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.store_links[].url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Game documents
 */
interface GameDocumentData {
	/**
	 * Title field in *Game*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Developer field in *Game*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.developer
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	developer: prismic.KeyTextField;
	
	/**
	 * Publisher field in *Game*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.publisher
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher: prismic.KeyTextField;
	
	/**
	 * Release Date field in *Game*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.release_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	release_date: prismic.DateField;
	
	/**
	 * Release Status field in *Game*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Lançado
	 * - **API ID Path**: game.release_status
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	release_status: prismic.SelectField<"Lançado" | "Anunciado" | "Em Desenvolvimento" | "Acesso Antecipado", "filled">;
	
	/**
	 * Summary field in *Game*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.summary
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	summary: prismic.KeyTextField;
	
	/**
	 * Description field in *Game*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Cover Image field in *Game*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.cover_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	cover_image: prismic.ImageField<never>;
	
	/**
	 * Platforms field in *Game*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.platforms[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	platforms: prismic.GroupField<Simplify<GameDocumentDataPlatformsItem>>;
	
	/**
	 * Store Links field in *Game*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.store_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	store_links: prismic.GroupField<Simplify<GameDocumentDataStoreLinksItem>>;
	
	/**
	 * Franchise field in *Game*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: game.franchise
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	franchise: prismic.KeyTextField;
}

/**
 * Game document from Prismic
 *
 * - **API ID**: `game`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type GameDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<GameDocumentData>, "game", Lang>;

type HomepageDocumentDataSlicesSlice = never

/**
 * Item in *Homepage → Reading Picks*
 */
export interface HomepageDocumentDataReadingPicksItem {
	/**
	 * Article field in *Homepage → Reading Picks*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.reading_picks[].article
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	article: ContentRelationshipFieldWithData<[{"id":"article","fields":["title","cover_image","format"]}]>;
}

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;
	
	/**
	 * Hero Override field in *Homepage*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.hero_override
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	hero_override: ContentRelationshipFieldWithData<[{"id":"article","fields":["title","excerpt","cover_image","format"]}]>;
	
	/**
	 * Reading Picks field in *Homepage*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.reading_picks[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	reading_picks: prismic.GroupField<Simplify<HomepageDocumentDataReadingPicksItem>>;
	
	/**
	 * Seo Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.seo_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_title: prismic.KeyTextField;
	
	/**
	 * Seo Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.seo_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_description: prismic.KeyTextField;
	
	/**
	 * Seo Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.seo_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	seo_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

type PageDocumentDataSlicesSlice = ComparisonTableSlice | ImageBlockSlice | RichTextSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
	/**
	 * Slice Zone field in *Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;
	
	/**
	 * Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Subtitle field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.subtitle
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Seo Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.seo_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_title: prismic.KeyTextField;
	
	/**
	 * Seo Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.seo_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_description: prismic.KeyTextField;
	
	/**
	 * Seo Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.seo_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	seo_image: prismic.ImageField<never>;/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

type SiteSettingsDocumentDataSlicesSlice = never

/**
 * Content for Site Settings documents
 */
interface SiteSettingsDocumentData {
	/**
	 * Slice Zone field in *Site Settings*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<SiteSettingsDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: site_settings.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: site_settings.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Site Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Site Settings document from Prismic
 *
 * - **API ID**: `site_settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SiteSettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SiteSettingsDocumentData>, "site_settings", Lang>;

export type AllDocumentTypes = AboutDocument | ArticleDocument | AuthorDocument | GameDocument | HomepageDocument | PageDocument | SiteSettingsDocument;

/**
 * Primary content in *Callout → Default → Primary*
 */
export interface CalloutSliceDefaultPrimary {
	/**
	 * Title field in *Callout → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *Callout → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Type field in *Callout → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: callout.default.primary.type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	type: prismic.SelectField<"Dica" | "Aviso" | "Importante">;
}

/**
 * Default variation for Callout Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CalloutSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Callout*
 */
type CalloutSliceVariation = CalloutSliceDefault

/**
 * Callout Shared Slice
 *
 * - **API ID**: `callout`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CalloutSlice = prismic.SharedSlice<"callout", CalloutSliceVariation>;

/**
 * Primary content in *Comparison Table → Default → Primary*
 */
export interface ComparisonTableSliceDefaultPrimary {
	/**
	 * Title field in *Comparison Table → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: comparison_table.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Table field in *Comparison Table → Default → Primary*
	 *
	 * - **Field Type**: Table
	 * - **Placeholder**: *None*
	 * - **API ID Path**: comparison_table.default.primary.table
	 * - **Documentation**: https://prismic.io/docs/fields/table
	 */
	table: prismic.TableField;
	
	/**
	 * Note field in *Comparison Table → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: comparison_table.default.primary.note
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	note: prismic.KeyTextField;
}

/**
 * Default variation for Comparison Table Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ComparisonTableSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ComparisonTableSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Comparison Table*
 */
type ComparisonTableSliceVariation = ComparisonTableSliceDefault

/**
 * Comparison Table Shared Slice
 *
 * - **API ID**: `comparison_table`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ComparisonTableSlice = prismic.SharedSlice<"comparison_table", ComparisonTableSliceVariation>;

/**
 * Item in *Gallery → Default → Primary → Images*
 */
export interface GallerySliceDefaultPrimaryImagesItem {
	/**
	 * Image field in *Gallery → Default → Primary → Images*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery.default.primary.images[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *Gallery → Default → Primary → Images*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery.default.primary.images[].caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Primary content in *Gallery → Default → Primary*
 */
export interface GallerySliceDefaultPrimary {
	/**
	 * Title field in *Gallery → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Images field in *Gallery → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery.default.primary.images[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	images: prismic.GroupField<Simplify<GallerySliceDefaultPrimaryImagesItem>>;
}

/**
 * Default variation for Gallery Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type GallerySliceDefault = prismic.SharedSliceVariation<"default", Simplify<GallerySliceDefaultPrimary>, never>;

/**
 * Slice variation for *Gallery*
 */
type GallerySliceVariation = GallerySliceDefault

/**
 * Gallery Shared Slice
 *
 * - **API ID**: `gallery`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type GallerySlice = prismic.SharedSlice<"gallery", GallerySliceVariation>;

/**
 * Primary content in *Image Block → Default → Primary*
 */
export interface ImageBlockSliceDefaultPrimary {
	/**
	 * Image field in *Image Block → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_block.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *Image Block → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_block.default.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
	
	/**
	 * Credit field in *Image Block → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_block.default.primary.credit
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	credit: prismic.KeyTextField;
}

/**
 * Default variation for Image Block Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageBlockSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ImageBlockSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Image Block*
 */
type ImageBlockSliceVariation = ImageBlockSliceDefault

/**
 * Image Block Shared Slice
 *
 * - **API ID**: `image_block`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageBlockSlice = prismic.SharedSlice<"image_block", ImageBlockSliceVariation>;

/**
 * Primary content in *Newsletter Cta → Default → Primary*
 */
export interface NewsletterCtaSliceDefaultPrimary {
	/**
	 * Heading field in *Newsletter Cta → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: newsletter_cta.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Subtext field in *Newsletter Cta → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: newsletter_cta.default.primary.subtext
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtext: prismic.KeyTextField;
	
	/**
	 * Button Label field in *Newsletter Cta → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: newsletter_cta.default.primary.button_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_label: prismic.KeyTextField;
}

/**
 * Default variation for Newsletter Cta Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NewsletterCtaSliceDefault = prismic.SharedSliceVariation<"default", Simplify<NewsletterCtaSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Newsletter Cta*
 */
type NewsletterCtaSliceVariation = NewsletterCtaSliceDefault

/**
 * Newsletter Cta Shared Slice
 *
 * - **API ID**: `newsletter_cta`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NewsletterCtaSlice = prismic.SharedSlice<"newsletter_cta", NewsletterCtaSliceVariation>;

/**
 * Primary content in *Pros Cons → Default → Primary*
 */
export interface ProsConsSliceDefaultPrimary {
	/**
	 * Title field in *Pros Cons → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pros_cons.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Pros field in *Pros Cons → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pros_cons.default.primary.pros
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	pros: prismic.RichTextField;
	
	/**
	 * Cons field in *Pros Cons → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pros_cons.default.primary.cons
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	cons: prismic.RichTextField;
}

/**
 * Default variation for Pros Cons Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProsConsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProsConsSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Pros Cons*
 */
type ProsConsSliceVariation = ProsConsSliceDefault

/**
 * Pros Cons Shared Slice
 *
 * - **API ID**: `pros_cons`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProsConsSlice = prismic.SharedSlice<"pros_cons", ProsConsSliceVariation>;

/**
 * Primary content in *Pull Quote → Default → Primary*
 */
export interface PullQuoteSliceDefaultPrimary {
	/**
	 * Quote field in *Pull Quote → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pull_quote.default.primary.quote
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	quote: prismic.RichTextField;
	
	/**
	 * Attribution field in *Pull Quote → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: pull_quote.default.primary.attribution
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	attribution: prismic.KeyTextField;
}

/**
 * Default variation for Pull Quote Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PullQuoteSliceDefault = prismic.SharedSliceVariation<"default", Simplify<PullQuoteSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Pull Quote*
 */
type PullQuoteSliceVariation = PullQuoteSliceDefault

/**
 * Pull Quote Shared Slice
 *
 * - **API ID**: `pull_quote`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PullQuoteSlice = prismic.SharedSlice<"pull_quote", PullQuoteSliceVariation>;

/**
 * Item in *Ranking List → Default → Primary → Items*
 */
export interface RankingListSliceDefaultPrimaryItemsItem {
	/**
	 * Name field in *Ranking List → Default → Primary → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.items[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Description field in *Ranking List → Default → Primary → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.items[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
	
	/**
	 * Image field in *Ranking List → Default → Primary → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.items[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Tier field in *Ranking List → Default → Primary → Items*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.items[].tier
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tier: prismic.SelectField<"S" | "A" | "B" | "C" | "D">;
}

/**
 * Primary content in *Ranking List → Default → Primary*
 */
export interface RankingListSliceDefaultPrimary {
	/**
	 * Title field in *Ranking List → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Intro field in *Ranking List → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.intro
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	intro: prismic.RichTextField;
	
	/**
	 * Items field in *Ranking List → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: ranking_list.default.primary.items[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	items: prismic.GroupField<Simplify<RankingListSliceDefaultPrimaryItemsItem>>;
}

/**
 * Default variation for Ranking List Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RankingListSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RankingListSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Ranking List*
 */
type RankingListSliceVariation = RankingListSliceDefault

/**
 * Ranking List Shared Slice
 *
 * - **API ID**: `ranking_list`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RankingListSlice = prismic.SharedSlice<"ranking_list", RankingListSliceVariation>;

/**
 * Item in *Related Articles → Default → Primary → Articles*
 */
export interface RelatedArticlesSliceDefaultPrimaryArticlesItem {
	/**
	 * Article field in *Related Articles → Default → Primary → Articles*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related_articles.default.primary.articles[].article
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	article: ContentRelationshipFieldWithData<[{"id":"article","fields":["title","cover_image","format","excerpt"]}]>;
}

/**
 * Primary content in *Related Articles → Default → Primary*
 */
export interface RelatedArticlesSliceDefaultPrimary {
	/**
	 * Heading field in *Related Articles → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related_articles.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Articles field in *Related Articles → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: related_articles.default.primary.articles[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	articles: prismic.GroupField<Simplify<RelatedArticlesSliceDefaultPrimaryArticlesItem>>;
}

/**
 * Default variation for Related Articles Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RelatedArticlesSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RelatedArticlesSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Related Articles*
 */
type RelatedArticlesSliceVariation = RelatedArticlesSliceDefault

/**
 * Related Articles Shared Slice
 *
 * - **API ID**: `related_articles`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RelatedArticlesSlice = prismic.SharedSlice<"related_articles", RelatedArticlesSliceVariation>;

/**
 * Primary content in *Rich Text → Default → Primary*
 */
export interface RichTextSliceDefaultPrimary {
	/**
	 * Content field in *Rich Text → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: rich_text.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for Rich Text Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RichTextSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Rich Text*
 */
type RichTextSliceVariation = RichTextSliceDefault

/**
 * Rich Text Shared Slice
 *
 * - **API ID**: `rich_text`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSlice = prismic.SharedSlice<"rich_text", RichTextSliceVariation>;

/**
 * Primary content in *Video Embed → Default → Primary*
 */
export interface VideoEmbedSliceDefaultPrimary {
	/**
	 * Video field in *Video Embed → Default → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: video_embed.default.primary.video
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	video: prismic.EmbedField
	
	/**
	 * Caption field in *Video Embed → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: video_embed.default.primary.caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Default variation for Video Embed Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VideoEmbedSliceDefault = prismic.SharedSliceVariation<"default", Simplify<VideoEmbedSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Video Embed*
 */
type VideoEmbedSliceVariation = VideoEmbedSliceDefault

/**
 * Video Embed Shared Slice
 *
 * - **API ID**: `video_embed`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VideoEmbedSlice = prismic.SharedSlice<"video_embed", VideoEmbedSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			AboutDocument,
			AboutDocumentData,
			AboutDocumentDataSlicesSlice,
			AboutDocumentDataPrinciplesItem,
			AboutDocumentDataTeamMembersItem,
			AboutDocumentDataTimelineItem,
			ArticleDocument,
			ArticleDocumentData,
			ArticleDocumentDataSlicesSlice,
			ArticleDocumentDataTagsItem,
			AuthorDocument,
			AuthorDocumentData,
			AuthorDocumentDataFocusTagsItem,
			AuthorDocumentDataSocialLinksItem,
			GameDocument,
			GameDocumentData,
			GameDocumentDataPlatformsItem,
			GameDocumentDataStoreLinksItem,
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			HomepageDocumentDataReadingPicksItem,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			SiteSettingsDocument,
			SiteSettingsDocumentData,
			SiteSettingsDocumentDataSlicesSlice,
			AllDocumentTypes,
			CalloutSlice,
			CalloutSliceDefaultPrimary,
			CalloutSliceVariation,
			CalloutSliceDefault,
			ComparisonTableSlice,
			ComparisonTableSliceDefaultPrimary,
			ComparisonTableSliceVariation,
			ComparisonTableSliceDefault,
			GallerySlice,
			GallerySliceDefaultPrimaryImagesItem,
			GallerySliceDefaultPrimary,
			GallerySliceVariation,
			GallerySliceDefault,
			ImageBlockSlice,
			ImageBlockSliceDefaultPrimary,
			ImageBlockSliceVariation,
			ImageBlockSliceDefault,
			NewsletterCtaSlice,
			NewsletterCtaSliceDefaultPrimary,
			NewsletterCtaSliceVariation,
			NewsletterCtaSliceDefault,
			ProsConsSlice,
			ProsConsSliceDefaultPrimary,
			ProsConsSliceVariation,
			ProsConsSliceDefault,
			PullQuoteSlice,
			PullQuoteSliceDefaultPrimary,
			PullQuoteSliceVariation,
			PullQuoteSliceDefault,
			RankingListSlice,
			RankingListSliceDefaultPrimaryItemsItem,
			RankingListSliceDefaultPrimary,
			RankingListSliceVariation,
			RankingListSliceDefault,
			RelatedArticlesSlice,
			RelatedArticlesSliceDefaultPrimaryArticlesItem,
			RelatedArticlesSliceDefaultPrimary,
			RelatedArticlesSliceVariation,
			RelatedArticlesSliceDefault,
			RichTextSlice,
			RichTextSliceDefaultPrimary,
			RichTextSliceVariation,
			RichTextSliceDefault,
			VideoEmbedSlice,
			VideoEmbedSliceDefaultPrimary,
			VideoEmbedSliceVariation,
			VideoEmbedSliceDefault
		}
	}
}