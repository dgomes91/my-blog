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

type ArticleDocumentDataSlicesSlice = never

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

/**
 * Item in *Site Settings → Primary Nav*
 */
export interface SiteSettingsDocumentDataPrimaryNavItem {
	/**
	 * Label field in *Site Settings → Primary Nav*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.primary_nav[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Site Settings → Primary Nav*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.primary_nav[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Site Settings → Footer Nav*
 */
export interface SiteSettingsDocumentDataFooterNavItem {
	/**
	 * Label field in *Site Settings → Footer Nav*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.footer_nav[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Site Settings → Footer Nav*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.footer_nav[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Column field in *Site Settings → Footer Nav*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.footer_nav[].column
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	column: prismic.SelectField<"Institucional" | "Conteúdo" | "Jogos" | "Legal">;
}

/**
 * Item in *Site Settings → Social Links*
 */
export interface SiteSettingsDocumentDataSocialLinksItem {
	/**
	 * Platform field in *Site Settings → Social Links*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.social_links[].platform
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	platform: prismic.SelectField<"X (Twitter)" | "Instagram" | "YouTube" | "Twitch" | "Discord" | "RSS">;
	
	/**
	 * Url field in *Site Settings → Social Links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.social_links[].url
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Site Settings → Trending Topics*
 */
export interface SiteSettingsDocumentDataTrendingTopicsItem {
	/**
	 * Title field in *Site Settings → Trending Topics*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.trending_topics[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Link field in *Site Settings → Trending Topics*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.trending_topics[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Views Label field in *Site Settings → Trending Topics*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.trending_topics[].views_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	views_label: prismic.KeyTextField;
}

/**
 * Item in *Site Settings → Ad Slots*
 */
export interface SiteSettingsDocumentDataAdSlotsItem {
	/**
	 * Slot Name field in *Site Settings → Ad Slots*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.ad_slots[].slot_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	slot_name: prismic.KeyTextField;
	
	/**
	 * Ad Unit Id field in *Site Settings → Ad Slots*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.ad_slots[].ad_unit_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	ad_unit_id: prismic.KeyTextField;
	
	/**
	 * Network field in *Site Settings → Ad Slots*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.ad_slots[].network
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	network: prismic.SelectField<"Google AdSense" | "Google Ad Manager">;
}

/**
 * Content for Site Settings documents
 */
interface SiteSettingsDocumentData {
	/**
	 * Site Name field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.site_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_name: prismic.KeyTextField;
	
	/**
	 * Tagline field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.tagline
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Logo field in *Site Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Favicon field in *Site Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.favicon
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	favicon: prismic.ImageField<never>;
	
	/**
	 * Seo Default Title field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.seo_default_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_default_title: prismic.KeyTextField;
	
	/**
	 * Seo Default Description field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.seo_default_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	seo_default_description: prismic.KeyTextField;
	
	/**
	 * Seo Default Image field in *Site Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.seo_default_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	seo_default_image: prismic.ImageField<never>;
	
	/**
	 * Primary Nav field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.primary_nav[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	primary_nav: prismic.GroupField<Simplify<SiteSettingsDocumentDataPrimaryNavItem>>;
	
	/**
	 * Footer Nav field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.footer_nav[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	footer_nav: prismic.GroupField<Simplify<SiteSettingsDocumentDataFooterNavItem>>;
	
	/**
	 * Social Links field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.social_links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	social_links: prismic.GroupField<Simplify<SiteSettingsDocumentDataSocialLinksItem>>;
	
	/**
	 * Newsletter Heading field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.newsletter_heading
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	newsletter_heading: prismic.KeyTextField;
	
	/**
	 * Newsletter Subtext field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.newsletter_subtext
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	newsletter_subtext: prismic.KeyTextField;
	
	/**
	 * Newsletter Button Label field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.newsletter_button_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	newsletter_button_label: prismic.KeyTextField;
	
	/**
	 * Trending Topics field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.trending_topics[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	trending_topics: prismic.GroupField<Simplify<SiteSettingsDocumentDataTrendingTopicsItem>>;
	
	/**
	 * Ad Slots field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.ad_slots[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	ad_slots: prismic.GroupField<Simplify<SiteSettingsDocumentDataAdSlotsItem>>;
	
	/**
	 * Ga Measurement Id field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.ga_measurement_id
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	ga_measurement_id: prismic.KeyTextField;
	
	/**
	 * Gtm Container Id field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.gtm_container_id
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	gtm_container_id: prismic.KeyTextField;
	
	/**
	 * Contact Email field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: site_settings.contact_email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	contact_email: prismic.KeyTextField;
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

export type AllDocumentTypes = ArticleDocument | AuthorDocument | GameDocument | SiteSettingsDocument;

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
			SiteSettingsDocument,
			SiteSettingsDocumentData,
			SiteSettingsDocumentDataPrimaryNavItem,
			SiteSettingsDocumentDataFooterNavItem,
			SiteSettingsDocumentDataSocialLinksItem,
			SiteSettingsDocumentDataTrendingTopicsItem,
			SiteSettingsDocumentDataAdSlotsItem,
			AllDocumentTypes
		}
	}
}